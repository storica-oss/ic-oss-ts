import { Principal } from '@dfinity/principal'
import {
  DerivedPublicKey,
  EncryptedVetKey,
  TransportSecretKey
} from '@dfinity/vetkeys'
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js'
import { randomBytes } from '@noble/ciphers/utils.js'
import { sha3_256 } from '@noble/hashes/sha3.js'
import type {
  DerivedZoneKey,
  EncryptionInfoV1,
  FileKeyEnvelopeV1,
  KeyProviderRef,
  ZoneKeyEnvelopeV1
} from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'

export const ENCRYPTION_FORMAT_V1 = 1
export const XCHACHA_KEY_SIZE = 32
export const XCHACHA_NONCE_SIZE = 24
export const XCHACHA_TAG_SIZE = 16
export const ENCRYPTION_NONCE_PREFIX_SIZE = 16

const encoder = new TextEncoder()
const zoneKekDomain = 'ic-oss/zone-zwk/v1'

export function encryptedSyncCommitment(
  zoneWrappingKey: Uint8Array,
  plaintextHash: Uint8Array
): Uint8Array {
  assertLength(zoneWrappingKey, 32, 'zone wrapping key')
  assertLength(plaintextHash, 32, 'plaintext hash')
  const material = concat(
    encoder.encode('ic-oss/sync-commitment/v1'),
    zoneWrappingKey,
    plaintextHash
  )
  try {
    return sha3_256(material)
  } finally {
    material.fill(0)
  }
}

function copyAndClear(value: Uint8Array): Uint8Array {
  try {
    return new Uint8Array(value)
  } finally {
    value.fill(0)
  }
}

export interface PreparedFileEncryption {
  info: EncryptionInfoV1
  fileDek: Uint8Array
}

export function zoneVetkdInput(
  bucket: Principal,
  owner: Principal,
  zoneId: Uint8Array,
  keyVersion: number
): Uint8Array {
  return sha3_256(
    concat(
      encoder.encode('ic-oss/zone-input/v1'),
      bucket.toUint8Array(),
      owner.toUint8Array(),
      fixed(zoneId, 32, 'zone id'),
      u32be(keyVersion)
    )
  )
}

export function newTransportSecretKey(): TransportSecretKey {
  return TransportSecretKey.random()
}

/** Verifies a VetKD reply locally before using it as a Zone KEK. */
export function deriveZoneKek(
  transportSecret: TransportSecretKey,
  reply: DerivedZoneKey,
  input: Uint8Array
): Uint8Array {
  const encrypted = EncryptedVetKey.deserialize(asBytes(reply.encrypted_key))
  const publicKey = DerivedPublicKey.deserialize(asBytes(reply.public_key))
  const vetKey = encrypted.decryptAndVerify(transportSecret, publicKey, input)
  return copyAndClear(
    new Uint8Array(vetKey.deriveSymmetricKey(zoneKekDomain, XCHACHA_KEY_SIZE))
  )
}

export function createZoneKeyEnvelope(
  bucket: Principal,
  zoneId: Uint8Array,
  keyVersion: number,
  zoneKek: Uint8Array
): { envelope: ZoneKeyEnvelopeV1; zoneWrappingKey: Uint8Array } {
  const zoneWrappingKey = randomBytes(XCHACHA_KEY_SIZE)
  const provider: KeyProviderRef = { BucketVetkd: { bucket } }
  const aadHash = zoneEnvelopeAad(zoneId, keyVersion, provider)
  const nonce = randomBytes(XCHACHA_NONCE_SIZE)
  const wrapped = seal(zoneKek, nonce, zoneWrappingKey, aadHash)
  try {
    return {
      envelope: {
        version: ENCRYPTION_FORMAT_V1,
        provider,
        key_version: keyVersion,
        protection: { VetkdOnly: null },
        cipher: { XChaCha20Poly1305: null },
        nonce,
        wrapped_zwk: wrapped,
        aad_hash: aadHash
      },
      zoneWrappingKey: new Uint8Array(zoneWrappingKey)
    }
  } finally {
    zoneWrappingKey.fill(0)
  }
}

export function unwrapZoneKey(
  zoneId: Uint8Array,
  envelope: ZoneKeyEnvelopeV1,
  zoneKek: Uint8Array
): Uint8Array {
  const aadHash = zoneEnvelopeAad(
    zoneId,
    envelope.key_version,
    envelope.provider
  )
  if (!bytesEqual(aadHash, asBytes(envelope.aad_hash))) {
    throw new Error('zone envelope AAD binding does not match its descriptor')
  }
  const unwrapped = open(
    zoneKek,
    asBytes(envelope.nonce),
    asBytes(envelope.wrapped_zwk),
    aadHash
  )
  try {
    return fixed(unwrapped, XCHACHA_KEY_SIZE, 'zone wrapping key')
  } finally {
    unwrapped.fill(0)
  }
}

export function ciphertextSize(
  plaintextSize: bigint,
  plaintextChunkSize: number
): bigint {
  if (!Number.isSafeInteger(plaintextChunkSize) || plaintextChunkSize <= 0) {
    throw new Error('plaintext chunk size must be a positive integer')
  }
  return (
    plaintextSize +
    ((plaintextSize + BigInt(plaintextChunkSize) - 1n) /
      BigInt(plaintextChunkSize)) *
      BigInt(XCHACHA_TAG_SIZE)
  )
}

export function prepareFileEncryption(
  zoneId: Uint8Array,
  zoneWrappingKey: Uint8Array,
  plaintextSize: bigint,
  plaintextChunkSize: number
): PreparedFileEncryption {
  const objectId = randomBytes(32)
  const noncePrefix = randomBytes(ENCRYPTION_NONCE_PREFIX_SIZE)
  const fileDek = randomBytes(XCHACHA_KEY_SIZE)
  const aadHash = fileEnvelopeAad(
    zoneId,
    objectId,
    plaintextSize,
    plaintextChunkSize,
    noncePrefix
  )
  const nonce = randomBytes(XCHACHA_NONCE_SIZE)
  const envelope: FileKeyEnvelopeV1 = {
    version: ENCRYPTION_FORMAT_V1,
    cipher: { XChaCha20Poly1305: null },
    nonce,
    wrapped_dek: seal(zoneWrappingKey, nonce, fileDek, aadHash),
    aad_hash: aadHash
  }
  try {
    return {
      info: {
        version: ENCRYPTION_FORMAT_V1,
        zone_id: fixed(zoneId, 32, 'zone id'),
        object_id: objectId,
        cipher: { XChaCha20Poly1305: null },
        plaintext_size: plaintextSize,
        plaintext_chunk_size: plaintextChunkSize,
        nonce_prefix: noncePrefix,
        envelope
      },
      fileDek: new Uint8Array(fileDek)
    }
  } finally {
    fileDek.fill(0)
  }
}

export function unwrapFileKey(
  info: EncryptionInfoV1,
  zoneWrappingKey: Uint8Array
): Uint8Array {
  const aadHash = fileEnvelopeAad(
    asBytes(info.zone_id),
    asBytes(info.object_id),
    info.plaintext_size,
    info.plaintext_chunk_size,
    asBytes(info.nonce_prefix)
  )
  if (!bytesEqual(aadHash, asBytes(info.envelope.aad_hash))) {
    throw new Error('file envelope AAD binding does not match its descriptor')
  }
  const unwrapped = open(
    zoneWrappingKey,
    asBytes(info.envelope.nonce),
    asBytes(info.envelope.wrapped_dek),
    aadHash
  )
  try {
    return fixed(unwrapped, XCHACHA_KEY_SIZE, 'file data key')
  } finally {
    unwrapped.fill(0)
  }
}

export function encryptFileChunk(
  info: EncryptionInfoV1,
  fileDek: Uint8Array,
  index: number,
  plaintext: Uint8Array
): Uint8Array {
  if (plaintext.byteLength > info.plaintext_chunk_size) {
    throw new Error('plaintext chunk exceeds the encryption descriptor size')
  }
  return seal(
    fileDek,
    chunkNonce(asBytes(info.nonce_prefix), index),
    plaintext,
    fileChunkAad(asBytes(info.object_id), index)
  )
}

export function decryptFileChunk(
  info: EncryptionInfoV1,
  fileDek: Uint8Array,
  index: number,
  ciphertext: Uint8Array
): Uint8Array {
  return open(
    fileDek,
    chunkNonce(asBytes(info.nonce_prefix), index),
    ciphertext,
    fileChunkAad(asBytes(info.object_id), index)
  )
}

/**
 * Authenticates a complete encrypted file before releasing any plaintext to
 * the caller. This is the bounded-file counterpart to a staged streaming
 * reader: it deliberately buffers plaintext so a later bad tag cannot leave
 * a caller with a partially trusted result.
 */
export function decryptAuthenticatedFile(
  info: EncryptionInfoV1,
  fileDek: Uint8Array,
  ciphertextChunks: readonly Uint8Array[],
  expectedCiphertextHash?: Uint8Array
): Uint8Array {
  if (
    !Number.isSafeInteger(info.plaintext_chunk_size) ||
    info.plaintext_chunk_size <= 0
  ) {
    throw new Error('invalid encrypted file plaintext chunk size')
  }
  if (info.plaintext_size > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('plaintext file size exceeds JavaScript safe integer range')
  }
  const expectedChunksBigInt =
    (info.plaintext_size + BigInt(info.plaintext_chunk_size) - 1n) /
    BigInt(info.plaintext_chunk_size)
  if (expectedChunksBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(
      'encrypted file chunk count exceeds JavaScript safe integer range'
    )
  }
  const expectedChunks = Number(expectedChunksBigInt)
  if (ciphertextChunks.length !== expectedChunks) {
    throw new Error('encrypted file chunk count does not match its descriptor')
  }
  const hasher = sha3_256.create()
  const plaintextChunks: Uint8Array[] = []
  try {
    let plaintextSize = 0
    for (let index = 0; index < ciphertextChunks.length; index += 1) {
      const ciphertext = ciphertextChunks[index]
      hasher.update(ciphertext)
      const plaintext = decryptFileChunk(info, fileDek, index, ciphertext)
      plaintextChunks.push(plaintext)
      plaintextSize += plaintext.byteLength
    }
    if (BigInt(plaintextSize) !== info.plaintext_size) {
      throw new Error(
        'decrypted file size does not match its encryption descriptor'
      )
    }
    if (
      expectedCiphertextHash &&
      !bytesEqual(hasher.digest(), expectedCiphertextHash)
    ) {
      throw new Error('encrypted file ciphertext hash mismatch')
    }
    const result = new Uint8Array(plaintextSize)
    let offset = 0
    for (const plaintext of plaintextChunks) {
      result.set(plaintext, offset)
      offset += plaintext.byteLength
    }
    return result
  } finally {
    for (const plaintext of plaintextChunks) plaintext.fill(0)
  }
}

function zoneEnvelopeAad(
  zoneId: Uint8Array,
  keyVersion: number,
  provider: KeyProviderRef
): Uint8Array {
  if ('BucketVetkd' in provider) {
    return sha3_256(
      concat(
        encoder.encode('ic-oss/zone-envelope-aad/v1'),
        fixed(zoneId, 32, 'zone id'),
        u32be(keyVersion),
        new Uint8Array([0]),
        provider.BucketVetkd.bucket.toUint8Array()
      )
    )
  }
  return sha3_256(
    concat(
      encoder.encode('ic-oss/zone-envelope-aad/v1'),
      fixed(zoneId, 32, 'zone id'),
      u32be(keyVersion),
      new Uint8Array([1]),
      provider.VaultVetkd.vault.toUint8Array(),
      fixed(asBytes(provider.VaultVetkd.vault_id), 16, 'vault id'),
      fixed(asBytes(provider.VaultVetkd.key_ref), 32, 'vault key reference')
    )
  )
}

function fileEnvelopeAad(
  zoneId: Uint8Array,
  objectId: Uint8Array,
  plaintextSize: bigint,
  plaintextChunkSize: number,
  noncePrefix: Uint8Array
): Uint8Array {
  return sha3_256(
    concat(
      encoder.encode('ic-oss/file-envelope-aad/v1'),
      fixed(zoneId, 32, 'zone id'),
      fixed(objectId, 32, 'object id'),
      u64be(plaintextSize),
      u32be(plaintextChunkSize),
      fixed(noncePrefix, ENCRYPTION_NONCE_PREFIX_SIZE, 'nonce prefix')
    )
  )
}

function fileChunkAad(objectId: Uint8Array, index: number): Uint8Array {
  return sha3_256(
    concat(
      encoder.encode('ic-oss/file-chunk-aad/v1'),
      fixed(objectId, 32, 'object id'),
      u32be(index)
    )
  )
}

function chunkNonce(prefix: Uint8Array, index: number): Uint8Array {
  return concat(
    fixed(prefix, ENCRYPTION_NONCE_PREFIX_SIZE, 'nonce prefix'),
    u64be(BigInt(index))
  )
}

function seal(
  key: Uint8Array,
  nonce: Uint8Array,
  plaintext: Uint8Array,
  aad: Uint8Array
): Uint8Array {
  const keyCopy = fixed(key, 32, 'key')
  try {
    return new Uint8Array(
      xchacha20poly1305(keyCopy, fixed(nonce, 24, 'nonce'), aad).encrypt(
        plaintext
      )
    )
  } finally {
    keyCopy.fill(0)
  }
}

function open(
  key: Uint8Array,
  nonce: Uint8Array,
  ciphertext: Uint8Array,
  aad: Uint8Array
): Uint8Array {
  const keyCopy = fixed(key, 32, 'key')
  try {
    return new Uint8Array(
      xchacha20poly1305(keyCopy, fixed(nonce, 24, 'nonce'), aad).decrypt(
        ciphertext
      )
    )
  } finally {
    keyCopy.fill(0)
  }
}

function asBytes(value: Uint8Array | number[]): Uint8Array {
  return new Uint8Array(value)
}

function fixed(value: Uint8Array, length: number, label: string): Uint8Array {
  assertLength(value, length, label)
  return new Uint8Array(value)
}

function assertLength(value: Uint8Array, length: number, label: string): void {
  if (value.byteLength !== length) {
    throw new Error(`${label} must be ${length} bytes`)
  }
}

function u32be(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0 || value > 0xffffffff) {
    throw new Error('invalid u32 value')
  }
  const result = new Uint8Array(4)
  new DataView(result.buffer).setUint32(0, value)
  return result
}

function u64be(value: bigint): Uint8Array {
  if (value < 0n || value > 0xffff_ffff_ffff_ffffn) {
    throw new Error('invalid u64 value')
  }
  const result = new Uint8Array(8)
  new DataView(result.buffer).setBigUint64(0, value)
  return result
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const length = parts.reduce((total, value) => total + value.byteLength, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const value of parts) {
    result.set(value, offset)
    offset += value.byteLength
  }
  return result
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.byteLength !== right.byteLength) return false
  let different = 0
  for (let index = 0; index < left.byteLength; index += 1) {
    different |= left[index] ^ right[index]
  }
  return different === 0
}

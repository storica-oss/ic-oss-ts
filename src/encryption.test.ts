import { Principal } from '@dfinity/principal'
import { sha3_256 } from '@noble/hashes/sha3.js'
import { describe, expect, test } from 'vitest'
import chunkVectors from '../tests/fixtures/crypto/chunk-v1.json'
import syncCommitmentVector from '../tests/fixtures/crypto/sync-commitment-v1.json'
import {
  decryptAuthenticatedFile,
  createZoneKeyEnvelope,
  decryptFileChunk,
  encryptFileChunk,
  prepareFileEncryption,
  unwrapFileKey,
  unwrapZoneKey,
  encryptedSyncCommitment
} from './encryption.js'

describe('EncryptionZone crypto format', () => {
  test('matches the versioned Rust encrypted sync commitment vector', () => {
    expect(
      Buffer.from(
        encryptedSyncCommitment(
          Uint8Array.from(
            Buffer.from(syncCommitmentVector.zone_wrapping_key, 'hex')
          ),
          Uint8Array.from(
            Buffer.from(syncCommitmentVector.plaintext_hash, 'hex')
          )
        )
      ).toString('hex')
    ).toBe(syncCommitmentVector.commitment)
  })
  test('round-trips Zone and File envelopes and rejects a different chunk index', () => {
    const zoneId = new Uint8Array(32).fill(7)
    const zoneKek = new Uint8Array(32).fill(3)
    const { envelope, zoneWrappingKey } = createZoneKeyEnvelope(
      Principal.anonymous(),
      zoneId,
      1,
      zoneKek
    )
    expect(unwrapZoneKey(zoneId, envelope, zoneKek)).toEqual(zoneWrappingKey)

    const prepared = prepareFileEncryption(zoneId, zoneWrappingKey, 13n, 32)
    const fileDek = unwrapFileKey(prepared.info, zoneWrappingKey)
    const ciphertext = encryptFileChunk(
      prepared.info,
      fileDek,
      0,
      new TextEncoder().encode('secret payload')
    )
    expect(decryptFileChunk(prepared.info, fileDek, 0, ciphertext)).toEqual(
      new TextEncoder().encode('secret payload')
    )
    expect(() =>
      decryptFileChunk(prepared.info, fileDek, 1, ciphertext)
    ).toThrow()
  })

  test('matches the versioned Rust XChaCha20 chunk vector', () => {
    const info = {
      version: 1,
      zone_id: Uint8Array.from({ length: 32 }, (_, index) => index),
      object_id: Uint8Array.from({ length: 32 }, (_, index) => index + 32),
      cipher: { XChaCha20Poly1305: null },
      plaintext_size: 23n,
      plaintext_chunk_size: 32,
      nonce_prefix: Uint8Array.from({ length: 16 }, (_, index) => index + 64),
      envelope: {
        version: 1,
        cipher: { XChaCha20Poly1305: null },
        nonce: new Uint8Array(24),
        wrapped_dek: new Uint8Array(48),
        aad_hash: new Uint8Array(32)
      }
    }
    const ciphertext = encryptFileChunk(
      info,
      Uint8Array.from({ length: 32 }, (_, index) => index),
      0,
      new TextEncoder().encode('ic-oss interoperability')
    )
    expect(Buffer.from(ciphertext).toString('hex')).toBe(
      '37168d32a5b4d73b908f5248e8cb018d8e1b165cf44e2bc45f9b1392243e27a3a2b14f51079dc5'
    )
  })

  test('matches twenty public versioned Rust chunk vectors', () => {
    expect(chunkVectors).toHaveLength(20)
    for (const vector of chunkVectors) {
      const seed = vector.seed
      const plaintextLength = (seed * 17) % 97
      const info = {
        version: 1,
        zone_id: new Uint8Array(32).fill(seed + 1),
        object_id: Uint8Array.from(
          { length: 32 },
          (_, index) => (seed * 11 + index) & 0xff
        ),
        cipher: { XChaCha20Poly1305: null },
        plaintext_size: BigInt(plaintextLength),
        plaintext_chunk_size: 128,
        nonce_prefix: Uint8Array.from(
          { length: 16 },
          (_, index) => (seed * 7 + index) & 0xff
        ),
        envelope: {
          version: 1,
          cipher: { XChaCha20Poly1305: null },
          nonce: new Uint8Array(24),
          wrapped_dek: new Uint8Array(48),
          aad_hash: new Uint8Array(32)
        }
      }
      const key = Uint8Array.from(
        { length: 32 },
        (_, index) => (seed * 13 + index) & 0xff
      )
      const plaintext = Uint8Array.from(
        { length: plaintextLength },
        (_, index) => (seed * 19 + index * 3) & 0xff
      )
      expect(
        Buffer.from(encryptFileChunk(info, key, seed, plaintext)).toString(
          'hex'
        )
      ).toBe(vector.ciphertext)
    }
  })

  test('releases whole-file plaintext only after chunk and hash authentication', () => {
    const zoneId = new Uint8Array(32).fill(7)
    const zoneWrappingKey = new Uint8Array(32).fill(4)
    const plaintext = new TextEncoder().encode('secret payload')
    const prepared = prepareFileEncryption(
      zoneId,
      zoneWrappingKey,
      BigInt(plaintext.byteLength),
      32
    )
    const ciphertext = encryptFileChunk(
      prepared.info,
      prepared.fileDek,
      0,
      plaintext
    )
    const hash = sha3_256(ciphertext)
    expect(
      decryptAuthenticatedFile(
        prepared.info,
        prepared.fileDek,
        [ciphertext],
        hash
      )
    ).toEqual(plaintext)
    expect(() =>
      decryptAuthenticatedFile(
        prepared.info,
        prepared.fileDek,
        [ciphertext],
        new Uint8Array(32).fill(9)
      )
    ).toThrow('ciphertext hash mismatch')

    const tampered = new Uint8Array(ciphertext)
    tampered[0] ^= 1
    expect(() =>
      decryptAuthenticatedFile(
        prepared.info,
        prepared.fileDek,
        [tampered],
        hash
      )
    ).toThrow()
  })

  test('rejects ciphertext, envelope, key, index and descriptor substitution attacks', () => {
    const zoneId = new Uint8Array(32).fill(7)
    const zoneKek = new Uint8Array(32).fill(3)
    const { envelope, zoneWrappingKey } = createZoneKeyEnvelope(
      Principal.anonymous(),
      zoneId,
      1,
      zoneKek
    )
    const badZoneEnvelope = {
      ...envelope,
      wrapped_zwk: new Uint8Array(envelope.wrapped_zwk)
    }
    badZoneEnvelope.wrapped_zwk[0] ^= 1
    expect(() => unwrapZoneKey(zoneId, badZoneEnvelope, zoneKek)).toThrow()
    expect(() =>
      unwrapZoneKey(new Uint8Array(32).fill(8), envelope, zoneKek)
    ).toThrow()
    expect(() =>
      unwrapZoneKey(zoneId, envelope, new Uint8Array(32).fill(4))
    ).toThrow()

    const plaintext = new TextEncoder().encode('secret payload')
    const prepared = prepareFileEncryption(
      zoneId,
      zoneWrappingKey,
      BigInt(plaintext.byteLength),
      32
    )
    const ciphertext = encryptFileChunk(
      prepared.info,
      prepared.fileDek,
      0,
      plaintext
    )
    const tamperedCiphertext = new Uint8Array(ciphertext)
    tamperedCiphertext[0] ^= 1
    expect(() =>
      decryptFileChunk(prepared.info, prepared.fileDek, 0, tamperedCiphertext)
    ).toThrow()
    expect(() =>
      decryptFileChunk(prepared.info, new Uint8Array(32).fill(9), 0, ciphertext)
    ).toThrow()
    expect(() =>
      decryptFileChunk(prepared.info, prepared.fileDek, 1, ciphertext)
    ).toThrow()

    const replacedObject = structuredClone(prepared.info)
    replacedObject.object_id = new Uint8Array(32).fill(9)
    expect(() =>
      decryptFileChunk(replacedObject, prepared.fileDek, 0, ciphertext)
    ).toThrow()
    const replacedZone = structuredClone(prepared.info)
    replacedZone.zone_id = new Uint8Array(32).fill(8)
    expect(() => unwrapFileKey(replacedZone, zoneWrappingKey)).toThrow()
    const replacedSize = structuredClone(prepared.info)
    replacedSize.plaintext_size += 1n
    expect(() => unwrapFileKey(replacedSize, zoneWrappingKey)).toThrow()
    const replacedNonce = structuredClone(prepared.info)
    replacedNonce.nonce_prefix = new Uint8Array(prepared.info.nonce_prefix)
    replacedNonce.nonce_prefix[0] ^= 1
    expect(() => unwrapFileKey(replacedNonce, zoneWrappingKey)).toThrow()
    const badDekEnvelope = structuredClone(prepared.info)
    badDekEnvelope.envelope.wrapped_dek = new Uint8Array(
      prepared.info.envelope.wrapped_dek
    )
    badDekEnvelope.envelope.wrapped_dek[0] ^= 1
    expect(() => unwrapFileKey(badDekEnvelope, zoneWrappingKey)).toThrow()
  })
})

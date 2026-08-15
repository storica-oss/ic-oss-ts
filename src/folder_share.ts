import type { FolderShareCredential } from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import type { Principal } from '@dfinity/principal'
import { sha3_256 } from '@noble/hashes/sha3.js'

const FOLDER_SHARE_FRAGMENT_KEY = 'share'
const FOLDER_SHARE_CREDENTIAL_VERSION = 1
const SHARE_ID_BYTES = 16
const SHARE_SECRET_BYTES = 32
const ENCODED_BYTES = 1 + SHARE_ID_BYTES + SHARE_SECRET_BYTES
const SHARE_CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const SHARE_CODE_INDEX_DOMAIN = new TextEncoder().encode(
  'ic-oss-folder-share-code-index-v1'
)
const SHARE_CODE_SECRET_DOMAIN = new TextEncoder().encode(
  'ic-oss-folder-share-code-secret-v1'
)

function hashParts(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((total, part) => total + part.length, 0)
  const message = new Uint8Array(size)
  let offset = 0
  for (const part of parts) {
    message.set(part, offset)
    offset += part.length
  }
  return Uint8Array.from(sha3_256(message))
}

export function normalizeFolderShareCode(value: string): string {
  const code = value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/gu, '')
  if (!/^[A-Z0-9]{6,32}$/u.test(code)) {
    throw new Error('share code must contain 6 to 32 letters or digits')
  }
  return code
}

export function randomFolderShareCode(
  randomValues: (value: Uint8Array) => Uint8Array = (value) =>
    globalThis.crypto.getRandomValues(value)
): string {
  const bytes = randomValues(new Uint8Array(6))
  return Array.from(bytes, (byte) => SHARE_CODE_ALPHABET[byte & 31]).join('')
}

export function hashFolderShareCode(
  canisterId: Principal,
  value: string
): Uint8Array {
  const code = new TextEncoder().encode(normalizeFolderShareCode(value))
  return hashParts([SHARE_CODE_INDEX_DOMAIN, canisterId.toUint8Array(), code])
}

export function folderShareSecretFromCode(
  canisterId: Principal,
  shareId: Uint8Array,
  value: string
): Uint8Array {
  if (shareId.length !== SHARE_ID_BYTES) {
    throw new Error(`share_id must be ${SHARE_ID_BYTES} bytes`)
  }
  const code = new TextEncoder().encode(normalizeFolderShareCode(value))
  return hashParts([
    SHARE_CODE_SECRET_DOMAIN,
    canisterId.toUint8Array(),
    shareId,
    code
  ])
}

export function encodeFolderShareCredential(
  credential: FolderShareCredential
): string {
  const shareId = Uint8Array.from(credential.share_id)
  const secret = Uint8Array.from(credential.secret)
  if (shareId.length !== SHARE_ID_BYTES) {
    throw new Error(`share_id must be ${SHARE_ID_BYTES} bytes`)
  }
  if (secret.length !== SHARE_SECRET_BYTES) {
    throw new Error(`share secret must be ${SHARE_SECRET_BYTES} bytes`)
  }
  const bytes = new Uint8Array(ENCODED_BYTES)
  bytes[0] = FOLDER_SHARE_CREDENTIAL_VERSION
  bytes.set(shareId, 1)
  bytes.set(secret, 1 + SHARE_ID_BYTES)
  return toBase64Url(bytes)
}

export function decodeFolderShareCredential(
  encoded: string
): FolderShareCredential {
  const bytes = fromBase64Url(encoded)
  if (
    bytes.length !== ENCODED_BYTES ||
    bytes[0] !== FOLDER_SHARE_CREDENTIAL_VERSION
  ) {
    throw new Error('unsupported or malformed folder share credential')
  }
  return {
    share_id: bytes.slice(1, 1 + SHARE_ID_BYTES),
    secret: bytes.slice(1 + SHARE_ID_BYTES)
  }
}

/**
 * Places bearer credentials in the URL fragment. Fragments are not sent in
 * HTTP requests or Referer headers; callers should still redact copied URLs.
 */
export function createFolderShareUrl(
  baseUrl: string | URL,
  credential: FolderShareCredential
): URL {
  const url = new URL(baseUrl)
  url.hash = new URLSearchParams({
    [FOLDER_SHARE_FRAGMENT_KEY]: encodeFolderShareCredential(credential)
  }).toString()
  return url
}

export function folderShareCredentialFromUrl(
  value: string | URL
): FolderShareCredential | undefined {
  const url = new URL(value)
  const encoded = new URLSearchParams(url.hash.slice(1)).get(
    FOLDER_SHARE_FRAGMENT_KEY
  )
  return encoded ? decodeFolderShareCredential(encoded) : undefined
}

export function redactFolderShareCredentialFromUrl(value: string | URL): URL {
  const url = new URL(value)
  const fragment = new URLSearchParams(url.hash.slice(1))
  fragment.delete(FOLDER_SHARE_FRAGMENT_KEY)
  const remaining = fragment.toString()
  url.hash = remaining ? remaining : ''
  return url
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return globalThis
    .btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error('folder share credential is not valid base64url')
  }
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  let binary: string
  try {
    binary = globalThis.atob(padded)
  } catch {
    throw new Error('folder share credential is not valid base64url')
  }
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

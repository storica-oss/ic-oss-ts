import { describe, expect, it } from 'vitest'
import {
  createFolderShareUrl,
  decodeFolderShareCredential,
  encodeFolderShareCredential,
  folderShareSecretFromCode,
  folderShareCredentialFromUrl,
  hashFolderShareCode,
  normalizeFolderShareCode,
  randomFolderShareCode,
  redactFolderShareCredentialFromUrl
} from './folder_share.js'
import { Principal } from '@dfinity/principal'

describe('folder share URL credentials', () => {
  const credential = {
    share_id: new Uint8Array(16).fill(4),
    secret: new Uint8Array(32).fill(9)
  }

  it('round-trips the fixed-size versioned credential', () => {
    const encoded = encodeFolderShareCredential(credential)
    expect(encoded).not.toContain('=')
    expect(decodeFolderShareCredential(encoded)).toEqual(credential)
  })

  it('keeps bearer bytes in the URL fragment', () => {
    const url = createFolderShareUrl(
      'https://example.com/admin/?canisterId=aaaaa-aa',
      credential
    )
    expect(url.search).toBe('?canisterId=aaaaa-aa')
    expect(url.hash).toMatch(/^#share=/)
    expect(url.search).not.toContain(encodeFolderShareCredential(credential))
    expect(folderShareCredentialFromUrl(url)).toEqual(credential)
    const redacted = redactFolderShareCredentialFromUrl(url)
    expect(redacted.hash).toBe('')
    expect(redacted.search).toBe('?canisterId=aaaaa-aa')
  })

  it('rejects malformed and unknown-version credentials', () => {
    expect(() => decodeFolderShareCredential('not+base64')).toThrow(/base64url/)
    const unknownVersion = new Uint8Array(49)
    unknownVersion[0] = 2
    const encoded = btoa(String.fromCharCode(...unknownVersion))
      .replaceAll('+', '-')
      .replaceAll('/', '_')
      .replace(/=+$/, '')
    expect(() => decodeFolderShareCredential(encoded)).toThrow(/unsupported/)
  })

  it('normalizes, generates, and domain-separates short share codes', () => {
    const canister = Principal.selfAuthenticating(Uint8Array.of(8, 9))
    const shareId = new Uint8Array(16).fill(7)
    expect(normalizeFolderShareCode(' ab-12 cd ')).toBe('AB12CD')
    expect(() => normalizeFolderShareCode('12345')).toThrow('6 to 32')
    expect(randomFolderShareCode((bytes) => bytes.fill(0))).toBe('222222')
    expect(hashFolderShareCode(canister, 'AB12CD')).not.toEqual(
      folderShareSecretFromCode(canister, shareId, 'AB12CD')
    )
    expect(folderShareSecretFromCode(canister, shareId, 'AB12CD')).not.toEqual(
      folderShareSecretFromCode(canister, shareId, 'AB12CE')
    )
  })
})

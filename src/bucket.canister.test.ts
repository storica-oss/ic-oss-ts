import { Principal } from '@dfinity/principal'
import { sha3_256 } from '@noble/hashes/sha3.js'
import { describe, expect, test, vi } from 'vitest'
import type { _SERVICE as BucketService } from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import {
  BucketCanister,
  createFolderShareCodeMaterial,
  createFolderShareCodeSecret,
  createFolderShareMaterial,
  createFolderShareSecret,
  EncryptionZoneKeyCache,
  hashFolderShareSecret
} from './bucket.canister'
import { encryptFileChunk, prepareFileEncryption } from './encryption'

const token = new Uint8Array([1, 2, 3])

function bucketWith(service: Partial<BucketService>, accessToken = token) {
  return BucketCanister.create({
    canisterId: Principal.anonymous(),
    serviceOverride: service as never,
    certifiedServiceOverride: service as never,
    accessToken
  })
}

describe('BucketCanister v2 service wiring', () => {
  test('matches the Rust folder share hash vector', () => {
    const shareId = Uint8Array.from({ length: 16 }, (_, index) => index)
    const secret = Uint8Array.from({ length: 32 }, (_, index) => index + 16)
    expect(
      Buffer.from(
        hashFolderShareSecret(Principal.anonymous(), shareId, secret)
      ).toString('hex')
    ).toBe('59fbc55f6e1fb2ae16f43fbbe71bee406316a4667c57a639b6410f317797f908')
  })

  test('creates domain-separated share credentials and rotates only the secret', () => {
    const canister = Principal.selfAuthenticating(new Uint8Array([7, 8, 9]))
    let next = 1
    const deterministicRandom = (value: Uint8Array) => {
      value.fill(next++)
      return value
    }
    const material = createFolderShareMaterial(canister, deterministicRandom)
    expect(material.shareId).toEqual(new Uint8Array(16).fill(1))
    expect(material.secret).toEqual(new Uint8Array(32).fill(2))
    expect(material.secretHash).toEqual(
      hashFolderShareSecret(canister, material.shareId, material.secret)
    )

    const rotated = createFolderShareSecret(
      canister,
      material.shareId,
      deterministicRandom
    )
    expect(rotated.credential.share_id).toBe(material.shareId)
    expect(rotated.secret).toEqual(new Uint8Array(32).fill(3))
    expect(rotated.secretHash).not.toEqual(material.secretHash)
  })

  test('derives portable credentials from an editable short code', () => {
    const canister = Principal.selfAuthenticating(new Uint8Array([7, 8, 9]))
    const material = createFolderShareCodeMaterial(
      canister,
      'AB12CD',
      (bytes) => bytes.fill(3)
    )
    expect(material.shareId).toEqual(new Uint8Array(16).fill(3))
    expect(material.code).toBe('AB12CD')
    expect(material.codeHash).toHaveLength(32)
    expect(material.secretHash).toEqual(
      hashFolderShareSecret(canister, material.shareId, material.secret)
    )
    const restored = createFolderShareCodeSecret(
      canister,
      material.shareId,
      'ab-12-cd'
    )
    expect(restored.secret).toEqual(material.secret)
    expect(restored.codeHash).toEqual(material.codeHash)
  })

  test('looks up a short share code through the public query', async () => {
    const output = { share_id: new Uint8Array(16).fill(8) }
    const service = {
      lookup_folder_share_code: vi.fn().mockResolvedValue({ Ok: output })
    }
    const bucket = bucketWith(service)
    const input = { code_hash: new Uint8Array(32).fill(4) }
    await expect(bucket.lookupFolderShareCode(input)).resolves.toEqual(output)
    expect(service.lookup_folder_share_code).toHaveBeenCalledWith(input)
  })

  test('bounds the opt-in Zone key cache and returns defensive key copies', () => {
    const bucket = Principal.anonymous()
    const cache = new EncryptionZoneKeyCache({ ttlMs: 60_000, maxEntries: 1 })
    const zone = {
      zone_id: new Uint8Array(32).fill(1),
      revision: 1n
    } as never
    const key = new Uint8Array(32).fill(7)
    cache.set(bucket, { zone, zoneWrappingKey: key })
    const first = cache.get(bucket, zone)!
    first.zoneWrappingKey.fill(9)
    expect(cache.get(bucket, zone)?.zoneWrappingKey).toEqual(
      new Uint8Array(32).fill(7)
    )
    cache.clear()
    expect(cache.get(bucket, zone)).toBeUndefined()
  })

  test('streams authenticated encrypted chunks and verifies the final ciphertext hash', async () => {
    const zoneWrappingKey = new Uint8Array(32).fill(4)
    const plaintext = new TextEncoder().encode('streamed encrypted payload')
    const prepared = prepareFileEncryption(
      new Uint8Array(32).fill(2),
      zoneWrappingKey,
      BigInt(plaintext.byteLength),
      12
    )
    const chunks = [
      plaintext.slice(0, 12),
      plaintext.slice(12, 24),
      plaintext.slice(24)
    ].map((chunk, index) =>
      encryptFileChunk(prepared.info, prepared.fileDek, index, chunk)
    )
    const ciphertext = new Uint8Array(
      chunks.reduce((total, chunk) => total + chunk.byteLength, 0)
    )
    let offset = 0
    for (const chunk of chunks) {
      ciphertext.set(chunk, offset)
      offset += chunk.byteLength
    }
    const file = {
      id: 9,
      generation: 3n,
      size: BigInt(ciphertext.byteLength),
      filled: BigInt(ciphertext.byteLength),
      chunks: chunks.length,
      hash: [sha3_256(ciphertext)],
      encryption: [prepared.info]
    }
    const service = {
      get_file_info: vi.fn().mockResolvedValue({ Ok: file }),
      read_file_chunk: vi
        .fn()
        .mockImplementation(async ({ index }: { index: number }) => ({
          Ok: chunks[index]
        }))
    }
    const bucket = bucketWith(service)
    vi.spyOn(bucket, 'openEncryptionZone').mockResolvedValue({
      zone: {} as never,
      zoneWrappingKey: new Uint8Array(zoneWrappingKey)
    })

    const opened = await bucket.readEncryptedFileStream(9)
    const reader = opened.stream.getReader()
    const output: number[] = []
    while (true) {
      const next = await reader.read()
      if (next.done) break
      output.push(...next.value)
    }
    await expect(opened.closed).resolves.toBeUndefined()
    expect(new Uint8Array(output)).toEqual(plaintext)
  })

  test('checks controller access without decoding full canister status', async () => {
    const service = {
      is_caller_controller: vi.fn().mockResolvedValue(true)
    }
    const bucket = bucketWith(service)

    await expect(bucket.isCallerController()).resolves.toBe(true)
    expect(service.is_caller_controller).toHaveBeenCalledWith()
  })

  test('wires OAuth login and manager review without bearer-token arguments', async () => {
    const account = {
      key: 'google:abc',
      provider: { Google: null },
      email: 'admin@example.com',
      display_name: 'Admin',
      avatar_url: '',
      status: { Pending: null },
      requested_at: 1n,
      last_login_at: 1n,
      reviewed_at: [],
      reviewed_by: []
    }
    const publicConfig = {
      google: [{ client_id: 'google-client' }],
      wechat: [],
      redirect_uris: ['https://example.com/admin/']
    }
    const beginInput = {
      provider: { Google: null },
      redirect_uri: 'https://example.com/admin/'
    }
    const completeInput = { code: 'code', state: 'state' }
    const reviewInput = {
      key: account.key,
      status: { Approved: null }
    }
    const service = {
      get_oauth_config: vi.fn().mockResolvedValue(publicConfig),
      oauth_begin: vi.fn().mockResolvedValue({
        Ok: { authorization_url: 'https://accounts.google.com/' }
      }),
      oauth_complete: vi.fn().mockResolvedValue({ Ok: { Pending: account } }),
      admin_list_oauth_accounts: vi.fn().mockResolvedValue([account]),
      admin_review_oauth_account: vi.fn().mockResolvedValue({ Ok: account })
    }
    const bucket = bucketWith(service)

    await expect(bucket.getOAuthConfig()).resolves.toBe(publicConfig)
    await expect(bucket.oauthBegin(beginInput)).resolves.toEqual({
      authorization_url: 'https://accounts.google.com/'
    })
    await expect(bucket.oauthComplete(completeInput)).resolves.toEqual({
      Pending: account
    })
    await expect(bucket.adminListOAuthAccounts()).resolves.toEqual([account])
    await expect(bucket.adminReviewOAuthAccount(reviewInput)).resolves.toBe(
      account
    )

    expect(service.oauth_begin).toHaveBeenCalledWith(beginInput)
    expect(service.oauth_complete).toHaveBeenCalledWith(completeInput)
    expect(service.admin_list_oauth_accounts).toHaveBeenCalledWith()
    expect(service.admin_review_oauth_account).toHaveBeenCalledWith(reviewInput)
  })

  test('manages Reader Grants without mixing in bearer tokens', async () => {
    const authority = Principal.selfAuthenticating(new Uint8Array([1]))
    const subject = Principal.selfAuthenticating(new Uint8Array([2]))
    const grant = {
      subject,
      expires_at_ms: [],
      entitlement_version: 1n,
      status: { Active: null },
      granted_by: authority,
      updated_at_ms: 1n
    }
    const upsertInput = {
      subject,
      expires_at_ms: [],
      entitlement_version: 1n,
      request_id: new Uint8Array([1])
    }
    const revokeInput = {
      subject,
      entitlement_version: 2n,
      request_id: new Uint8Array([2])
    }
    const service = {
      admin_set_reader_authority: vi.fn().mockResolvedValue({ Ok: null }),
      admin_upsert_reader_grant: vi.fn().mockResolvedValue({ Ok: grant }),
      admin_revoke_reader_grant: vi.fn().mockResolvedValue({ Ok: grant }),
      get_my_reader_grant: vi.fn().mockResolvedValue({ Ok: [grant] })
    }
    const bucket = bucketWith(service)

    await expect(bucket.adminSetReaderAuthority(authority)).resolves.toBe(
      undefined
    )
    await expect(bucket.adminUpsertReaderGrant(upsertInput)).resolves.toBe(
      grant
    )
    await expect(bucket.adminRevokeReaderGrant(revokeInput)).resolves.toBe(
      grant
    )
    await expect(bucket.getMyReaderGrant()).resolves.toBe(grant)
    await bucket.adminSetReaderAuthority()

    expect(service.admin_set_reader_authority).toHaveBeenNthCalledWith(1, [
      authority
    ])
    expect(service.admin_set_reader_authority).toHaveBeenNthCalledWith(2, [])
    expect(service.admin_upsert_reader_grant).toHaveBeenCalledWith(upsertInput)
    expect(service.admin_revoke_reader_grant).toHaveBeenCalledWith(revokeInput)
    expect(service.get_my_reader_grant).toHaveBeenCalledWith()
  })

  test('calls capability and controller migration methods without an access token', async () => {
    const capabilities = { api_version: 2 }
    const migrated = { state: { Ready: null } }
    const retried = { state: { Migrating: null } }
    const service = {
      get_capabilities: vi.fn().mockResolvedValue(capabilities),
      admin_migrate_directory_storage: vi.fn().mockResolvedValue(migrated),
      admin_retry_directory_migration: vi.fn().mockResolvedValue(retried)
    }
    const bucket = bucketWith(service)
    const migrationInput = { max_items: [1000] }

    await expect(bucket.getCapabilities()).resolves.toBe(capabilities)
    await expect(
      bucket.adminMigrateDirectoryStorage(migrationInput as never)
    ).resolves.toBe(migrated)
    await expect(bucket.adminRetryDirectoryMigration()).resolves.toBe(retried)
    expect(service.get_capabilities).toHaveBeenCalledWith()
    expect(service.admin_migrate_directory_storage).toHaveBeenCalledWith(
      migrationInput
    )
    expect(service.admin_retry_directory_migration).toHaveBeenCalledWith()
  })

  test('transfers cycles through the controller-only service method', async () => {
    const destination = Principal.selfAuthenticating(new Uint8Array([8]))
    const input = {
      to_canister: destination,
      amount: 2_000_000_000_000n
    }
    const output = {
      transferred: input.amount,
      remaining_balance: 3_000_000_000_000n
    }
    const service = {
      admin_transfer_cycles: vi.fn().mockResolvedValue({ Ok: output })
    }
    const bucket = bucketWith(service)

    await expect(bucket.adminTransferCycles(input)).resolves.toBe(output)
    expect(service.admin_transfer_cycles).toHaveBeenCalledWith(input)
  })

  test('toggles the isolated public website without an access token', async () => {
    const config = {
      enabled: true,
      folder_id: [7] as [number],
      root_name: 'sites'
    }
    const service = {
      admin_set_website_enabled: vi.fn().mockResolvedValue({ Ok: config })
    }
    const bucket = bucketWith(service)

    await expect(bucket.adminSetWebsiteEnabled(true)).resolves.toBe(config)
    expect(service.admin_set_website_enabled).toHaveBeenCalledWith(true)
  })

  test('configures a custom public website root without an access token', async () => {
    const input = { enabled: true, root_name: ['public-web'] as [string] }
    const config = {
      enabled: true,
      folder_id: [9] as [number],
      root_name: 'public-web'
    }
    const service = {
      admin_set_website_config: vi.fn().mockResolvedValue({ Ok: config })
    }
    const bucket = bucketWith(service)

    await expect(bucket.adminSetWebsiteConfig(input)).resolves.toBe(config)
    expect(service.admin_set_website_config).toHaveBeenCalledWith(input)
  })

  test('passes the current access token to entry, manifest, and batch methods', async () => {
    const ensured = { id: 7 }
    const batchFolders = { results: [] }
    const batchFiles = { results: [] }
    const entry = { id: 9, name: 'asset.txt' }
    const entries = { entries: [], next: [] }
    const manifest = { entries: [], next: [], revision: 4n }
    const storageMetrics = {
      stable_memory_size: 1024n,
      stable_memory_limit: 500n * 1024n ** 3n,
      cycles: [12_000_000_000n],
      reserved_cycles: [500_000_000n]
    }
    const favorites = { favorites: [], next: [] }
    const service = {
      ensure_folder: vi.fn().mockResolvedValue({ Ok: ensured }),
      batch_ensure_folders: vi.fn().mockResolvedValue({ Ok: batchFolders }),
      batch_create_small_files: vi.fn().mockResolvedValue({ Ok: batchFiles }),
      delete_entry_if: vi.fn().mockResolvedValue({ Ok: true }),
      get_entry: vi.fn().mockResolvedValue({ Ok: [entry] }),
      list_entries: vi.fn().mockResolvedValue({ Ok: entries }),
      get_subtree_manifest: vi.fn().mockResolvedValue({ Ok: manifest }),
      get_storage_metrics: vi.fn().mockResolvedValue({ Ok: storageMetrics }),
      resolve_encryption_zones: vi
        .fn()
        .mockResolvedValue({ Ok: [{ folder_id: 7, zone: [] }] }),
      get_file_favorite_ids: vi
        .fn()
        .mockResolvedValue({ Ok: Uint32Array.from([9]) }),
      list_file_favorites: vi.fn().mockResolvedValue({ Ok: favorites }),
      set_file_favorite: vi.fn().mockResolvedValue({ Ok: true })
    }
    const bucket = bucketWith(service)
    const ensureInput = { request_id: new Uint8Array([1]) }
    const batchFolderInput = { request_id: new Uint8Array([2]), folders: [] }
    const batchFileInput = { request_id: new Uint8Array([3]), files: [] }
    const deleteInput = { request_id: new Uint8Array([4]) }
    const entryInput = { parent: 0, name: 'asset.txt' }
    const listInput = { parent: 0, cursor: [], take: [100] }
    const manifestInput = { root: 0, cursor: [], take: [100] }
    const favoriteListInput = { cursor: [], take: [1000] }
    const favoriteInput = { file_id: 9, favorite: true }

    await expect(bucket.ensureFolder(ensureInput as never)).resolves.toBe(
      ensured
    )
    await expect(
      bucket.batchEnsureFolders(batchFolderInput as never)
    ).resolves.toBe(batchFolders)
    await expect(
      bucket.batchCreateSmallFiles(batchFileInput as never)
    ).resolves.toBe(batchFiles)
    await expect(bucket.deleteEntryIf(deleteInput as never)).resolves.toBe(true)
    await expect(bucket.getEntry(entryInput)).resolves.toBe(entry)
    await expect(bucket.listEntries(listInput as never)).resolves.toBe(entries)
    await expect(
      bucket.getSubtreeManifest(manifestInput as never)
    ).resolves.toBe(manifest)
    await expect(bucket.getStorageMetrics()).resolves.toBe(storageMetrics)
    await expect(bucket.resolveEncryptionZones([7])).resolves.toEqual([
      { folder_id: 7, zone: [] }
    ])
    await expect(bucket.getFileFavoriteIds()).resolves.toEqual([9])
    await expect(
      bucket.listFileFavorites(favoriteListInput as never)
    ).resolves.toBe(favorites)
    await expect(bucket.setFileFavorite(favoriteInput)).resolves.toBe(true)

    expect(service.ensure_folder).toHaveBeenCalledWith(ensureInput, [token])
    expect(service.get_file_favorite_ids).toHaveBeenCalledWith()
    expect(service.resolve_encryption_zones).toHaveBeenCalledWith(
      Uint32Array.from([7]),
      [token]
    )
    expect(service.list_file_favorites).toHaveBeenCalledWith(
      favoriteListInput,
      [token]
    )
    expect(service.set_file_favorite).toHaveBeenCalledWith(favoriteInput, [
      token
    ])
    expect(service.batch_ensure_folders).toHaveBeenCalledWith(
      batchFolderInput,
      [token]
    )
    expect(service.batch_create_small_files).toHaveBeenCalledWith(
      batchFileInput,
      [token]
    )
    expect(service.delete_entry_if).toHaveBeenCalledWith(deleteInput, [token])
    expect(service.get_entry).toHaveBeenCalledWith(entryInput, [token])
    expect(service.list_entries).toHaveBeenCalledWith(listInput, [token])
    expect(service.get_subtree_manifest).toHaveBeenCalledWith(manifestInput, [
      token
    ])
    expect(service.get_storage_metrics).toHaveBeenCalledWith([token])
  })

  test('unwraps upload, health, and garbage collection results', async () => {
    const begun = { session_id: new Uint8Array([8]) }
    const uploaded = { accepted: true }
    const status = { uploaded_chunks: [] }
    const uploadHealth = { active_sessions: 1n, max_active_sessions: 64 }
    const renewed = { expires_at: 99n }
    const committed = { id: 5 }
    const gcHealth = { pending_items: 1n, pending_chunks: 2n }
    const collected = { remaining_items: 0n, remaining_chunks: 0n }
    const directoryHealth = { duplicate_names: 0n, dangling_entries: 0n }
    const service = {
      begin_upload: vi.fn().mockResolvedValue({ Ok: begun }),
      upload_chunk: vi.fn().mockResolvedValue({ Ok: uploaded }),
      get_upload_status: vi.fn().mockResolvedValue({ Ok: status }),
      get_upload_health: vi.fn().mockResolvedValue({ Ok: uploadHealth }),
      renew_upload: vi.fn().mockResolvedValue({ Ok: renewed }),
      commit_upload: vi.fn().mockResolvedValue({ Ok: committed }),
      abort_upload: vi.fn().mockResolvedValue({ Ok: true }),
      get_gc_health: vi.fn().mockResolvedValue({ Ok: gcHealth }),
      collect_garbage: vi.fn().mockResolvedValue({ Ok: collected }),
      get_directory_storage_health: vi
        .fn()
        .mockResolvedValue({ Ok: directoryHealth })
    }
    const bucket = bucketWith(service)
    const input = { request_id: new Uint8Array([9]) }

    await expect(bucket.beginUpload(input as never)).resolves.toBe(begun)
    await expect(bucket.uploadChunk(input as never)).resolves.toBe(uploaded)
    await expect(bucket.getUploadStatus(input as never)).resolves.toBe(status)
    await expect(bucket.getUploadHealth()).resolves.toBe(uploadHealth)
    await expect(bucket.renewUpload(input as never)).resolves.toBe(renewed)
    await expect(bucket.commitUpload(input as never)).resolves.toBe(committed)
    await expect(bucket.abortUpload(input as never)).resolves.toBe(true)
    await expect(bucket.getGcHealth()).resolves.toBe(gcHealth)
    await expect(bucket.collectGarbage(input as never)).resolves.toBe(collected)
    await expect(bucket.getDirectoryStorageHealth()).resolves.toBe(
      directoryHealth
    )

    for (const method of [
      service.begin_upload,
      service.upload_chunk,
      service.get_upload_status,
      service.renew_upload,
      service.commit_upload,
      service.abort_upload,
      service.collect_garbage
    ]) {
      expect(method).toHaveBeenCalledWith(input, [token])
    }
    expect(service.get_upload_health).toHaveBeenCalledWith([token])
    expect(service.get_gc_health).toHaveBeenCalledWith([token])
    expect(service.get_directory_storage_health).toHaveBeenCalledWith([token])
  })

  test('wires unified share messages without ordinary bearer tokens', async () => {
    const shareId = new Uint8Array(16).fill(3)
    const channel = { enabled: true, revision: 2n }
    const message = { body: ['hello'], created_at_ms: 1n }
    const page = { messages: [message], next: [] }
    const setInput = {
      request_id: new Uint8Array([1]),
      share_id: shareId,
      enabled: true,
      expected_channel_revision: [1n]
    }
    const submitInput = {
      request_id: new Uint8Array([2]),
      origin: {
        DirectShare: {
          credential: {
            share_id: shareId,
            secret: new Uint8Array(32).fill(4)
          }
        }
      },
      body: 'hello',
      safety_attestation: []
    }
    const listInput = {
      cursor: [],
      take: [100],
      origin: [],
      include_deleted: []
    }
    const mutationInput = {
      request_id: new Uint8Array([3]),
      key: {
        DirectShare: {
          share_id: shareId,
          sender: Principal.anonymous()
        }
      }
    }
    const service = {
      get_folder_share_message_channel: vi
        .fn()
        .mockResolvedValue({ Ok: channel }),
      set_folder_share_messages: vi.fn().mockResolvedValue({ Ok: channel }),
      submit_share_message: vi.fn().mockResolvedValue({ Ok: message }),
      list_my_share_messages: vi.fn().mockResolvedValue(page),
      retract_sent_share_message: vi.fn().mockResolvedValue({ Ok: message }),
      delete_my_share_message: vi.fn().mockResolvedValue({ Ok: message })
    }
    const bucket = bucketWith(service)

    await expect(bucket.getFolderShareMessageChannel(shareId)).resolves.toBe(
      channel
    )
    await expect(
      bucket.setFolderShareMessages(setInput as never)
    ).resolves.toBe(channel)
    await expect(bucket.submitShareMessage(submitInput as never)).resolves.toBe(
      message
    )
    await expect(bucket.listMyShareMessages(listInput as never)).resolves.toBe(
      page
    )
    await expect(
      bucket.retractSentShareMessage(mutationInput as never)
    ).resolves.toBe(message)
    await expect(
      bucket.deleteMyShareMessage(mutationInput as never)
    ).resolves.toBe(message)

    expect(service.get_folder_share_message_channel).toHaveBeenCalledWith(
      shareId
    )
    expect(service.set_folder_share_messages).toHaveBeenCalledWith(setInput)
    expect(service.submit_share_message).toHaveBeenCalledWith(submitInput)
    expect(service.list_my_share_messages).toHaveBeenCalledWith(listInput)
    expect(service.retract_sent_share_message).toHaveBeenCalledWith(
      mutationInput
    )
    expect(service.delete_my_share_message).toHaveBeenCalledWith(mutationInput)
  })

  test('updates or clears the token and surfaces Result errors', async () => {
    const service = {
      get_gc_health: vi
        .fn()
        .mockResolvedValueOnce({ Ok: { pending_items: 0n } })
        .mockResolvedValueOnce({ Ok: { pending_items: 0n } })
        .mockResolvedValueOnce({ Err: 'permission denied' })
    }
    const bucket = bucketWith(service)
    const replacement = new Uint8Array([7, 7])

    expect(bucket.setAccessToken(replacement)).toBe(bucket)
    replacement.fill(0)
    await bucket.getGcHealth()
    expect(service.get_gc_health).toHaveBeenNthCalledWith(1, [
      new Uint8Array([7, 7])
    ])

    expect(bucket.clearAccessToken()).toBe(bucket)
    await bucket.getGcHealth()
    expect(service.get_gc_health).toHaveBeenNthCalledWith(2, [])
    await expect(bucket.getGcHealth()).rejects.toBe('permission denied')
  })
})

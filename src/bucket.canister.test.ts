import { Principal } from '@dfinity/principal'
import { describe, expect, test, vi } from 'vitest'
import type { _SERVICE as BucketService } from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import { BucketCanister } from './bucket.canister'

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
    const service = {
      ensure_folder: vi.fn().mockResolvedValue({ Ok: ensured }),
      batch_ensure_folders: vi.fn().mockResolvedValue({ Ok: batchFolders }),
      batch_create_small_files: vi.fn().mockResolvedValue({ Ok: batchFiles }),
      delete_entry_if: vi.fn().mockResolvedValue({ Ok: true }),
      get_entry: vi.fn().mockResolvedValue({ Ok: [entry] }),
      list_entries: vi.fn().mockResolvedValue({ Ok: entries }),
      get_subtree_manifest: vi.fn().mockResolvedValue({ Ok: manifest }),
      get_storage_metrics: vi.fn().mockResolvedValue({ Ok: storageMetrics })
    }
    const bucket = bucketWith(service)
    const ensureInput = { request_id: new Uint8Array([1]) }
    const batchFolderInput = { request_id: new Uint8Array([2]), folders: [] }
    const batchFileInput = { request_id: new Uint8Array([3]), files: [] }
    const deleteInput = { request_id: new Uint8Array([4]) }
    const entryInput = { parent: 0, name: 'asset.txt' }
    const listInput = { parent: 0, cursor: [], take: [100] }
    const manifestInput = { root: 0, cursor: [], take: [100] }

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

    expect(service.ensure_folder).toHaveBeenCalledWith(ensureInput, [token])
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
    await bucket.getGcHealth()
    expect(service.get_gc_health).toHaveBeenNthCalledWith(1, [replacement])

    bucket.setAccessToken()
    await bucket.getGcHealth()
    expect(service.get_gc_health).toHaveBeenNthCalledWith(2, [])
    await expect(bucket.getGcHealth()).rejects.toBe('permission denied')
  })
})

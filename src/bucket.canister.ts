import { Canister, createServices } from '@dfinity/utils'
import type { Principal } from '@dfinity/principal'
import { sha3_256 } from '@noble/hashes/sha3.js'
import type {
  AbortUploadInput,
  ArchiveEncryptionZoneInput,
  BatchCreateSmallFilesInput,
  BatchCreateSmallFilesOutput,
  BatchEnsureFoldersInput,
  BatchEnsureFoldersOutput,
  BeginUploadInput,
  BeginUploadOutput,
  BucketInfo,
  BucketCapabilities,
  BucketStorageMetrics,
  _SERVICE as BucketService,
  CanisterStatusResult,
  CollectFolderShareGarbageOutput,
  ContentSafetyVerifierConfig,
  CollectGarbageInput,
  CollectGarbageOutput,
  CommitUploadOutput,
  CreateEncryptionZoneInput,
  CreateFileInput,
  CreateFileOutput,
  CreateFolderInput,
  CreateFolderShareInput,
  DeleteEntryIfInput,
  DirectoryStorageHealth,
  DomainConfig,
  DeriveZoneKeyInput,
  DerivedZoneKey,
  EncryptionProfile,
  EncryptionZone,
  InitializeEncryptionZoneKeyInput,
  IssueMarketListingTicketInput,
  MarketListingTicketView,
  EnsureFolderInput,
  EnsureFolderOutput,
  EntryInfoV2,
  FileDescriptor,
  FileInfo,
  FolderInfo,
  FolderName,
  FolderShare,
  FolderShareCredential,
  GcHealth,
  GetEntryInput,
  GetUploadStatusInput,
  ListEntriesInput,
  ListEntriesOutput,
  ListFileFavoritesInput,
  ListFileFavoritesOutput,
  ListFolderSharesInput,
  ListFolderSharesOutput,
  LookupFolderShareCodeInput,
  LookupFolderShareCodeOutput,
  ListShareMessagesInput,
  ListShareMessagesOutput,
  MigrateDirectoryStorageInput,
  MigrateDirectoryStorageOutput,
  MoveInput,
  OAuthAccount,
  OAuthBeginInput,
  OAuthBeginOutput,
  OAuthCompleteInput,
  OAuthCompleteOutput,
  OAuthConfigInput,
  OAuthPublicConfig,
  OAuthReviewInput,
  OssShareMessage,
  ReadFileChunkInput,
  ReadFileRangeInput,
  ReaderGrant,
  RenewUploadOutput,
  ResolvedEncryptionZone,
  ResolveFolderShareOutput,
  ReportShareMessageInput,
  RevokeFolderShareInput,
  RevokeReaderGrantInput,
  RotateFolderShareSecretInput,
  SetWebsiteConfigInput,
  SetFolderShareMessagesInput,
  SetFileFavoriteInput,
  SetShareMessageSenderBlockInput,
  ShareMessageChannel,
  ShareMessageMutationInput,
  SubmitShareMessageInput,
  UpdateShareMessageSafetyInput,
  CollectShareMessageGarbageOutput,
  ShareFileInput,
  ShareListEntriesInput,
  ShareListEntriesOutput,
  ShareReadFileChunkInput,
  ShareReadFileRangeInput,
  ShareSubtreeManifestInput,
  ShareSubtreeManifestOutput,
  SubtreeManifestInput,
  SubtreeManifestOutput,
  TransferCyclesInput,
  TransferCyclesOutput,
  UpdateBucketInput,
  UpdateFileChunkInput,
  UpdateFileChunkOutput,
  UpdateFileInput,
  UpdateFileOutput,
  UpdateFolderInput,
  UpdateFolderShareInput,
  UpsertReaderGrantInput,
  UploadChunkInput,
  UploadChunkOutput,
  UploadHealth,
  UploadStatusOutput,
  WebsiteConfig
} from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import { idlFactory } from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import type { CanisterOptions } from './types.js'
import { FileChunk, resultOk } from './types.js'
import {
  folderShareSecretFromCode,
  hashFolderShareCode,
  normalizeFolderShareCode,
  randomFolderShareCode
} from './folder_share.js'
import {
  ciphertextSize,
  createZoneKeyEnvelope,
  decryptAuthenticatedFile,
  decryptFileChunk,
  deriveZoneKek,
  newTransportSecretKey,
  unwrapFileKey,
  unwrapZoneKey,
  zoneVetkdInput
} from './encryption.js'

export interface OpenedEncryptionZone {
  zone: EncryptionZone
  /** Client-only secret; never serialize or log it. */
  zoneWrappingKey: Uint8Array
}

export interface EncryptedFileStream {
  file: FileInfo
  /** Each emitted chunk passed AEAD authentication; publish staged output only after `closed`. */
  stream: ReadableStream<Uint8Array>
  closed: Promise<void>
}

export function clearOpenedEncryptionZone(opened: OpenedEncryptionZone): void {
  opened.zoneWrappingKey.fill(0)
}

interface CachedZoneKey {
  zone: EncryptionZone
  key: Uint8Array
  expiresAt: number
}

/** Opt-in, memory-only, TTL/capacity-bounded Zone key cache. */
export class EncryptionZoneKeyCache {
  readonly #ttlMs: number
  readonly #maxEntries: number
  readonly #entries = new Map<string, CachedZoneKey>()

  constructor(options: { ttlMs?: number; maxEntries?: number } = {}) {
    this.#ttlMs = options.ttlMs ?? 5 * 60_000
    this.#maxEntries = options.maxEntries ?? 16
    if (
      !Number.isSafeInteger(this.#ttlMs) ||
      this.#ttlMs <= 0 ||
      this.#ttlMs > 24 * 60 * 60_000
    ) {
      throw new Error('Zone key cache TTL must be between 1 ms and 24 hours')
    }
    if (
      !Number.isSafeInteger(this.#maxEntries) ||
      this.#maxEntries < 1 ||
      this.#maxEntries > 256
    ) {
      throw new Error('Zone key cache capacity must be between 1 and 256')
    }
  }

  clear(): void {
    for (const value of this.#entries.values()) value.key.fill(0)
    this.#entries.clear()
  }

  get(
    bucket: Principal,
    zone: EncryptionZone
  ): OpenedEncryptionZone | undefined {
    this.#purgeExpired()
    const value = this.#entries.get(this.#key(bucket, zone))
    return value
      ? { zone: value.zone, zoneWrappingKey: new Uint8Array(value.key) }
      : undefined
  }

  set(bucket: Principal, opened: OpenedEncryptionZone): void {
    this.#purgeExpired()
    const zonePrefix = `${bucket.toText()}:${toHex(opened.zone.zone_id)}:`
    for (const [key, value] of this.#entries) {
      if (key.startsWith(zonePrefix)) {
        value.key.fill(0)
        this.#entries.delete(key)
      }
    }
    while (this.#entries.size >= this.#maxEntries) {
      const oldest = [...this.#entries.entries()].reduce((left, right) =>
        left[1].expiresAt <= right[1].expiresAt ? left : right
      )
      oldest[1].key.fill(0)
      this.#entries.delete(oldest[0])
    }
    this.#entries.set(this.#key(bucket, opened.zone), {
      zone: opened.zone,
      key: new Uint8Array(opened.zoneWrappingKey),
      expiresAt: Date.now() + this.#ttlMs
    })
  }

  #purgeExpired(): void {
    const now = Date.now()
    for (const [key, value] of this.#entries) {
      if (value.expiresAt <= now) {
        value.key.fill(0)
        this.#entries.delete(key)
      }
    }
  }

  #key(bucket: Principal, zone: EncryptionZone): string {
    return `${bucket.toText()}:${toHex(zone.zone_id)}:${zone.revision}`
  }
}

function toHex(value: Uint8Array | number[]): string {
  return Array.from(value, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  )
}

const FOLDER_SHARE_SECRET_DOMAIN = new TextEncoder().encode(
  'ic-oss-folder-share-v1'
)

export interface FolderShareMaterial {
  shareId: Uint8Array
  secret: Uint8Array
  secretHash: Uint8Array
  credential: FolderShareCredential
}

export type CollectFolderShareGarbageInput = MigrateDirectoryStorageInput

export interface FolderShareSecretMaterial {
  secret: Uint8Array
  secretHash: Uint8Array
  credential: FolderShareCredential
}

export interface FolderShareCodeMaterial extends FolderShareMaterial {
  code: string
  codeHash: Uint8Array
}

export function hashFolderShareSecret(
  canisterId: Principal,
  shareId: Uint8Array,
  secret: Uint8Array
): Uint8Array {
  if (shareId.length !== 16) throw new Error('shareId must be 16 bytes')
  if (secret.length !== 32) throw new Error('share secret must be 32 bytes')
  const canister = canisterId.toUint8Array()
  const message = new Uint8Array(
    FOLDER_SHARE_SECRET_DOMAIN.length +
      canister.length +
      shareId.length +
      secret.length
  )
  let offset = 0
  for (const part of [FOLDER_SHARE_SECRET_DOMAIN, canister, shareId, secret]) {
    message.set(part, offset)
    offset += part.length
  }
  return Uint8Array.from(sha3_256(message))
}

export function createFolderShareMaterial(
  canisterId: Principal,
  randomValues: (value: Uint8Array) => Uint8Array = (value) =>
    globalThis.crypto.getRandomValues(value)
): FolderShareMaterial {
  const shareId = randomValues(new Uint8Array(16))
  const secret = randomValues(new Uint8Array(32))
  if (
    shareId.every((byte) => byte === 0) ||
    secret.every((byte) => byte === 0)
  ) {
    throw new Error('folder share random material cannot be all zeroes')
  }
  return {
    shareId,
    secret,
    secretHash: hashFolderShareSecret(canisterId, shareId, secret),
    credential: { share_id: shareId, secret }
  }
}

export function createFolderShareSecret(
  canisterId: Principal,
  shareId: Uint8Array,
  randomValues: (value: Uint8Array) => Uint8Array = (value) =>
    globalThis.crypto.getRandomValues(value)
): FolderShareSecretMaterial {
  const secret = randomValues(new Uint8Array(32))
  if (secret.every((byte) => byte === 0)) {
    throw new Error('folder share random material cannot be all zeroes')
  }
  return {
    secret,
    secretHash: hashFolderShareSecret(canisterId, shareId, secret),
    credential: { share_id: shareId, secret }
  }
}

export function createFolderShareCodeMaterial(
  canisterId: Principal,
  code = randomFolderShareCode(),
  randomValues: (value: Uint8Array) => Uint8Array = (value) =>
    globalThis.crypto.getRandomValues(value)
): FolderShareCodeMaterial {
  const normalizedCode = normalizeFolderShareCode(code)
  const shareId = randomValues(new Uint8Array(16))
  if (shareId.every((byte) => byte === 0)) {
    throw new Error('folder share random material cannot be all zeroes')
  }
  const secret = folderShareSecretFromCode(canisterId, shareId, normalizedCode)
  return {
    code: normalizedCode,
    codeHash: hashFolderShareCode(canisterId, normalizedCode),
    shareId,
    secret,
    secretHash: hashFolderShareSecret(canisterId, shareId, secret),
    credential: { share_id: shareId, secret }
  }
}

export function createFolderShareCodeSecret(
  canisterId: Principal,
  shareId: Uint8Array,
  code = randomFolderShareCode()
): FolderShareCodeMaterial {
  const normalizedCode = normalizeFolderShareCode(code)
  const normalizedShareId = Uint8Array.from(shareId)
  const secret = folderShareSecretFromCode(
    canisterId,
    normalizedShareId,
    normalizedCode
  )
  return {
    code: normalizedCode,
    codeHash: hashFolderShareCode(canisterId, normalizedCode),
    shareId: normalizedShareId,
    secret,
    secretHash: hashFolderShareSecret(canisterId, normalizedShareId, secret),
    credential: { share_id: normalizedShareId, secret }
  }
}

// Candid deduplicates these structurally identical wire records as
// `AbortUploadInput`; expose operation-specific names to SDK consumers.
export type RenewUploadInput = AbortUploadInput
export type CommitUploadInput = AbortUploadInput

export class BucketCanister extends Canister<BucketService> {
  #resultOk: typeof resultOk = resultOk
  #accessToken: [] | [Uint8Array] = []

  static create(
    options: CanisterOptions<BucketService> & {
      accessToken?: Uint8Array
    }
  ) {
    const { service, certifiedService, canisterId } =
      createServices<BucketService>({
        options,
        idlFactory,
        certifiedIdlFactory: idlFactory
      })

    const self = new BucketCanister(canisterId, service, certifiedService)
    self.#resultOk = options.unwrapResult || resultOk
    self.#accessToken = options.accessToken
      ? [new Uint8Array(options.accessToken)]
      : []
    return self
  }

  setAccessToken(accessToken?: Uint8Array): this {
    this.clearAccessToken()
    this.#accessToken = accessToken ? [new Uint8Array(accessToken)] : []
    return this
  }

  clearAccessToken(): this {
    this.#accessToken[0]?.fill(0)
    this.#accessToken = []
    return this
  }

  async getCanisterStatus(): Promise<CanisterStatusResult> {
    const res = await this.service.get_canister_status()
    return this.#resultOk(res)
  }

  async isCallerController(): Promise<boolean> {
    return this.service.is_caller_controller()
  }

  async getBucketInfo(): Promise<BucketInfo> {
    const res = await this.service.get_bucket_info(this.#accessToken)
    return this.#resultOk(res)
  }

  async getStorageMetrics(): Promise<BucketStorageMetrics> {
    const res = await this.service.get_storage_metrics(this.#accessToken)
    return this.#resultOk(res)
  }

  async getCapabilities(): Promise<BucketCapabilities> {
    return this.service.get_capabilities()
  }

  async getMyEncryptionProfile(): Promise<EncryptionProfile | undefined> {
    const result = this.#resultOk(
      await this.service.get_my_encryption_profile(this.#accessToken)
    ) as [] | [EncryptionProfile]
    return result[0]
  }

  async getEncryptionZone(zoneId: Uint8Array): Promise<EncryptionZone> {
    return this.#resultOk(
      await this.service.get_encryption_zone(zoneId, this.#accessToken)
    )
  }

  async resolveEncryptionZone(
    folderId: number
  ): Promise<EncryptionZone | undefined> {
    const result = this.#resultOk(
      await this.service.resolve_encryption_zone(folderId, this.#accessToken)
    ) as [] | [EncryptionZone]
    return result[0]
  }

  async resolveEncryptionZones(
    folderIds: number[]
  ): Promise<ResolvedEncryptionZone[]> {
    return this.#resultOk(
      await this.service.resolve_encryption_zones(
        Uint32Array.from(folderIds),
        this.#accessToken
      )
    )
  }

  async createRootEncryptionZone(
    input: CreateEncryptionZoneInput
  ): Promise<EncryptionZone> {
    return this.#resultOk(
      await this.service.create_root_encryption_zone(input, this.#accessToken)
    )
  }

  async createChildEncryptionZone(
    input: CreateEncryptionZoneInput
  ): Promise<EncryptionZone> {
    return this.#resultOk(
      await this.service.create_child_encryption_zone(input, this.#accessToken)
    )
  }

  async initializeEncryptionZoneKey(
    input: InitializeEncryptionZoneKeyInput
  ): Promise<EncryptionZone> {
    return this.#resultOk(
      await this.service.initialize_encryption_zone_key(
        input,
        this.#accessToken
      )
    )
  }

  async archiveEncryptionZone(
    input: ArchiveEncryptionZoneInput
  ): Promise<EncryptionZone> {
    return this.#resultOk(
      await this.service.archive_encryption_zone(input, this.#accessToken)
    )
  }

  async deriveZoneKey(input: DeriveZoneKeyInput): Promise<DerivedZoneKey> {
    return this.#resultOk(
      await this.service.derive_zone_key(input, this.#accessToken)
    )
  }

  /** Derives, verifies and opens the client-only Zone Wrapping Key. */
  async openEncryptionZone(zoneId: Uint8Array): Promise<OpenedEncryptionZone> {
    const zone = await this.getEncryptionZone(zoneId)
    return this.#openEncryptionZoneRecord(zone)
  }

  async #openEncryptionZoneRecord(
    zone: EncryptionZone
  ): Promise<OpenedEncryptionZone> {
    const active = zone.active_envelope[0]
    if (active === undefined) {
      throw new Error('encryption zone is not initialized')
    }
    const envelope = zone.key_envelopes[active]
    if (!envelope) {
      throw new Error('encryption zone active envelope is missing')
    }
    const transportSecret = newTransportSecretKey()
    const reply = await this.deriveZoneKey({
      zone_id: zone.zone_id,
      expected_key_version: envelope.key_version,
      transport_public_key: transportSecret.publicKeyBytes()
    })
    const zoneKek = deriveZoneKek(
      transportSecret,
      reply,
      zoneVetkdInput(
        this.canisterId,
        zone.owner,
        new Uint8Array(zone.zone_id),
        reply.key_version
      )
    )
    try {
      return {
        zone,
        zoneWrappingKey: unwrapZoneKey(
          new Uint8Array(zone.zone_id),
          envelope,
          zoneKek
        )
      }
    } finally {
      zoneKek.fill(0)
    }
  }

  async openEncryptionZoneCached(
    zoneId: Uint8Array,
    cache: EncryptionZoneKeyCache
  ): Promise<OpenedEncryptionZone> {
    const zone = await this.getEncryptionZone(zoneId)
    const cached = cache.get(this.canisterId, zone)
    if (cached) return cached
    const opened = await this.#openEncryptionZoneRecord(zone)
    cache.set(this.canisterId, opened)
    return opened
  }

  /** Completes the initial VetKD-only key envelope for a pending Zone. */
  async initializePendingEncryptionZone(
    zone: EncryptionZone
  ): Promise<OpenedEncryptionZone> {
    if (
      !('PendingInitialization' in zone.state) ||
      zone.active_envelope.length !== 0
    ) {
      throw new Error('encryption zone is not pending initialization')
    }
    const transportSecret = newTransportSecretKey()
    const reply = await this.deriveZoneKey({
      zone_id: zone.zone_id,
      expected_key_version: 1,
      transport_public_key: transportSecret.publicKeyBytes()
    })
    const zoneKek = deriveZoneKek(
      transportSecret,
      reply,
      zoneVetkdInput(
        this.canisterId,
        zone.owner,
        new Uint8Array(zone.zone_id),
        reply.key_version
      )
    )
    const created = (() => {
      try {
        return createZoneKeyEnvelope(
          this.canisterId,
          new Uint8Array(zone.zone_id),
          reply.key_version,
          zoneKek
        )
      } finally {
        zoneKek.fill(0)
      }
    })()
    try {
      const initialized = await this.initializeEncryptionZoneKey({
        zone_id: zone.zone_id,
        expected_revision: zone.revision,
        envelope: created.envelope
      })
      return { zone: initialized, zoneWrappingKey: created.zoneWrappingKey }
    } catch (error) {
      created.zoneWrappingKey.fill(0)
      throw error
    }
  }

  async getDomainConfig(): Promise<DomainConfig> {
    return this.service.get_domain_config()
  }

  async getOAuthConfig(): Promise<OAuthPublicConfig> {
    return this.service.get_oauth_config()
  }

  async oauthBegin(input: OAuthBeginInput): Promise<OAuthBeginOutput> {
    return this.#resultOk(await this.service.oauth_begin(input))
  }

  async oauthComplete(input: OAuthCompleteInput): Promise<OAuthCompleteOutput> {
    return this.#resultOk(await this.service.oauth_complete(input))
  }

  async adminSetOAuthConfig(input: OAuthConfigInput): Promise<void> {
    this.#resultOk(await this.service.admin_set_oauth_config(input))
  }

  async adminListOAuthAccounts(): Promise<OAuthAccount[]> {
    return this.service.admin_list_oauth_accounts()
  }

  async adminReviewOAuthAccount(
    input: OAuthReviewInput
  ): Promise<OAuthAccount> {
    return this.#resultOk(await this.service.admin_review_oauth_account(input))
  }

  async adminSetCustomDomains(domains: string[]): Promise<void> {
    const res = await this.service.admin_set_custom_domains(domains)
    this.#resultOk(res)
  }

  async adminSetWebsiteEnabled(enabled: boolean): Promise<WebsiteConfig> {
    const res = await this.service.admin_set_website_enabled(enabled)
    return this.#resultOk(res)
  }

  async adminSetWebsiteConfig(
    input: SetWebsiteConfigInput
  ): Promise<WebsiteConfig> {
    const res = await this.service.admin_set_website_config(input)
    return this.#resultOk(res)
  }

  async adminSetReaderAuthority(authority?: Principal): Promise<void> {
    const res = await this.service.admin_set_reader_authority(
      authority ? [authority] : []
    )
    this.#resultOk(res)
  }

  async adminUpsertReaderGrant(
    input: UpsertReaderGrantInput
  ): Promise<ReaderGrant> {
    const res = await this.service.admin_upsert_reader_grant(input)
    return this.#resultOk(res)
  }

  async adminRevokeReaderGrant(
    input: RevokeReaderGrantInput
  ): Promise<ReaderGrant> {
    const res = await this.service.admin_revoke_reader_grant(input)
    return this.#resultOk(res)
  }

  async getMyReaderGrant(): Promise<ReaderGrant | undefined> {
    const res = await this.service.get_my_reader_grant()
    const grant = this.#resultOk(res) as [] | [ReaderGrant]
    return grant[0]
  }

  async adminMigrateDirectoryStorage(
    input: MigrateDirectoryStorageInput
  ): Promise<MigrateDirectoryStorageOutput> {
    return this.service.admin_migrate_directory_storage(input)
  }

  async adminRetryDirectoryMigration(): Promise<MigrateDirectoryStorageOutput> {
    return this.service.admin_retry_directory_migration()
  }

  async adminTransferCycles(
    input: TransferCyclesInput
  ): Promise<TransferCyclesOutput> {
    return this.#resultOk(await this.service.admin_transfer_cycles(input))
  }

  async adminUpdateEncryptionConfig(input: {
    encryptionWrites?: boolean
    vetkdDerivation?: boolean
  }): Promise<void> {
    const update: UpdateBucketInput = {
      status: [],
      reader_policy: [],
      trusted_eddsa_pub_keys: [],
      name: [],
      max_custom_data_size: [],
      http_read_mode: [],
      encryption_writes:
        input.encryptionWrites === undefined ? [] : [input.encryptionWrites],
      vetkd_derivation:
        input.vetkdDerivation === undefined ? [] : [input.vetkdDerivation],
      max_children: [],
      enable_hash_index: [],
      max_file_size: [],
      visibility: [],
      max_folder_depth: [],
      trusted_ecdsa_pub_keys: []
    }
    this.#resultOk(await this.service.admin_update_bucket(update))
  }

  async batchDeleteSubfiles(parent: number, ids: number[]): Promise<number[]> {
    const res = await this.service.batch_delete_subfiles(
      parent,
      ids,
      this.#accessToken
    )
    return this.#resultOk(res) as number[]
  }

  async createFile(input: CreateFileInput): Promise<CreateFileOutput> {
    const res = await this.service.create_file(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async batchCreateSmallFiles(
    input: BatchCreateSmallFilesInput
  ): Promise<BatchCreateSmallFilesOutput> {
    const res = await this.service.batch_create_small_files(
      input,
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async createFolder(input: CreateFolderInput): Promise<CreateFileOutput> {
    const res = await this.service.create_folder(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async ensureFolder(input: EnsureFolderInput): Promise<EnsureFolderOutput> {
    const res = await this.service.ensure_folder(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async batchEnsureFolders(
    input: BatchEnsureFoldersInput
  ): Promise<BatchEnsureFoldersOutput> {
    const res = await this.service.batch_ensure_folders(
      input,
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async deleteFile(id: number): Promise<boolean> {
    const res = await this.service.delete_file(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async deleteFolder(id: number): Promise<boolean> {
    const res = await this.service.delete_folder(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async deleteEntryIf(input: DeleteEntryIfInput): Promise<boolean> {
    const res = await this.service.delete_entry_if(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async beginUpload(input: BeginUploadInput): Promise<BeginUploadOutput> {
    const res = await this.service.begin_upload(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async uploadChunk(input: UploadChunkInput): Promise<UploadChunkOutput> {
    const res = await this.service.upload_chunk(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async getUploadStatus(
    input: GetUploadStatusInput
  ): Promise<UploadStatusOutput> {
    const res = await this.service.get_upload_status(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async getUploadHealth(): Promise<UploadHealth> {
    const res = await this.service.get_upload_health(this.#accessToken)
    return this.#resultOk(res)
  }

  async renewUpload(input: RenewUploadInput): Promise<RenewUploadOutput> {
    const res = await this.service.renew_upload(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async commitUpload(input: CommitUploadInput): Promise<CommitUploadOutput> {
    const res = await this.service.commit_upload(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async abortUpload(input: AbortUploadInput): Promise<boolean> {
    const res = await this.service.abort_upload(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async getGcHealth(): Promise<GcHealth> {
    const res = await this.service.get_gc_health(this.#accessToken)
    return this.#resultOk(res)
  }

  async collectGarbage(
    input: CollectGarbageInput
  ): Promise<CollectGarbageOutput> {
    const res = await this.service.collect_garbage(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async getFileAncestors(id: number): Promise<FolderName[]> {
    const res = await this.service.get_file_ancestors(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async getFolderAncestors(id: number): Promise<FolderName[]> {
    const res = await this.service.get_folder_ancestors(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async getEntry(input: GetEntryInput): Promise<EntryInfoV2 | undefined> {
    const res = await this.service.get_entry(input, this.#accessToken)
    const entry = this.#resultOk(res) as [] | [EntryInfoV2]
    return entry[0]
  }

  async listEntries(input: ListEntriesInput): Promise<ListEntriesOutput> {
    const res = await this.service.list_entries(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async getDirectoryStorageHealth(): Promise<DirectoryStorageHealth> {
    const res = await this.service.get_directory_storage_health(
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async getSubtreeManifest(
    input: SubtreeManifestInput
  ): Promise<SubtreeManifestOutput> {
    const res = await this.service.get_subtree_manifest(
      input,
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async createFolderShare(input: CreateFolderShareInput): Promise<FolderShare> {
    return this.#resultOk(await this.service.create_folder_share(input))
  }

  async updateFolderShare(input: UpdateFolderShareInput): Promise<FolderShare> {
    return this.#resultOk(await this.service.update_folder_share(input))
  }

  async rotateFolderShareSecret(
    input: RotateFolderShareSecretInput
  ): Promise<FolderShare> {
    return this.#resultOk(await this.service.rotate_folder_share_secret(input))
  }

  async revokeFolderShare(input: RevokeFolderShareInput): Promise<FolderShare> {
    return this.#resultOk(await this.service.revoke_folder_share(input))
  }

  async listFolderShares(
    input: ListFolderSharesInput
  ): Promise<ListFolderSharesOutput> {
    return this.service.list_folder_shares(input)
  }

  async lookupFolderShareCode(
    input: LookupFolderShareCodeInput
  ): Promise<LookupFolderShareCodeOutput> {
    return this.#resultOk(await this.service.lookup_folder_share_code(input))
  }

  async listFileFavorites(
    input: ListFileFavoritesInput
  ): Promise<ListFileFavoritesOutput> {
    return this.#resultOk(
      await this.service.list_file_favorites(input, this.#accessToken)
    )
  }

  async getFileFavoriteIds(): Promise<number[]> {
    return Array.from(
      this.#resultOk(await this.service.get_file_favorite_ids())
    )
  }

  async setFileFavorite(input: SetFileFavoriteInput): Promise<boolean> {
    return this.#resultOk(
      await this.service.set_file_favorite(input, this.#accessToken)
    )
  }

  async getFolderShare(shareId: Uint8Array): Promise<FolderShare> {
    return this.#resultOk(await this.service.get_folder_share(shareId))
  }

  async collectFolderShareGarbage(
    input: CollectFolderShareGarbageInput
  ): Promise<CollectFolderShareGarbageOutput> {
    return this.service.collect_folder_share_garbage(input)
  }

  async issueMarketListingTicket(
    input: IssueMarketListingTicketInput
  ): Promise<MarketListingTicketView> {
    return this.#resultOk(await this.service.issue_market_listing_ticket(input))
  }

  async resolveFolderShare(
    credential: FolderShareCredential
  ): Promise<ResolveFolderShareOutput> {
    return this.#resultOk(
      await this.service.resolve_folder_share({ credential })
    )
  }

  async shareListEntries(
    input: ShareListEntriesInput
  ): Promise<ShareListEntriesOutput> {
    return this.#resultOk(await this.service.share_list_entries(input))
  }

  async shareSubtreeManifest(
    input: ShareSubtreeManifestInput
  ): Promise<ShareSubtreeManifestOutput> {
    return this.#resultOk(await this.service.share_subtree_manifest(input))
  }

  async shareGetFileDescriptor(input: ShareFileInput): Promise<FileDescriptor> {
    return this.#resultOk(await this.service.share_get_file_descriptor(input))
  }

  async shareReadFileChunk(
    input: ShareReadFileChunkInput
  ): Promise<Uint8Array> {
    return Uint8Array.from(
      this.#resultOk(await this.service.share_read_file_chunk(input))
    )
  }

  async shareReadFileRange(
    input: ShareReadFileRangeInput
  ): Promise<Uint8Array> {
    return Uint8Array.from(
      this.#resultOk(await this.service.share_read_file_range(input))
    )
  }

  async getFolderShareMessageChannel(
    shareId: Uint8Array
  ): Promise<ShareMessageChannel> {
    return this.#resultOk(
      await this.service.get_folder_share_message_channel(shareId)
    )
  }

  async getShareMessageSafetyConfig(): Promise<
    ContentSafetyVerifierConfig | undefined
  > {
    return (await this.service.get_share_message_safety_config())[0]
  }

  async updateShareMessageSafety(
    input: UpdateShareMessageSafetyInput
  ): Promise<ContentSafetyVerifierConfig | undefined> {
    return this.#resultOk(
      await this.service.admin_update_share_message_safety(input)
    )[0]
  }

  async setFolderShareMessages(
    input: SetFolderShareMessagesInput
  ): Promise<ShareMessageChannel> {
    return this.#resultOk(await this.service.set_folder_share_messages(input))
  }

  async submitShareMessage(
    input: SubmitShareMessageInput
  ): Promise<OssShareMessage> {
    return this.#resultOk(await this.service.submit_share_message(input))
  }

  async listMyShareMessages(
    input: ListShareMessagesInput
  ): Promise<ListShareMessagesOutput> {
    return this.service.list_my_share_messages(input)
  }

  async deleteMyShareMessage(
    input: ShareMessageMutationInput
  ): Promise<OssShareMessage> {
    return this.#resultOk(await this.service.delete_my_share_message(input))
  }

  async retractSentShareMessage(
    input: ShareMessageMutationInput
  ): Promise<OssShareMessage> {
    return this.#resultOk(await this.service.retract_sent_share_message(input))
  }

  async reportShareMessage(
    input: ReportShareMessageInput
  ): Promise<OssShareMessage> {
    return this.#resultOk(await this.service.report_share_message(input))
  }

  async setShareMessageSenderBlock(
    input: SetShareMessageSenderBlockInput
  ): Promise<boolean> {
    return this.#resultOk(
      await this.service.set_share_message_sender_block(input)
    )
  }

  async collectShareMessageGarbage(
    input: MigrateDirectoryStorageInput
  ): Promise<CollectShareMessageGarbageOutput> {
    return this.service.collect_share_message_garbage(input)
  }

  async getFileChunks(
    id: number,
    chunkIdex: number,
    take: number = 0
  ): Promise<FileChunk[]> {
    const res = await this.service.get_file_chunks(
      id,
      chunkIdex,
      take > 0 ? [take] : [],
      this.#accessToken
    )
    return this.#resultOk(res) as FileChunk[]
  }

  async getFileInfo(id: number): Promise<FileInfo> {
    const res = await this.service.get_file_info(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async getFileDescriptor(id: number): Promise<FileDescriptor> {
    const res = await this.service.get_file_descriptor(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async readFileChunk(input: ReadFileChunkInput): Promise<Uint8Array> {
    const res = await this.service.read_file_chunk(input, this.#accessToken)
    return Uint8Array.from(this.#resultOk(res))
  }

  async readFileRange(input: ReadFileRangeInput): Promise<Uint8Array> {
    const res = await this.service.read_file_range(input, this.#accessToken)
    return Uint8Array.from(this.#resultOk(res))
  }

  /**
   * Reads an encrypted generation in full and returns plaintext only after
   * every chunk authenticates and the stored ciphertext hash has been
   * checked. This intentionally buffers the result; applications handling
   * very large files should use the lower-level authenticated primitives and
   * stage output before publishing it.
   */
  async readEncryptedFile(id: number): Promise<Uint8Array> {
    const file = await this.getFileInfo(id)
    const encryption = file.encryption[0]
    if (!encryption) {
      throw new Error('file is not encrypted')
    }
    if (encryption.plaintext_size > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error(
        'plaintext file size exceeds JavaScript safe integer range'
      )
    }
    const expectedCiphertextSize = ciphertextSize(
      encryption.plaintext_size,
      encryption.plaintext_chunk_size
    )
    if (file.size !== expectedCiphertextSize || file.filled !== file.size) {
      throw new Error(
        'encrypted file has an invalid or incomplete ciphertext size'
      )
    }

    const zone = await this.openEncryptionZone(
      new Uint8Array(encryption.zone_id)
    )
    const fileDek = unwrapFileKey(encryption, zone.zoneWrappingKey)
    try {
      const chunks: Uint8Array[] = []
      for (let index = 0; index < file.chunks; index += 1) {
        const ciphertext = await this.readFileChunk({
          file_id: file.id,
          generation: file.generation,
          index
        })
        chunks.push(ciphertext)
      }
      const expectedHash = file.hash[0]
      return decryptAuthenticatedFile(
        encryption,
        fileDek,
        chunks,
        expectedHash ? new Uint8Array(expectedHash) : undefined
      )
    } finally {
      fileDek.fill(0)
      clearOpenedEncryptionZone(zone)
    }
  }

  /** Streams independently authenticated plaintext chunks with bounded memory. */
  async readEncryptedFileStream(id: number): Promise<EncryptedFileStream> {
    const file = await this.getFileInfo(id)
    const encryption = file.encryption[0]
    if (!encryption) throw new Error('file is not encrypted')
    if (
      !Number.isSafeInteger(encryption.plaintext_chunk_size) ||
      encryption.plaintext_chunk_size <= 0
    ) {
      throw new Error('invalid encrypted file plaintext chunk size')
    }
    const expectedCiphertextSize = ciphertextSize(
      encryption.plaintext_size,
      encryption.plaintext_chunk_size
    )
    const expectedChunksBigInt =
      (encryption.plaintext_size +
        BigInt(encryption.plaintext_chunk_size) -
        1n) /
      BigInt(encryption.plaintext_chunk_size)
    if (expectedChunksBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new Error('encrypted file chunk count exceeds safe integer range')
    }
    const expectedChunks = Number(expectedChunksBigInt)
    if (
      file.size !== expectedCiphertextSize ||
      file.filled !== file.size ||
      file.chunks !== expectedChunks
    ) {
      throw new Error('encrypted file descriptor or ciphertext is incomplete')
    }
    const opened = await this.openEncryptionZone(
      new Uint8Array(encryption.zone_id)
    )
    const fileDek = unwrapFileKey(encryption, opened.zoneWrappingKey)
    const hasher = sha3_256.create()
    let index = 0
    let plaintextBytes = 0n
    let cleaned = false
    let resolveClosed!: () => void
    let rejectClosed!: (error: unknown) => void
    const closed = new Promise<void>((resolve, reject) => {
      resolveClosed = resolve
      rejectClosed = reject
    })
    // Consumers may rely only on ReadableStream errors. Attach a no-op handler
    // so that the parallel completion signal never becomes an unhandled
    // rejection; callers can still await the original promise and receive it.
    void closed.catch(() => undefined)
    const cleanup = () => {
      if (cleaned) return
      cleaned = true
      fileDek.fill(0)
      clearOpenedEncryptionZone(opened)
    }
    const stream = new ReadableStream<Uint8Array>({
      pull: async (controller) => {
        try {
          if (index === file.chunks) {
            if (plaintextBytes !== encryption.plaintext_size) {
              throw new Error(
                'decrypted file size does not match its encryption descriptor'
              )
            }
            const expectedHash = file.hash[0]
            const actualHash = hasher.digest()
            if (
              expectedHash &&
              !actualHash.every((byte, offset) => byte === expectedHash[offset])
            ) {
              throw new Error('encrypted file ciphertext hash mismatch')
            }
            cleanup()
            controller.close()
            resolveClosed()
            return
          }
          const ciphertext = await this.readFileChunk({
            file_id: file.id,
            generation: file.generation,
            index
          })
          hasher.update(ciphertext)
          const plaintext = decryptFileChunk(
            encryption,
            fileDek,
            index,
            ciphertext
          )
          const remaining = encryption.plaintext_size - plaintextBytes
          const expectedLength = Number(
            remaining < BigInt(encryption.plaintext_chunk_size)
              ? remaining
              : BigInt(encryption.plaintext_chunk_size)
          )
          if (plaintext.byteLength !== expectedLength) {
            plaintext.fill(0)
            throw new Error(
              'decrypted chunk size does not match its encryption descriptor'
            )
          }
          index += 1
          plaintextBytes += BigInt(plaintext.byteLength)
          controller.enqueue(plaintext)
        } catch (error) {
          cleanup()
          controller.error(error)
          rejectClosed(error)
        }
      },
      cancel: (reason) => {
        cleanup()
        rejectClosed(reason ?? new Error('encrypted file stream cancelled'))
      }
    })
    return { file, stream, closed }
  }

  async getFileInfoByHash(hash: Uint8Array): Promise<FileInfo> {
    const res = await this.service.get_file_info_by_hash(
      hash,
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async getFolderInfo(id: number): Promise<FolderInfo> {
    const res = await this.service.get_folder_info(id, this.#accessToken)
    return this.#resultOk(res)
  }

  async listFiles(
    parent: number,
    prev: number = 0,
    take: number = 0
  ): Promise<FileInfo[]> {
    const res = await this.service.list_files(
      parent,
      prev > 0 ? [prev] : [],
      take > 0 ? [take] : [],
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async listFolders(
    parent: number,
    prev: number = 0,
    take: number = 0
  ): Promise<FolderInfo[]> {
    const res = await this.service.list_folders(
      parent,
      prev > 0 ? [prev] : [],
      take > 0 ? [take] : [],
      this.#accessToken
    )
    return this.#resultOk(res)
  }

  async moveFile(input: MoveInput): Promise<UpdateFileOutput> {
    const res = await this.service.move_file(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async moveFolder(input: MoveInput): Promise<UpdateFileOutput> {
    const res = await this.service.move_folder(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async updateFileChunk(
    input: UpdateFileChunkInput
  ): Promise<UpdateFileChunkOutput> {
    const res = await this.service.update_file_chunk(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async updateFileInfo(input: UpdateFileInput): Promise<UpdateFileOutput> {
    const res = await this.service.update_file_info(input, this.#accessToken)
    return this.#resultOk(res)
  }

  async updateFolderInfo(input: UpdateFolderInput): Promise<UpdateFileOutput> {
    const res = await this.service.update_folder_info(input, this.#accessToken)
    return this.#resultOk(res)
  }
}

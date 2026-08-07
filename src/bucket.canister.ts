import { Canister, createServices } from '@dfinity/utils'
import type { Principal } from '@dfinity/principal'
import type {
  AbortUploadInput,
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
  CollectGarbageInput,
  CollectGarbageOutput,
  CommitUploadOutput,
  CreateFileInput,
  CreateFileOutput,
  CreateFolderInput,
  DeleteEntryIfInput,
  DirectoryStorageHealth,
  DomainConfig,
  EnsureFolderInput,
  EnsureFolderOutput,
  EntryInfoV2,
  FileDescriptor,
  FileInfo,
  ReadFileChunkInput,
  ReadFileRangeInput,
  ReaderGrant,
  RevokeReaderGrantInput,
  FolderInfo,
  FolderName,
  GcHealth,
  GetEntryInput,
  GetUploadStatusInput,
  ListEntriesInput,
  ListEntriesOutput,
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
  RenewUploadOutput,
  SubtreeManifestInput,
  SubtreeManifestOutput,
  TransferCyclesInput,
  TransferCyclesOutput,
  UpdateFileChunkInput,
  UpdateFileChunkOutput,
  UpdateFileInput,
  UpdateFileOutput,
  UpdateFolderInput,
  UpsertReaderGrantInput,
  UploadChunkInput,
  UploadChunkOutput,
  UploadHealth,
  UploadStatusOutput
} from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import { idlFactory } from '../candid/ic_oss_bucket/ic_oss_bucket.did.js'
import type { CanisterOptions } from './types.js'
import { FileChunk, resultOk } from './types.js'

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
    self.#accessToken = options.accessToken ? [options.accessToken] : []
    return self
  }

  setAccessToken(accessToken?: Uint8Array): this {
    this.#accessToken = accessToken ? [accessToken] : []
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

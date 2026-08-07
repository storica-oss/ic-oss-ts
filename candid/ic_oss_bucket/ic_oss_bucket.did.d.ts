import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AbortUploadInput {
  'request_id' : Uint8Array | number[],
  'session_id' : Uint8Array | number[],
}
export interface BatchCreateSmallFilesInput {
  'files' : Array<CreateFileInput>,
  'request_id' : Uint8Array | number[],
}
export interface BatchCreateSmallFilesOutput { 'results' : Array<Result_6> }
export interface BatchEnsureFoldersInput {
  'request_id' : Uint8Array | number[],
  'folders' : Array<CreateFolderInput>,
}
export interface BatchEnsureFoldersOutput { 'results' : Array<Result_9> }
export interface BatchUpsertReaderGrantsInput {
  'request_id' : Uint8Array | number[],
  'grants' : Array<ReaderGrantSpec>,
}
export interface BatchUpsertReaderGrantsOutput { 'results' : Array<Result_2> }
export interface BeginUploadInput {
  'dek' : [] | [Uint8Array | number[]],
  'request_id' : Uint8Array | number[],
  'status' : number,
  'custom' : [] | [Array<[string, MetadataValue]>],
  'hash' : [] | [Uint8Array | number[]],
  'expected_parent_revision' : bigint,
  'name' : string,
  'size' : bigint,
  'content_type' : string,
  'replace' : [] | [ReplaceFileInput],
  'parent' : number,
}
export interface BeginUploadOutput {
  'total_chunks' : number,
  'session_id' : Uint8Array | number[],
  'generation' : bigint,
  'chunk_size' : number,
  'expires_at' : bigint,
  'file_id' : number,
}
export interface BucketCapabilities {
  'batch_operations' : [] | [boolean],
  'reader_grants' : [] | [boolean],
  'api_version' : number,
  'incremental_gc' : boolean,
  'migration_state' : MigrationState,
  'ensure_folder' : boolean,
  'storage_metrics' : [] | [boolean],
  'conditional_delete' : boolean,
  'unique_names' : boolean,
  'get_entry' : boolean,
  'http_read_modes' : [] | [boolean],
  'storage_version' : number,
  'manifest' : boolean,
  'atomic_commit' : boolean,
  'upload_sessions' : boolean,
}
export interface BucketInfo {
  'status' : number,
  'reader_policy' : [] | [ReaderPolicy],
  'total_chunks' : bigint,
  'trusted_eddsa_pub_keys' : Array<Uint8Array | number[]>,
  'managers' : Array<Principal>,
  'governance_canister' : [] | [Principal],
  'name' : string,
  'max_custom_data_size' : number,
  'auditors' : Array<Principal>,
  'http_read_mode' : [] | [HttpReadMode],
  'total_files' : bigint,
  'max_children' : number,
  'enable_hash_index' : boolean,
  'max_file_size' : bigint,
  'folder_id' : number,
  'visibility' : number,
  'max_folder_depth' : number,
  'trusted_ecdsa_pub_keys' : Array<Uint8Array | number[]>,
  'total_folders' : bigint,
  'file_id' : number,
}
/**
 * Capacity signals reported by the Bucket itself. Stable-memory remaining
 * space is necessarily an estimate: the platform limit is fixed per canister,
 * while successful growth also depends on subnet capacity and cycle reserves.
 */
export interface BucketStorageMetrics {
  'total_memory_size' : bigint,
  'stable_memory_size' : bigint,
  /**
   * Spendable cycles currently held by the Bucket.
   */
  'cycles' : [] | [bigint],
  'stable_memory_limit' : bigint,
  'wasm_memory_size' : bigint,
  'memory_allocation' : bigint,
  /**
   * Cycles reserved by the subnet for future storage payments.
   */
  'reserved_cycles' : [] | [bigint],
}
export type CanisterArgs = { 'Upgrade' : UpgradeArgs } |
  { 'Init' : InitArgs };
/**
 * # Canister Status Result
 *
 * Result type of [`canister_status`](https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-canister_status).
 */
export interface CanisterStatusResult {
  /**
   * The detailed metrics on the memory consumption of the canister.
   */
  'memory_metrics' : MemoryMetrics,
  /**
   * Status of the canister.
   */
  'status' : CanisterStatusType,
  /**
   * The memory size taken by the canister.
   */
  'memory_size' : bigint,
  /**
   * Indicates whether a stopped canister is ready to be migrated to another subnet
   * (i.e., whether it has empty queues and flushed streams).
   */
  'ready_for_migration' : boolean,
  /**
   * The canister version.
   */
  'version' : bigint,
  /**
   * The cycle balance of the canister.
   */
  'cycles' : bigint,
  /**
   * Canister settings in effect.
   */
  'settings' : DefiniteCanisterSettings,
  /**
   * Query statistics.
   */
  'query_stats' : QueryStats,
  /**
   * Amount of cycles burned per day.
   */
  'idle_cycles_burned_per_day' : bigint,
  /**
   * A SHA256 hash of the module installed on the canister. This is null if the canister is empty.
   */
  'module_hash' : [] | [Uint8Array | number[]],
  /**
   * The reserved cycles balance of the canister.
   *
   * These are cycles that are reserved by the resource reservation mechanism on storage allocation.
   * See also the [`CanisterSettings::reserved_cycles_limit`] parameter in canister settings.
   */
  'reserved_cycles' : bigint,
}
/**
 * # Canister Status Type
 *
 * Status of a canister.
 *
 * See [`CanisterStatusResult::status`].
 */
export type CanisterStatusType = {
    /**
     * The canister is stopped.
     */
    'stopped' : null
  } |
  {
    /**
     * The canister is stopping.
     */
    'stopping' : null
  } |
  {
    /**
     * The canister is running.
     */
    'running' : null
  };
export interface CollectGarbageInput {
  /**
   * Maximum number of chunk slots to process in this call.
   */
  'max_chunks' : [] | [number],
}
export interface CollectGarbageOutput {
  'removed_chunks' : number,
  'remaining_items' : bigint,
  'processed_chunks' : number,
  'completed_items' : number,
  'remaining_chunks' : bigint,
}
export interface CommitUploadOutput {
  'id' : number,
  'created' : boolean,
  'committed_at' : bigint,
  'generation' : bigint,
  'revision' : bigint,
}
export interface CreateFileInput {
  'dek' : [] | [Uint8Array | number[]],
  'status' : [] | [number],
  'content' : [] | [Uint8Array | number[]],
  'custom' : [] | [Array<[string, MetadataValue]>],
  'hash' : [] | [Uint8Array | number[]],
  'name' : string,
  'size' : [] | [bigint],
  'content_type' : string,
  'parent' : number,
}
export interface CreateFileOutput { 'id' : number, 'created_at' : bigint }
export interface CreateFolderInput { 'name' : string, 'parent' : number }
/**
 * # Definite Canister Settings
 *
 * Represents the actual settings in effect.
 *
 * For return of [`canister_status`](https://internetcomputer.org/docs/current/references/ic-interface-spec/#ic-canister_status).
 */
export interface DefiniteCanisterSettings {
  /**
   * Time in seconds after which the canister is considered frozen.
   */
  'freezing_threshold' : bigint,
  /**
   * Threshold on the remaining wasm memory size of the canister in bytes.
   */
  'wasm_memory_threshold' : bigint,
  /**
   * A list of environment variables.
   */
  'environment_variables' : Array<EnvironmentVariable>,
  /**
   * Controllers of the canister.
   */
  'controllers' : Array<Principal>,
  /**
   * Upper limit on [`CanisterStatusResult::reserved_cycles`] of the canister.
   */
  'reserved_cycles_limit' : bigint,
  /**
   * Visibility of canister logs.
   */
  'log_visibility' : LogVisibility,
  /**
   * Upper limit on the memory used for canister logs (bytes).
   */
  'log_memory_limit' : bigint,
  /**
   * Upper limit on the WASM heap memory (bytes) consumption of the canister.
   */
  'wasm_memory_limit' : bigint,
  /**
   * Total memory (bytes) the canister is allowed to use.
   */
  'memory_allocation' : bigint,
  /**
   * Guaranteed compute allocation as a percentage of the maximum compute power that a single canister can allocate.
   */
  'compute_allocation' : bigint,
}
export interface DeleteEntryIfInput {
  'id' : number,
  'request_id' : Uint8Array | number[],
  'kind' : EntryKind,
  'expected_parent' : number,
  'expected_hash' : [] | [Uint8Array | number[]],
  'expected_revision' : bigint,
}
export interface DirectoryStorageHealth {
  'migration_error' : [] | [string],
  'stable_folders' : bigint,
  'duplicate_names' : bigint,
  'legacy_folders' : bigint,
  'stable_names' : bigint,
  'stable_children' : bigint,
  'dangling_entries' : bigint,
}
export interface DomainConfig {
  'derivation_origin' : string,
  'custom_domains' : Array<string>,
  'canister_id' : Principal,
}
export interface EnsureFolderInput {
  'request_id' : Uint8Array | number[],
  'name' : string,
  'parent' : number,
}
export interface EnsureFolderOutput {
  'id' : number,
  'created' : boolean,
  'created_at' : bigint,
  'revision' : bigint,
}
export interface EntryCursor {
  'id' : number,
  'kind' : EntryKind,
  'parent_revision' : bigint,
}
export interface EntryInfoV2 {
  'id' : number,
  'status' : number,
  'updated_at' : bigint,
  'hash' : [] | [Uint8Array | number[]],
  'kind' : EntryKind,
  'name' : string,
  'size' : [] | [bigint],
  'content_type' : [] | [string],
  'created_at' : bigint,
  'filled' : [] | [bigint],
  'revision' : bigint,
  'parent' : number,
}
export type EntryKind = { 'Folder' : null } |
  { 'File' : null };
export interface EntryRef { 'id' : number, 'kind' : EntryKind }
/**
 * # Environment Variable.
 */
export interface EnvironmentVariable {
  /**
   * Value of the environment variable.
   */
  'value' : string,
  /**
   * Name of the environment variable.
   */
  'name' : string,
}
/**
 * The immutable media-read metadata exposed to an authorized reader.
 *
 * It intentionally excludes upload/admin fields such as the parent directory,
 * custom metadata and encrypted data key.  Clients must pass `generation` to
 * every protected byte-read call so a replacement cannot mix old and new
 * content in one media stream.
 */
export interface FileDescriptor {
  'id' : number,
  'hash' : [] | [Uint8Array | number[]],
  'size' : bigint,
  'generation' : bigint,
  'content_type' : string,
  'chunks' : number,
  'chunk_size' : number,
}
export interface FileInfo {
  'ex' : [] | [Array<[string, MetadataValue]>],
  'id' : number,
  'dek' : [] | [Uint8Array | number[]],
  'status' : number,
  'updated_at' : bigint,
  'custom' : [] | [Array<[string, MetadataValue]>],
  'hash' : [] | [Uint8Array | number[]],
  'name' : string,
  'size' : bigint,
  'generation' : bigint,
  'content_type' : string,
  'created_at' : bigint,
  'filled' : bigint,
  'chunks' : number,
  'revision' : bigint,
  'parent' : number,
}
export interface FolderInfo {
  'id' : number,
  'files' : Uint32Array | number[],
  'status' : number,
  'updated_at' : bigint,
  'name' : string,
  'folders' : Uint32Array | number[],
  'created_at' : bigint,
  'revision' : bigint,
  'parent' : number,
}
export interface FolderName { 'id' : number, 'name' : string }
export interface GcHealth {
  'pending_chunks' : bigint,
  'pending_items' : bigint,
  'oldest_enqueued_at' : [] | [bigint],
}
export interface GetEntryInput { 'name' : string, 'parent' : number }
export interface GetUploadStatusInput {
  'session_id' : Uint8Array | number[],
  'take' : [] | [number],
  'start' : [] | [number],
}
export type HttpReadMode = { 'TokenProtected' : null } |
  { 'Disabled' : null } |
  { 'Public' : null } |
  { 'Legacy' : null };
export interface InitArgs {
  'governance_canister' : [] | [Principal],
  'name' : string,
  'max_custom_data_size' : number,
  'max_children' : number,
  'enable_hash_index' : boolean,
  'max_file_size' : bigint,
  'visibility' : number,
  'max_folder_depth' : number,
  'file_id' : number,
}
export interface ListEntriesInput {
  'cursor' : [] | [EntryCursor],
  'take' : [] | [number],
  'parent' : number,
}
export interface ListEntriesOutput {
  'next' : [] | [EntryCursor],
  'entries' : Array<EntryInfoV2>,
  'parent_revision' : bigint,
}
/**
 * # Log Visibility.
 */
export type LogVisibility = {
    /**
     * Controllers.
     */
    'controllers' : null
  } |
  {
    /**
     * Public.
     */
    'public' : null
  } |
  {
    /**
     * Allowed viewers.
     */
    'allowed_viewers' : Array<Principal>
  };
export interface ManifestEntry { 'path' : string, 'entry' : EntryInfoV2 }
export interface ManifestFrame {
  'after' : [] | [EntryRef],
  'path' : string,
  'folder_id' : number,
}
/**
 * # Memory Metrics
 *
 * Memory metrics of a canister.
 *
 * See [`CanisterStatusResult::memory_metrics`].
 */
export interface MemoryMetrics {
  /**
   * Represents the memory occupied by the Wasm binary that is currently installed on the canister.
   */
  'wasm_binary_size' : bigint,
  /**
   * Represents the memory used by the canister's log store.
   */
  'log_memory_store_size' : bigint,
  /**
   * Represents the memory used by the Wasm chunk store of the canister.
   */
  'wasm_chunk_store_size' : bigint,
  /**
   * Represents the memory used for storing the canister's history.
   */
  'canister_history_size' : bigint,
  /**
   * Represents the stable memory usage of the canister.
   */
  'stable_memory_size' : bigint,
  /**
   * Represents the memory consumed by all snapshots that belong to this canister.
   */
  'snapshots_size' : bigint,
  /**
   * Represents the Wasm memory usage of the canister, i.e. the heap memory used by the canister's WebAssembly code.
   */
  'wasm_memory_size' : bigint,
  /**
   * Represents the memory usage of the global variables that the canister is using.
   */
  'global_memory_size' : bigint,
  /**
   * Represents the memory used by custom sections defined by the canister.
   */
  'custom_sections_size' : bigint,
}
/**
 * Variant type for the `icrc1_metadata` endpoint values. The corresponding metadata keys are
 * arbitrary Unicode strings and must follow the pattern `<namespace>:<key>`, where `<namespace>`
 * is a string not containing colons. The namespace `icrc1` is reserved for keys defined in the
 * ICRC-1 standard. For more information, see the
 * [documentation of Metadata in the ICRC-1 standard](https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1#metadata).
 * Note that the `MetadataValue` type is a subset of the [`icrc_ledger_types::icrc::generic_value::ICRC3Value`] type.
 */
export type MetadataValue = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface MigrateDirectoryStorageInput { 'max_items' : [] | [number] }
export interface MigrateDirectoryStorageOutput {
  'folder_cursor' : [] | [number],
  'error' : [] | [string],
  'file_cursor' : [] | [number],
  'state' : MigrationState,
  'processed' : number,
}
export type MigrationState = { 'Failed' : null } |
  { 'Migrating' : null } |
  { 'Ready' : null } |
  { 'Legacy' : null };
export interface MoveInput { 'id' : number, 'to' : number, 'from' : number }
export interface OAuthAccount {
  'key' : string,
  'status' : OAuthAccountStatus,
  'provider' : OAuthProvider,
  'avatar_url' : string,
  'reviewed_at' : [] | [bigint],
  'reviewed_by' : [] | [Principal],
  'email' : string,
  'requested_at' : bigint,
  'display_name' : string,
  'last_login_at' : bigint,
}
export type OAuthAccountStatus = { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export interface OAuthBeginInput {
  'provider' : OAuthProvider,
  'redirect_uri' : string,
}
export interface OAuthBeginOutput { 'authorization_url' : string }
export interface OAuthCompleteInput { 'code' : string, 'state' : string }
export type OAuthCompleteOutput = {
    'Approved' : { 'token' : Uint8Array | number[], 'account' : OAuthAccount }
  } |
  { 'Rejected' : OAuthAccount } |
  { 'Pending' : OAuthAccount };
export interface OAuthConfigInput {
  'redirect_uris' : Array<string>,
  'google' : [] | [OAuthProviderConfigInput],
  'schnorr_key_name' : string,
  'session_ttl_seconds' : bigint,
  'wechat' : [] | [OAuthProviderConfigInput],
}
export type OAuthProvider = { 'Wechat' : null } |
  { 'Google' : null };
export interface OAuthProviderConfigInput {
  'client_id' : string,
  'client_secret' : string,
}
export interface OAuthProviderPublicConfig { 'client_id' : string }
export interface OAuthPublicConfig {
  'redirect_uris' : Array<string>,
  'google' : [] | [OAuthProviderPublicConfig],
  'wechat' : [] | [OAuthProviderPublicConfig],
}
export interface OAuthReviewInput {
  'key' : string,
  'status' : OAuthAccountStatus,
}
/**
 * # Query Stats
 *
 * Query statistics.
 *
 * See [`CanisterStatusResult::query_stats`].
 */
export interface QueryStats {
  /**
   * Total number of payload bytes use for query call responses.
   */
  'response_payload_bytes_total' : bigint,
  /**
   * Total number of instructions executed by query calls.
   */
  'num_instructions_total' : bigint,
  /**
   * Total number of query calls.
   */
  'num_calls_total' : bigint,
  /**
   * Total number of payload bytes use for query call requests.
   */
  'request_payload_bytes_total' : bigint,
}
export interface ReadFileChunkInput {
  'generation' : bigint,
  'index' : number,
  'file_id' : number,
}
export interface ReadFileRangeInput {
  'generation' : bigint,
  'offset' : bigint,
  'length' : bigint,
  'file_id' : number,
}
export interface ReaderGrant {
  'status' : ReaderGrantStatus,
  'subject' : Principal,
  'updated_at_ms' : bigint,
  'granted_by' : Principal,
  'entitlement_version' : bigint,
  'expires_at_ms' : [] | [bigint],
}
export type ReaderGrantError = { 'InvalidExpiry' : null } |
  { 'InvalidInput' : string } |
  { 'AnonymousNotAllowed' : null } |
  { 'VersionConflict' : { 'current_version' : bigint } } |
  { 'StaleVersion' : { 'current_version' : bigint } } |
  { 'TooManyItems' : { 'max' : number } } |
  { 'Unauthorized' : null };
export interface ReaderGrantSpec {
  'subject' : Principal,
  'entitlement_version' : bigint,
  'expires_at_ms' : [] | [bigint],
}
export type ReaderGrantStatus = { 'Active' : null } |
  { 'Revoked' : null };
export interface ReaderPolicy {
  'allow_by_hash' : boolean,
  'enabled' : boolean,
  'authority' : [] | [Principal],
}
export interface RenewUploadOutput { 'expires_at' : bigint }
export interface ReplaceFileInput {
  'id' : number,
  'expected_revision' : bigint,
}
export type Result = { 'Ok' : boolean } |
  { 'Err' : SyncError };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : BatchEnsureFoldersOutput } |
  { 'Err' : SyncError };
export type Result_11 = { 'Ok' : BeginUploadOutput } |
  { 'Err' : SyncError };
export type Result_12 = { 'Ok' : CollectGarbageOutput } |
  { 'Err' : SyncError };
export type Result_13 = { 'Ok' : CommitUploadOutput } |
  { 'Err' : SyncError };
export type Result_14 = { 'Ok' : CreateFileOutput } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : BucketInfo } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : CanisterStatusResult } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : DirectoryStorageHealth } |
  { 'Err' : SyncError };
export type Result_19 = { 'Ok' : [] | [EntryInfoV2] } |
  { 'Err' : SyncError };
export type Result_2 = { 'Ok' : ReaderGrant } |
  { 'Err' : ReaderGrantError };
export type Result_20 = { 'Ok' : Array<FolderName> } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : Array<[number, Uint8Array | number[]]> } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : FileDescriptor } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : FileInfo } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : FolderInfo } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : GcHealth } |
  { 'Err' : SyncError };
export type Result_26 = { 'Ok' : [] | [ReaderGrant] } |
  { 'Err' : ReaderGrantError };
export type Result_27 = { 'Ok' : BucketStorageMetrics } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : SubtreeManifestOutput } |
  { 'Err' : SyncError };
export type Result_29 = { 'Ok' : UploadHealth } |
  { 'Err' : SyncError };
export type Result_3 = { 'Ok' : BatchUpsertReaderGrantsOutput } |
  { 'Err' : ReaderGrantError };
export type Result_30 = { 'Ok' : UploadStatusOutput } |
  { 'Err' : SyncError };
export type Result_31 = { 'Ok' : ListEntriesOutput } |
  { 'Err' : SyncError };
export type Result_32 = { 'Ok' : Array<FileInfo> } |
  { 'Err' : string };
export type Result_33 = { 'Ok' : Array<FolderInfo> } |
  { 'Err' : string };
export type Result_34 = { 'Ok' : UpdateFileOutput } |
  { 'Err' : string };
export type Result_35 = { 'Ok' : OAuthBeginOutput } |
  { 'Err' : string };
export type Result_36 = { 'Ok' : OAuthCompleteOutput } |
  { 'Err' : string };
export type Result_37 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_38 = { 'Ok' : RenewUploadOutput } |
  { 'Err' : SyncError };
export type Result_39 = { 'Ok' : UpdateFileChunkOutput } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : OAuthAccount } |
  { 'Err' : string };
export type Result_40 = { 'Ok' : UploadChunkOutput } |
  { 'Err' : SyncError };
export type Result_41 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : TransferCyclesOutput } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : CreateFileOutput } |
  { 'Err' : SyncError };
export type Result_7 = { 'Ok' : BatchCreateSmallFilesOutput } |
  { 'Err' : SyncError };
export type Result_8 = { 'Ok' : Uint32Array | number[] } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : EnsureFolderOutput } |
  { 'Err' : SyncError };
export interface RevokeReaderGrantInput {
  'request_id' : Uint8Array | number[],
  'subject' : Principal,
  'entitlement_version' : bigint,
}
export interface SubtreeManifestCursor {
  'stack' : Array<ManifestFrame>,
  'revision' : bigint,
}
export interface SubtreeManifestInput {
  'cursor' : [] | [SubtreeManifestCursor],
  'root' : number,
  'take' : [] | [number],
}
export interface SubtreeManifestOutput {
  'next' : [] | [SubtreeManifestCursor],
  'entries' : Array<ManifestEntry>,
  'revision' : bigint,
}
export type SyncError = { 'Internal' : string } |
  { 'InvalidInput' : string } |
  { 'NotFound' : string } |
  { 'PermissionDenied' : string } |
  { 'Unauthorized' : string } |
  { 'LimitExceeded' : string } |
  { 'Conflict' : { 'entries' : Array<EntryRef>, 'message' : string } };
export interface TransferCyclesInput {
  'to_canister' : Principal,
  'amount' : bigint,
}
export interface TransferCyclesOutput {
  'transferred' : bigint,
  'remaining_balance' : bigint,
}
export interface UpdateBucketInput {
  'status' : [] | [number],
  'reader_policy' : [] | [ReaderPolicy],
  'trusted_eddsa_pub_keys' : [] | [Array<Uint8Array | number[]>],
  'name' : [] | [string],
  'max_custom_data_size' : [] | [number],
  'http_read_mode' : [] | [HttpReadMode],
  'max_children' : [] | [number],
  'enable_hash_index' : [] | [boolean],
  'max_file_size' : [] | [bigint],
  'visibility' : [] | [number],
  'max_folder_depth' : [] | [number],
  'trusted_ecdsa_pub_keys' : [] | [Array<Uint8Array | number[]>],
}
export interface UpdateFileChunkInput {
  'id' : number,
  'chunk_index' : number,
  'content' : Uint8Array | number[],
}
export interface UpdateFileChunkOutput {
  'updated_at' : bigint,
  'filled' : bigint,
}
export interface UpdateFileInput {
  'id' : number,
  'status' : [] | [number],
  'custom' : [] | [Array<[string, MetadataValue]>],
  'hash' : [] | [Uint8Array | number[]],
  'name' : [] | [string],
  'size' : [] | [bigint],
  'content_type' : [] | [string],
}
export interface UpdateFileOutput { 'updated_at' : bigint }
export interface UpdateFolderInput {
  'id' : number,
  'status' : [] | [number],
  'name' : [] | [string],
}
export interface UpgradeArgs {
  'governance_canister' : [] | [Principal],
  'max_custom_data_size' : [] | [number],
  'max_children' : [] | [number],
  'enable_hash_index' : [] | [boolean],
  'max_file_size' : [] | [bigint],
  'max_folder_depth' : [] | [number],
}
export interface UploadChunkInput {
  'request_id' : Uint8Array | number[],
  'chunk_index' : number,
  'content' : Uint8Array | number[],
  'session_id' : Uint8Array | number[],
}
export interface UploadChunkOutput {
  'filled' : bigint,
  'expires_at' : bigint,
  'uploaded_chunks' : number,
}
export interface UploadHealth {
  'active_sessions' : bigint,
  'max_active_sessions' : number,
}
export interface UploadStatusOutput {
  'total_chunks' : number,
  'next' : [] | [number],
  'size' : bigint,
  'generation' : bigint,
  'filled' : bigint,
  'ranges' : Array<UploadedChunkRange>,
  'expires_at' : bigint,
  'uploaded_chunks' : number,
  'file_id' : number,
}
export interface UploadedChunkRange {
  /**
   * Inclusive last chunk index.
   */
  'end' : number,
  /**
   * Inclusive first chunk index.
   */
  'start' : number,
}
export interface UpsertReaderGrantInput {
  'request_id' : Uint8Array | number[],
  'subject' : Principal,
  'entitlement_version' : bigint,
  'expires_at_ms' : [] | [bigint],
}
export interface _SERVICE {
  'abort_upload' : ActorMethod<
    [AbortUploadInput, [] | [Uint8Array | number[]]],
    Result
  >,
  'admin_add_auditors' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_add_managers' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_batch_upsert_reader_grants' : ActorMethod<
    [BatchUpsertReaderGrantsInput],
    Result_3
  >,
  'admin_list_oauth_accounts' : ActorMethod<[], Array<OAuthAccount>>,
  'admin_migrate_directory_storage' : ActorMethod<
    [MigrateDirectoryStorageInput],
    MigrateDirectoryStorageOutput
  >,
  'admin_remove_auditors' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_remove_managers' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_retry_directory_migration' : ActorMethod<
    [],
    MigrateDirectoryStorageOutput
  >,
  'admin_review_oauth_account' : ActorMethod<[OAuthReviewInput], Result_4>,
  'admin_revoke_reader_grant' : ActorMethod<[RevokeReaderGrantInput], Result_2>,
  'admin_set_auditors' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_set_custom_domains' : ActorMethod<[Array<string>], Result_1>,
  'admin_set_governance_canister' : ActorMethod<[[] | [Principal]], Result_1>,
  'admin_set_managers' : ActorMethod<[Array<Principal>], Result_1>,
  'admin_set_oauth_config' : ActorMethod<[OAuthConfigInput], Result_1>,
  'admin_set_reader_authority' : ActorMethod<[[] | [Principal]], Result_1>,
  'admin_transfer_cycles' : ActorMethod<[TransferCyclesInput], Result_5>,
  'admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_1>,
  'admin_upsert_reader_grant' : ActorMethod<[UpsertReaderGrantInput], Result_2>,
  'api_version' : ActorMethod<[], number>,
  'batch_create_small_files' : ActorMethod<
    [BatchCreateSmallFilesInput, [] | [Uint8Array | number[]]],
    Result_7
  >,
  'batch_delete_subfiles' : ActorMethod<
    [number, Uint32Array | number[], [] | [Uint8Array | number[]]],
    Result_8
  >,
  'batch_ensure_folders' : ActorMethod<
    [BatchEnsureFoldersInput, [] | [Uint8Array | number[]]],
    Result_10
  >,
  'begin_upload' : ActorMethod<
    [BeginUploadInput, [] | [Uint8Array | number[]]],
    Result_11
  >,
  'collect_garbage' : ActorMethod<
    [CollectGarbageInput, [] | [Uint8Array | number[]]],
    Result_12
  >,
  'commit_upload' : ActorMethod<
    [AbortUploadInput, [] | [Uint8Array | number[]]],
    Result_13
  >,
  'create_file' : ActorMethod<
    [CreateFileInput, [] | [Uint8Array | number[]]],
    Result_14
  >,
  'create_folder' : ActorMethod<
    [CreateFolderInput, [] | [Uint8Array | number[]]],
    Result_14
  >,
  'delete_entry_if' : ActorMethod<
    [DeleteEntryIfInput, [] | [Uint8Array | number[]]],
    Result
  >,
  'delete_file' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_15
  >,
  'delete_folder' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_15
  >,
  'ensure_folder' : ActorMethod<
    [EnsureFolderInput, [] | [Uint8Array | number[]]],
    Result_9
  >,
  'get_bucket_info' : ActorMethod<[[] | [Uint8Array | number[]]], Result_16>,
  'get_canister_status' : ActorMethod<[], Result_17>,
  'get_capabilities' : ActorMethod<[], BucketCapabilities>,
  'get_directory_storage_health' : ActorMethod<
    [[] | [Uint8Array | number[]]],
    Result_18
  >,
  'get_domain_config' : ActorMethod<[], DomainConfig>,
  'get_entry' : ActorMethod<
    [GetEntryInput, [] | [Uint8Array | number[]]],
    Result_19
  >,
  'get_file_ancestors' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_20
  >,
  'get_file_chunks' : ActorMethod<
    [number, number, [] | [number], [] | [Uint8Array | number[]]],
    Result_21
  >,
  /**
   * Returns the media-safe immutable description of a fully committed file.
   * Reader grants are sufficient for this endpoint, but do not expose any
   * directory metadata.
   */
  'get_file_descriptor' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_22
  >,
  'get_file_info' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_23
  >,
  'get_file_info_by_hash' : ActorMethod<
    [Uint8Array | number[], [] | [Uint8Array | number[]]],
    Result_23
  >,
  'get_folder_ancestors' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_20
  >,
  'get_folder_info' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_24
  >,
  'get_gc_health' : ActorMethod<[[] | [Uint8Array | number[]]], Result_25>,
  'get_my_reader_grant' : ActorMethod<[], Result_26>,
  'get_oauth_config' : ActorMethod<[], OAuthPublicConfig>,
  /**
   * Returns the storage-only subset of canister status and accepts the same
   * delegated access token as directory reads. The legacy full status endpoint
   * remains unchanged for existing clients.
   */
  'get_storage_metrics' : ActorMethod<
    [[] | [Uint8Array | number[]]],
    Result_27
  >,
  'get_subtree_manifest' : ActorMethod<
    [SubtreeManifestInput, [] | [Uint8Array | number[]]],
    Result_28
  >,
  'get_upload_health' : ActorMethod<[[] | [Uint8Array | number[]]], Result_29>,
  'get_upload_status' : ActorMethod<
    [GetUploadStatusInput, [] | [Uint8Array | number[]]],
    Result_30
  >,
  'is_caller_controller' : ActorMethod<[], boolean>,
  'list_entries' : ActorMethod<
    [ListEntriesInput, [] | [Uint8Array | number[]]],
    Result_31
  >,
  'list_files' : ActorMethod<
    [number, [] | [number], [] | [number], [] | [Uint8Array | number[]]],
    Result_32
  >,
  'list_folders' : ActorMethod<
    [number, [] | [number], [] | [number], [] | [Uint8Array | number[]]],
    Result_33
  >,
  'move_file' : ActorMethod<
    [MoveInput, [] | [Uint8Array | number[]]],
    Result_34
  >,
  'move_folder' : ActorMethod<
    [MoveInput, [] | [Uint8Array | number[]]],
    Result_34
  >,
  'oauth_begin' : ActorMethod<[OAuthBeginInput], Result_35>,
  'oauth_complete' : ActorMethod<[OAuthCompleteInput], Result_36>,
  /**
   * Reads exactly one chunk from an expected immutable file generation.
   */
  'read_file_chunk' : ActorMethod<
    [ReadFileChunkInput, [] | [Uint8Array | number[]]],
    Result_37
  >,
  /**
   * Reads a bounded byte range from an expected immutable file generation.
   */
  'read_file_range' : ActorMethod<
    [ReadFileRangeInput, [] | [Uint8Array | number[]]],
    Result_37
  >,
  'renew_upload' : ActorMethod<
    [AbortUploadInput, [] | [Uint8Array | number[]]],
    Result_38
  >,
  'update_file_chunk' : ActorMethod<
    [UpdateFileChunkInput, [] | [Uint8Array | number[]]],
    Result_39
  >,
  'update_file_info' : ActorMethod<
    [UpdateFileInput, [] | [Uint8Array | number[]]],
    Result_34
  >,
  'update_folder_info' : ActorMethod<
    [UpdateFolderInput, [] | [Uint8Array | number[]]],
    Result_34
  >,
  'upload_chunk' : ActorMethod<
    [UploadChunkInput, [] | [Uint8Array | number[]]],
    Result_40
  >,
  'validate2_admin_set_auditors' : ActorMethod<[Array<Principal>], Result_41>,
  'validate2_admin_set_custom_domains' : ActorMethod<
    [Array<string>],
    Result_41
  >,
  'validate2_admin_set_managers' : ActorMethod<[Array<Principal>], Result_41>,
  'validate2_admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_41>,
  'validate_admin_add_auditors' : ActorMethod<[Array<Principal>], Result_41>,
  'validate_admin_add_managers' : ActorMethod<[Array<Principal>], Result_41>,
  'validate_admin_remove_auditors' : ActorMethod<[Array<Principal>], Result_41>,
  'validate_admin_remove_managers' : ActorMethod<[Array<Principal>], Result_41>,
  'validate_admin_set_auditors' : ActorMethod<[Array<Principal>], Result_1>,
  'validate_admin_set_custom_domains' : ActorMethod<[Array<string>], Result_1>,
  'validate_admin_set_managers' : ActorMethod<[Array<Principal>], Result_1>,
  'validate_admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_1>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

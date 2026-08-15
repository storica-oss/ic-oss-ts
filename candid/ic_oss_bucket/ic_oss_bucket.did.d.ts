import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AbortUploadInput {
  'request_id' : Uint8Array | number[],
  'session_id' : Uint8Array | number[],
}
export interface ArchiveEncryptionZoneInput {
  'zone_id' : Uint8Array | number[],
  'expected_revision' : bigint,
}
export interface BatchCreateSmallFilesInput {
  'files' : Array<CreateFileInput>,
  'request_id' : Uint8Array | number[],
}
export interface BatchCreateSmallFilesOutput { 'results' : Array<Result_9> }
export interface BatchEnsureFoldersInput {
  'request_id' : Uint8Array | number[],
  'folders' : Array<CreateFolderInput>,
}
export interface BatchEnsureFoldersOutput { 'results' : Array<Result_12> }
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
  'encryption' : [] | [EncryptionInfoV1],
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
  'folder_shares' : [] | [boolean],
  'share_manifest' : [] | [boolean],
  'reader_grants' : [] | [boolean],
  'api_version' : number,
  'bucket_vetkd' : [] | [boolean],
  'encryption_zones' : [] | [boolean],
  'incremental_gc' : boolean,
  'migration_state' : MigrationState,
  'file_favorites' : [] | [boolean],
  'share_messages_v1' : [] | [boolean],
  'encryption_format_version' : [] | [number],
  'ensure_folder' : boolean,
  'storage_metrics' : [] | [boolean],
  'conditional_delete' : boolean,
  'encryption_writes' : [] | [boolean],
  'unique_names' : boolean,
  'market_bottle_inbox' : [] | [boolean],
  'vetkd_derivation' : [] | [boolean],
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
  /**
   * Present on buckets that support isolated public website hosting.
   */
  'website' : [] | [WebsiteConfig],
  'http_read_mode' : [] | [HttpReadMode],
  /**
   * Enables Zone creation and mutations inside Encryption Zones.
   */
  'encryption_writes' : [] | [boolean],
  'total_files' : bigint,
  /**
   * Emergency switch for VetKD derivation. Disabling this also prevents
   * recovery of existing ciphertext and should only be temporary.
   */
  'vetkd_derivation' : [] | [boolean],
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
  'vetkd_cycles_attached' : [] | [bigint],
  'encryption_zones' : [] | [bigint],
  'vetkd_derive_attempts' : [] | [bigint],
  'stable_memory_size' : bigint,
  /**
   * Spendable cycles currently held by the Bucket.
   */
  'cycles' : [] | [bigint],
  'vetkd_derive_in_flight' : [] | [number],
  'vetkd_derive_rejections' : [] | [bigint],
  'stable_memory_limit' : bigint,
  'vetkd_derive_successes' : [] | [bigint],
  'wasm_memory_size' : bigint,
  'memory_allocation' : bigint,
  'vetkd_derive_failures' : [] | [bigint],
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
export interface CollectFolderShareGarbageOutput {
  'remaining_shares' : bigint,
  'remaining_replays' : bigint,
  'removed_shares' : number,
  'removed_replays' : number,
}
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
export interface CollectMarketListingGarbageOutput {
  'removed_tickets' : number,
  'remaining_tickets' : bigint,
}
export interface CollectShareMessageGarbageOutput {
  'remaining_messages' : bigint,
  'removed_messages' : number,
  'remaining_body_bytes' : bigint,
}
export interface CommitUploadOutput {
  'id' : number,
  'created' : boolean,
  'committed_at' : bigint,
  'generation' : bigint,
  'revision' : bigint,
}
export type ConsentError = {
    'GenericError' : { 'description' : string, 'error_code' : bigint }
  } |
  { 'InsufficientPayment' : ConsentErrorInfo } |
  { 'UnsupportedCanisterCall' : ConsentErrorInfo } |
  { 'ConsentMessageUnavailable' : ConsentErrorInfo };
export interface ConsentErrorInfo { 'description' : string }
export interface ConsentInfo {
  'metadata' : ConsentMessageMetadata,
  'consent_message' : ConsentMessage,
}
export type ConsentMessage = {
    'FieldsDisplayMessage' : {
      'fields' : Array<[string, ConsentValue]>,
      'intent' : string,
    }
  } |
  { 'GenericDisplayMessage' : string };
export type ConsentMessageDeviceSpec = { 'GenericDisplay' : null } |
  { 'FieldsDisplay' : null };
export interface ConsentMessageMetadata {
  'utc_offset_minutes' : [] | [number],
  'language' : string,
}
export interface ConsentMessageRequest {
  'arg' : Uint8Array | number[],
  'method' : string,
  'user_preferences' : ConsentMessageSpec,
}
export type ConsentMessageResponse = { 'Ok' : ConsentInfo } |
  { 'Err' : ConsentError };
export interface ConsentMessageSpec {
  'metadata' : ConsentMessageMetadata,
  'device_spec' : [] | [ConsentMessageDeviceSpec],
}
export type ConsentValue = { 'Text' : TextValue } |
  { 'TokenAmount' : TokenAmount } |
  { 'TimestampSeconds' : DurationSeconds } |
  { 'DurationSeconds' : DurationSeconds };
export interface ConsumeMarketListingTicketInput {
  'request_id' : Uint8Array | number[],
  'ticket' : Uint8Array | number[],
  'credential' : FolderShareCredential,
  'bottle_id' : bigint,
  'publisher' : Principal,
}
export interface ConsumedMarketListing {
  'share_revision' : bigint,
  'listing_manifest_revision' : bigint,
  'bottle_id' : bigint,
  'share_id' : Uint8Array | number[],
  'publisher' : Principal,
  'channel_revision' : bigint,
  'market' : Principal,
  'bucket' : Principal,
  'share_title' : string,
  'share_expires_at_ms' : bigint,
}
export type ContentCipher = { 'XChaCha20Poly1305' : null };
export type ContentSafetyMode = { 'Required' : null } |
  { 'RuleOnly' : null };
export interface ContentSafetyPublicKey {
  'public_key' : Uint8Array | number[],
  'key_id' : string,
  'not_before_ms' : bigint,
  'expires_at_ms' : bigint,
}
export interface ContentSafetyVerifierConfig {
  'text_policy_version' : string,
  'clock_skew_ms' : bigint,
  'max_attestation_ttl_ms' : bigint,
  'keys' : Array<ContentSafetyPublicKey>,
  'mode' : ContentSafetyMode,
  'policy_version' : string,
}
export interface CreateEncryptionZoneInput {
  'request_id' : Uint8Array | number[],
  'root_folder_id' : number,
  'zone_id' : Uint8Array | number[],
  'parent_zone_id' : [] | [Uint8Array | number[]],
}
export interface CreateFileInput {
  'dek' : [] | [Uint8Array | number[]],
  'status' : [] | [number],
  'content' : [] | [Uint8Array | number[]],
  'custom' : [] | [Array<[string, MetadataValue]>],
  'hash' : [] | [Uint8Array | number[]],
  'name' : string,
  'size' : [] | [bigint],
  'encryption' : [] | [EncryptionInfoV1],
  'content_type' : string,
  'parent' : number,
}
export interface CreateFileOutput { 'id' : number, 'created_at' : bigint }
export interface CreateFolderInput { 'name' : string, 'parent' : number }
export interface CreateFolderShareInput {
  'request_id' : Uint8Array | number[],
  'access' : ShareAccessMode,
  'title' : string,
  'share_id' : Uint8Array | number[],
  'root_folder' : number,
  'secret_hash' : Uint8Array | number[],
  /**
   * Opaque, canister-scoped hash of an optional human-friendly share code.
   * The plaintext code is never persisted by the canister.
   */
  'share_code_hash' : [] | [Uint8Array | number[]],
  'expires_at_ms' : bigint,
}
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
export interface DeriveZoneKeyInput {
  'expected_key_version' : number,
  'zone_id' : Uint8Array | number[],
  'transport_public_key' : Uint8Array | number[],
}
export interface DerivedZoneKey {
  'encrypted_key' : Uint8Array | number[],
  'provider' : KeyProviderRef,
  'key_version' : number,
  'public_key' : Uint8Array | number[],
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
export interface DurationSeconds { 'amount' : bigint }
export interface EncryptionInfoV1 {
  'nonce_prefix' : Uint8Array | number[],
  'plaintext_size' : bigint,
  'envelope' : FileKeyEnvelopeV1,
  'object_id' : Uint8Array | number[],
  'cipher' : ContentCipher,
  'version' : number,
  'plaintext_chunk_size' : number,
  'zone_id' : Uint8Array | number[],
}
export interface EncryptionProfile {
  'updated_at' : bigint,
  'root_zone_id' : [] | [Uint8Array | number[]],
  'created_at' : bigint,
  'enabled' : boolean,
}
export interface EncryptionZone {
  'root_folder_id' : number,
  'updated_at' : bigint,
  'key_envelopes' : Array<ZoneKeyEnvelopeV1>,
  'owner' : Principal,
  'created_at' : bigint,
  'state' : EncryptionZoneState,
  'zone_id' : Uint8Array | number[],
  'revision' : bigint,
  'active_envelope' : [] | [number],
  'parent_zone_id' : [] | [Uint8Array | number[]],
  'policy' : KeyPolicy,
}
export type EncryptionZoneState = { 'PendingInitialization' : null } |
  { 'Active' : null } |
  { 'Archived' : null };
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
/**
 * A Bucket keeps a bounded, per-principal set of file favorites. The entry is
 * optional so a user can still see and remove a favorite after the underlying
 * file was deleted or their read permission changed.
 */
export interface FileFavorite {
  'entry' : [] | [EntryInfoV2],
  'favorited_at_ms' : bigint,
  'file_id' : number,
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
  'encryption' : [] | [EncryptionInfoV1],
  'content_type' : string,
  'created_at' : bigint,
  'filled' : bigint,
  'chunks' : number,
  'revision' : bigint,
  'parent' : number,
}
export interface FileKeyEnvelopeV1 {
  'cipher' : ContentCipher,
  'aad_hash' : Uint8Array | number[],
  'version' : number,
  'nonce' : Uint8Array | number[],
  'wrapped_dek' : Uint8Array | number[],
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
export interface FolderShare {
  'status' : FolderShareStatus,
  'access' : ShareAccessMode,
  'title' : string,
  'share_id' : Uint8Array | number[],
  'updated_at_ms' : bigint,
  'created_by' : Principal,
  'created_at_ms' : bigint,
  'root_folder' : number,
  'revision' : bigint,
  'revoked_at_ms' : [] | [bigint],
  'expires_at_ms' : bigint,
}
export interface FolderShareCredential {
  'share_id' : Uint8Array | number[],
  'secret' : Uint8Array | number[],
}
export type FolderShareError = { 'Internal' : string } |
  { 'InvalidInput' : string } |
  { 'EncryptedZone' : null } |
  { 'NotFound' : null } |
  { 'Unavailable' : null } |
  { 'LimitExceeded' : string } |
  { 'RangeOutOfBounds' : string } |
  { 'Conflict' : string };
export type FolderShareStatus = { 'Active' : null } |
  { 'Revoked' : null } |
  { 'Expired' : null };
export interface FolderShareView {
  'access' : ShareAccessMode,
  'title' : string,
  'share_id' : Uint8Array | number[],
  'root_folder' : number,
  'revision' : bigint,
  'expires_at_ms' : bigint,
}
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
  'encryption_writes' : [] | [boolean],
  'vetkd_derivation' : [] | [boolean],
  'max_children' : number,
  'enable_hash_index' : boolean,
  'max_file_size' : bigint,
  'visibility' : number,
  'max_folder_depth' : number,
  'file_id' : number,
}
export interface InitializeEncryptionZoneKeyInput {
  'envelope' : ZoneKeyEnvelopeV1,
  'zone_id' : Uint8Array | number[],
  'expected_revision' : bigint,
}
export interface IssueMarketListingTicketInput {
  'request_id' : Uint8Array | number[],
  'market_request_id' : Uint8Array | number[],
  'share_id' : Uint8Array | number[],
  'market' : Principal,
  'expected_share_revision' : bigint,
}
export type KeyPolicy = { 'VaultManaged' : null } |
  { 'OwnerOnly' : null };
export type KeyProviderRef = { 'BucketVetkd' : { 'bucket' : Principal } } |
  {
    'VaultVetkd' : {
      'vault' : Principal,
      'vault_id' : Uint8Array | number[],
      'key_ref' : Uint8Array | number[],
    }
  };
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
export interface ListFileFavoritesInput {
  'cursor' : [] | [number],
  'take' : [] | [number],
}
export interface ListFileFavoritesOutput {
  'favorites' : Array<FileFavorite>,
  'next' : [] | [number],
}
export interface ListFolderSharesInput {
  'cursor' : [] | [Uint8Array | number[]],
  'take' : [] | [number],
  'include_inactive' : [] | [boolean],
}
export interface ListFolderSharesOutput {
  'shares' : Array<FolderShare>,
  'next' : [] | [Uint8Array | number[]],
}
export interface ListShareMessagesInput {
  'include_deleted' : [] | [boolean],
  'cursor' : [] | [ShareMessageCursor],
  'origin' : [] | [ShareMessageOriginKind],
  'take' : [] | [number],
}
export interface ListShareMessagesOutput {
  'messages' : Array<OssShareMessage>,
  'next' : [] | [ShareMessageCursor],
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
export interface LookupFolderShareCodeInput {
  'code_hash' : Uint8Array | number[],
}
export interface LookupFolderShareCodeOutput {
  'share_id' : Uint8Array | number[],
}
export interface ManifestEntry { 'path' : string, 'entry' : EntryInfoV2 }
export interface ManifestFrame {
  'after' : [] | [EntryRef],
  'path' : string,
  'folder_id' : number,
}
export type MarketListingError = { 'Internal' : string } |
  { 'AlreadyConsumed' : null } |
  { 'InvalidInput' : string } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'Unavailable' : null } |
  { 'LimitExceeded' : string } |
  { 'Expired' : null } |
  { 'Conflict' : string };
export interface MarketListingTicketView {
  'share_revision' : bigint,
  'market_request_id' : Uint8Array | number[],
  'ticket' : Uint8Array | number[],
  'share_id' : Uint8Array | number[],
  'publisher' : Principal,
  'market' : Principal,
  'expires_at_ms' : bigint,
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
export interface OssShareMessage {
  'key' : ShareMessageKey,
  'reported_at_ms' : [] | [bigint],
  'report_reason' : [] | [string],
  'body' : [] | [string],
  'origin' : ShareMessageOriginView,
  'sender' : Principal,
  'created_at_ms' : bigint,
  'sender_alias' : string,
  'body_sha256' : Uint8Array | number[],
  'moderation_policy_version' : string,
  'retracted_at_ms' : [] | [bigint],
  'deleted_at_ms' : [] | [bigint],
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
export interface ReportShareMessageInput {
  'key' : ShareMessageKey,
  'request_id' : Uint8Array | number[],
  'reason' : string,
}
export interface ResolveFolderShareInput {
  'credential' : FolderShareCredential,
}
export interface ResolveFolderShareOutput {
  'root' : SharedFolderInfo,
  /**
   * Visitor-visible projection only; channel metadata remains private.
   */
  'messages_enabled' : boolean,
  'share' : FolderShareView,
}
export interface ResolvedEncryptionZone {
  'zone' : [] | [EncryptionZone],
  'folder_id' : number,
}
export type Result = { 'Ok' : boolean } |
  { 'Err' : SyncError };
export type Result_1 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : BatchCreateSmallFilesOutput } |
  { 'Err' : SyncError };
export type Result_11 = { 'Ok' : Uint32Array | number[] } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : EnsureFolderOutput } |
  { 'Err' : SyncError };
export type Result_13 = { 'Ok' : BatchEnsureFoldersOutput } |
  { 'Err' : SyncError };
export type Result_14 = { 'Ok' : BeginUploadOutput } |
  { 'Err' : SyncError };
export type Result_15 = { 'Ok' : CollectGarbageOutput } |
  { 'Err' : SyncError };
export type Result_16 = { 'Ok' : CommitUploadOutput } |
  { 'Err' : SyncError };
export type Result_17 = { 'Ok' : ConsumedMarketListing } |
  { 'Err' : MarketListingError };
export type Result_18 = { 'Ok' : CreateFileOutput } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : FolderShare } |
  { 'Err' : FolderShareError };
export type Result_2 = { 'Ok' : ReaderGrant } |
  { 'Err' : ReaderGrantError };
export type Result_20 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : OssShareMessage } |
  { 'Err' : ShareMessageError };
export type Result_22 = { 'Ok' : DerivedZoneKey } |
  { 'Err' : SyncError };
export type Result_23 = { 'Ok' : BucketInfo } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : CanisterStatusResult } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : DirectoryStorageHealth } |
  { 'Err' : SyncError };
export type Result_26 = { 'Ok' : [] | [EntryInfoV2] } |
  { 'Err' : SyncError };
export type Result_27 = { 'Ok' : Array<FolderName> } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : Array<[number, Uint8Array | number[]]> } |
  { 'Err' : string };
export type Result_29 = { 'Ok' : FileDescriptor } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : BatchUpsertReaderGrantsOutput } |
  { 'Err' : ReaderGrantError };
export type Result_30 = { 'Ok' : FileInfo } |
  { 'Err' : string };
export type Result_31 = { 'Ok' : FolderInfo } |
  { 'Err' : string };
export type Result_32 = { 'Ok' : ShareMessageChannel } |
  { 'Err' : ShareMessageError };
export type Result_33 = { 'Ok' : GcHealth } |
  { 'Err' : SyncError };
export type Result_34 = { 'Ok' : MarketListingTicketView } |
  { 'Err' : MarketListingError };
export type Result_35 = { 'Ok' : [] | [EncryptionProfile] } |
  { 'Err' : SyncError };
export type Result_36 = { 'Ok' : [] | [ReaderGrant] } |
  { 'Err' : ReaderGrantError };
export type Result_37 = { 'Ok' : BucketStorageMetrics } |
  { 'Err' : string };
export type Result_38 = { 'Ok' : SubtreeManifestOutput } |
  { 'Err' : SyncError };
export type Result_39 = { 'Ok' : UploadHealth } |
  { 'Err' : SyncError };
export type Result_4 = { 'Ok' : OAuthAccount } |
  { 'Err' : string };
export type Result_40 = { 'Ok' : UploadStatusOutput } |
  { 'Err' : SyncError };
export type Result_41 = { 'Ok' : ListEntriesOutput } |
  { 'Err' : SyncError };
export type Result_42 = { 'Ok' : ListFileFavoritesOutput } |
  { 'Err' : string };
export type Result_43 = { 'Ok' : Array<FileInfo> } |
  { 'Err' : string };
export type Result_44 = { 'Ok' : Array<FolderInfo> } |
  { 'Err' : string };
export type Result_45 = { 'Ok' : LookupFolderShareCodeOutput } |
  { 'Err' : FolderShareError };
export type Result_46 = { 'Ok' : UpdateFileOutput } |
  { 'Err' : string };
export type Result_47 = { 'Ok' : OAuthBeginOutput } |
  { 'Err' : string };
export type Result_48 = { 'Ok' : OAuthCompleteOutput } |
  { 'Err' : string };
export type Result_49 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : WebsiteConfig } |
  { 'Err' : string };
export type Result_50 = { 'Ok' : RenewUploadOutput } |
  { 'Err' : SyncError };
export type Result_51 = { 'Ok' : [] | [EncryptionZone] } |
  { 'Err' : SyncError };
export type Result_52 = { 'Ok' : Array<ResolvedEncryptionZone> } |
  { 'Err' : SyncError };
export type Result_53 = { 'Ok' : ResolveFolderShareOutput } |
  { 'Err' : FolderShareError };
export type Result_54 = { 'Ok' : ShareMessageChannel } |
  { 'Err' : MarketListingError };
export type Result_55 = { 'Ok' : boolean } |
  { 'Err' : ShareMessageError };
export type Result_56 = { 'Ok' : FileDescriptor } |
  { 'Err' : FolderShareError };
export type Result_57 = { 'Ok' : ShareListEntriesOutput } |
  { 'Err' : FolderShareError };
export type Result_58 = { 'Ok' : Uint8Array | number[] } |
  { 'Err' : FolderShareError };
export type Result_59 = { 'Ok' : ShareSubtreeManifestOutput } |
  { 'Err' : FolderShareError };
export type Result_6 = { 'Ok' : TransferCyclesOutput } |
  { 'Err' : string };
export type Result_60 = { 'Ok' : UpdateFileChunkOutput } |
  { 'Err' : string };
export type Result_61 = { 'Ok' : UploadChunkOutput } |
  { 'Err' : SyncError };
export type Result_62 = { 'Ok' : string } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : [] | [ContentSafetyVerifierConfig] } |
  { 'Err' : ShareMessageError };
export type Result_8 = { 'Ok' : EncryptionZone } |
  { 'Err' : SyncError };
export type Result_9 = { 'Ok' : CreateFileOutput } |
  { 'Err' : SyncError };
export interface RetryShareMessageConfirmationsOutput {
  'attempted' : number,
  'remaining' : bigint,
  'confirmed' : number,
}
export interface RevokeFolderShareInput {
  'request_id' : Uint8Array | number[],
  'share_id' : Uint8Array | number[],
  'expected_revision' : [] | [bigint],
}
export interface RevokeReaderGrantInput {
  'request_id' : Uint8Array | number[],
  'subject' : Principal,
  'entitlement_version' : bigint,
}
export interface RotateFolderShareSecretInput {
  'request_id' : Uint8Array | number[],
  'share_id' : Uint8Array | number[],
  'secret_hash' : Uint8Array | number[],
  'expected_revision' : [] | [bigint],
  /**
   * Replaces the previous short-code index. `None` disables short-code
   * lookup for this share after rotation.
   */
  'share_code_hash' : [] | [Uint8Array | number[]],
}
export interface SetDriftBottleChannelInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'publisher' : Principal,
  'expected_channel_revision' : bigint,
  'enabled' : boolean,
}
export interface SetFileFavoriteInput {
  'favorite' : boolean,
  'file_id' : number,
}
export interface SetFolderShareMessagesInput {
  'request_id' : Uint8Array | number[],
  'share_id' : Uint8Array | number[],
  'expected_channel_revision' : [] | [bigint],
  'enabled' : boolean,
}
export interface SetShareMessageSenderBlockInput {
  'request_id' : Uint8Array | number[],
  'blocked' : boolean,
  'sender' : Principal,
}
export interface SetWebsiteConfigInput {
  'root_name' : [] | [string],
  'enabled' : boolean,
}
export type ShareAccessMode = { 'Authenticated' : null } |
  { 'AnyoneWithLink' : null } |
  { 'Principals' : Array<Principal> };
export interface ShareFileInput {
  'credential' : FolderShareCredential,
  'file_id' : number,
}
export interface ShareListEntriesInput {
  'credential' : FolderShareCredential,
  'cursor' : [] | [EntryCursor],
  'take' : [] | [number],
  'parent' : number,
}
export interface ShareListEntriesOutput {
  'next' : [] | [EntryCursor],
  'entries' : Array<SharedEntryInfo>,
  'parent_revision' : bigint,
}
export interface ShareMessageChannel {
  'key' : ShareMessageChannelKey,
  'share_revision' : [] | [bigint],
  'share_id' : [] | [Uint8Array | number[]],
  'updated_at_ms' : bigint,
  'created_by' : Principal,
  'created_at_ms' : bigint,
  'enabled' : boolean,
  'deadline_ms' : [] | [bigint],
  'revision' : bigint,
}
export type ShareMessageChannelKey = { 'DirectShare' : Uint8Array | number[] } |
  { 'DriftBottle' : { 'bottle_id' : bigint, 'market' : Principal } };
export interface ShareMessageCursor {
  'key' : ShareMessageKey,
  'reverse_created_at' : bigint,
}
export type ShareMessageError = { 'Internal' : string } |
  { 'InvalidInput' : string } |
  { 'AnonymousNotAllowed' : null } |
  { 'Duplicate' : null } |
  { 'InboxFull' : null } |
  { 'ChannelClosed' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'SafetyCheckRequired' : null } |
  { 'SafetyCheckUnavailable' : null } |
  { 'SenderBlocked' : null } |
  { 'Unavailable' : null } |
  { 'ExternalAuthorizationUnavailable' : null } |
  { 'DailyLimitExceeded' : null } |
  { 'Conflict' : string };
export type ShareMessageKey = {
    'DirectShare' : { 'share_id' : Uint8Array | number[], 'sender' : Principal }
  } |
  { 'DriftBottle' : { 'catch_id' : bigint, 'market' : Principal } };
export interface ShareMessageMutationInput {
  'key' : ShareMessageKey,
  'request_id' : Uint8Array | number[],
}
export type ShareMessageOrigin = { 'DirectShare' : ResolveFolderShareInput } |
  {
    'DriftBottle' : {
      'bottle_id' : bigint,
      'catch_id' : bigint,
      'market' : Principal,
    }
  };
export type ShareMessageOriginKind = { 'DirectShare' : null } |
  { 'DriftBottle' : null };
export type ShareMessageOriginView = {
    'DirectShare' : {
      'share_id' : Uint8Array | number[],
      'share_title' : string,
    }
  } |
  {
    'DriftBottle' : {
      'bottle_id' : bigint,
      'catch_id' : bigint,
      'market' : Principal,
    }
  };
export interface ShareReadFileChunkInput {
  'credential' : FolderShareCredential,
  'read' : ReadFileChunkInput,
}
export interface ShareReadFileRangeInput {
  'credential' : FolderShareCredential,
  'read' : ReadFileRangeInput,
}
export interface ShareSubtreeManifestInput {
  'credential' : FolderShareCredential,
  'cursor' : [] | [SubtreeManifestCursor],
  'take' : [] | [number],
}
export interface ShareSubtreeManifestOutput {
  'next' : [] | [SubtreeManifestCursor],
  'entries' : Array<SharedManifestEntry>,
  'revision' : bigint,
}
export interface SharedEntryInfo {
  'id' : number,
  'hash' : [] | [Uint8Array | number[]],
  'kind' : EntryKind,
  'name' : string,
  'size' : [] | [bigint],
  'generation' : [] | [bigint],
  'content_type' : [] | [string],
  'revision' : bigint,
  'parent' : number,
}
export interface SharedFolderInfo {
  'id' : number,
  'name' : string,
  'revision' : bigint,
}
export interface SharedManifestEntry {
  'path' : string,
  'entry' : SharedEntryInfo,
}
export interface SubmitShareMessageInput {
  'request_id' : Uint8Array | number[],
  'body' : string,
  'origin' : ShareMessageOrigin,
  /**
   * Reserved for a signed semantic-moderation proof. Rule-only experimental
   * buckets reject non-empty proofs until a verifier configuration exists.
   */
  'safety_attestation' : [] | [Uint8Array | number[]],
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
export interface SupportedStandard { 'url' : string, 'name' : string }
export type SyncError = { 'Internal' : string } |
  { 'InvalidInput' : string } |
  { 'NotFound' : string } |
  { 'PermissionDenied' : string } |
  { 'Unauthorized' : string } |
  { 'LimitExceeded' : string } |
  { 'Conflict' : { 'entries' : Array<EntryRef>, 'message' : string } };
export interface TextValue { 'content' : string }
export interface TokenAmount {
  'decimals' : number,
  'amount' : bigint,
  'symbol' : string,
}
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
  'encryption_writes' : [] | [boolean],
  'vetkd_derivation' : [] | [boolean],
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
export interface UpdateFolderShareInput {
  'request_id' : Uint8Array | number[],
  'access' : [] | [ShareAccessMode],
  'title' : [] | [string],
  'share_id' : Uint8Array | number[],
  'expected_revision' : [] | [bigint],
  'expires_at_ms' : [] | [bigint],
}
export interface UpdateShareMessageSafetyInput {
  'config' : [] | [ContentSafetyVerifierConfig],
}
export interface UpgradeArgs {
  'governance_canister' : [] | [Principal],
  'max_custom_data_size' : [] | [number],
  'encryption_writes' : [] | [boolean],
  'vetkd_derivation' : [] | [boolean],
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
export interface WebsiteConfig {
  'root_name' : string,
  'enabled' : boolean,
  'folder_id' : [] | [number],
}
export interface ZoneKeyEnvelopeV1 {
  'provider' : KeyProviderRef,
  'key_version' : number,
  'cipher' : ContentCipher,
  'aad_hash' : Uint8Array | number[],
  'protection' : ZoneKeyProtection,
  'version' : number,
  'nonce' : Uint8Array | number[],
  'wrapped_zwk' : Uint8Array | number[],
}
export type ZoneKeyProtection = { 'VetkdAndPassword' : null } |
  { 'VetkdOnly' : null };
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
  'admin_set_website_config' : ActorMethod<[SetWebsiteConfigInput], Result_5>,
  'admin_set_website_enabled' : ActorMethod<[boolean], Result_5>,
  'admin_transfer_cycles' : ActorMethod<[TransferCyclesInput], Result_6>,
  'admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_1>,
  'admin_update_share_message_safety' : ActorMethod<
    [UpdateShareMessageSafetyInput],
    Result_7
  >,
  'admin_upsert_reader_grant' : ActorMethod<[UpsertReaderGrantInput], Result_2>,
  'api_version' : ActorMethod<[], number>,
  'archive_encryption_zone' : ActorMethod<
    [ArchiveEncryptionZoneInput, [] | [Uint8Array | number[]]],
    Result_8
  >,
  'batch_create_small_files' : ActorMethod<
    [BatchCreateSmallFilesInput, [] | [Uint8Array | number[]]],
    Result_10
  >,
  'batch_delete_subfiles' : ActorMethod<
    [number, Uint32Array | number[], [] | [Uint8Array | number[]]],
    Result_11
  >,
  'batch_ensure_folders' : ActorMethod<
    [BatchEnsureFoldersInput, [] | [Uint8Array | number[]]],
    Result_13
  >,
  'begin_upload' : ActorMethod<
    [BeginUploadInput, [] | [Uint8Array | number[]]],
    Result_14
  >,
  'collect_folder_share_garbage' : ActorMethod<
    [MigrateDirectoryStorageInput],
    CollectFolderShareGarbageOutput
  >,
  'collect_garbage' : ActorMethod<
    [CollectGarbageInput, [] | [Uint8Array | number[]]],
    Result_15
  >,
  'collect_market_listing_garbage' : ActorMethod<
    [MigrateDirectoryStorageInput],
    CollectMarketListingGarbageOutput
  >,
  'collect_share_message_garbage' : ActorMethod<
    [MigrateDirectoryStorageInput],
    CollectShareMessageGarbageOutput
  >,
  'commit_upload' : ActorMethod<
    [AbortUploadInput, [] | [Uint8Array | number[]]],
    Result_16
  >,
  'consume_market_listing_ticket' : ActorMethod<
    [ConsumeMarketListingTicketInput],
    Result_17
  >,
  'create_child_encryption_zone' : ActorMethod<
    [CreateEncryptionZoneInput, [] | [Uint8Array | number[]]],
    Result_8
  >,
  'create_file' : ActorMethod<
    [CreateFileInput, [] | [Uint8Array | number[]]],
    Result_18
  >,
  'create_folder' : ActorMethod<
    [CreateFolderInput, [] | [Uint8Array | number[]]],
    Result_18
  >,
  'create_folder_share' : ActorMethod<[CreateFolderShareInput], Result_19>,
  'create_root_encryption_zone' : ActorMethod<
    [CreateEncryptionZoneInput, [] | [Uint8Array | number[]]],
    Result_8
  >,
  'delete_entry_if' : ActorMethod<
    [DeleteEntryIfInput, [] | [Uint8Array | number[]]],
    Result
  >,
  'delete_file' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_20
  >,
  'delete_folder' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_20
  >,
  'delete_my_share_message' : ActorMethod<
    [ShareMessageMutationInput],
    Result_21
  >,
  'derive_zone_key' : ActorMethod<
    [DeriveZoneKeyInput, [] | [Uint8Array | number[]]],
    Result_22
  >,
  'ensure_folder' : ActorMethod<
    [EnsureFolderInput, [] | [Uint8Array | number[]]],
    Result_12
  >,
  'get_bucket_info' : ActorMethod<[[] | [Uint8Array | number[]]], Result_23>,
  'get_canister_status' : ActorMethod<[], Result_24>,
  'get_capabilities' : ActorMethod<[], BucketCapabilities>,
  'get_directory_storage_health' : ActorMethod<
    [[] | [Uint8Array | number[]]],
    Result_25
  >,
  'get_domain_config' : ActorMethod<[], DomainConfig>,
  'get_encryption_zone' : ActorMethod<
    [Uint8Array | number[], [] | [Uint8Array | number[]]],
    Result_8
  >,
  'get_entry' : ActorMethod<
    [GetEntryInput, [] | [Uint8Array | number[]]],
    Result_26
  >,
  'get_file_ancestors' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_27
  >,
  'get_file_chunks' : ActorMethod<
    [number, number, [] | [number], [] | [Uint8Array | number[]]],
    Result_28
  >,
  /**
   * Returns the media-safe immutable description of a fully committed file.
   * Reader grants are sufficient for this endpoint, but do not expose any
   * directory metadata.
   */
  'get_file_descriptor' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_29
  >,
  /**
   * Lightweight star-state projection for directory/file views. Unlike the
   * detailed favorites page this performs no file metadata reads and returns at
   * most the per-user hard limit of 1,000 ids.
   */
  'get_file_favorite_ids' : ActorMethod<[], Result_11>,
  'get_file_info' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_30
  >,
  'get_file_info_by_hash' : ActorMethod<
    [Uint8Array | number[], [] | [Uint8Array | number[]]],
    Result_30
  >,
  'get_folder_ancestors' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_27
  >,
  'get_folder_info' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_31
  >,
  'get_folder_share' : ActorMethod<[Uint8Array | number[]], Result_19>,
  'get_folder_share_message_channel' : ActorMethod<
    [Uint8Array | number[]],
    Result_32
  >,
  'get_gc_health' : ActorMethod<[[] | [Uint8Array | number[]]], Result_33>,
  'get_market_listing_ticket' : ActorMethod<[Uint8Array | number[]], Result_34>,
  'get_my_encryption_profile' : ActorMethod<
    [[] | [Uint8Array | number[]]],
    Result_35
  >,
  'get_my_reader_grant' : ActorMethod<[], Result_36>,
  'get_oauth_config' : ActorMethod<[], OAuthPublicConfig>,
  'get_share_message_safety_config' : ActorMethod<
    [],
    [] | [ContentSafetyVerifierConfig]
  >,
  /**
   * Returns the storage-only subset of canister status and accepts the same
   * delegated access token as directory reads. The legacy full status endpoint
   * remains unchanged for existing clients.
   */
  'get_storage_metrics' : ActorMethod<
    [[] | [Uint8Array | number[]]],
    Result_37
  >,
  'get_subtree_manifest' : ActorMethod<
    [SubtreeManifestInput, [] | [Uint8Array | number[]]],
    Result_38
  >,
  'get_upload_health' : ActorMethod<[[] | [Uint8Array | number[]]], Result_39>,
  'get_upload_status' : ActorMethod<
    [GetUploadStatusInput, [] | [Uint8Array | number[]]],
    Result_40
  >,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc21_canister_call_consent_message' : ActorMethod<
    [ConsentMessageRequest],
    ConsentMessageResponse
  >,
  'initialize_encryption_zone_key' : ActorMethod<
    [InitializeEncryptionZoneKeyInput, [] | [Uint8Array | number[]]],
    Result_8
  >,
  'is_caller_controller' : ActorMethod<[], boolean>,
  'issue_market_listing_ticket' : ActorMethod<
    [IssueMarketListingTicketInput],
    Result_34
  >,
  'list_entries' : ActorMethod<
    [ListEntriesInput, [] | [Uint8Array | number[]]],
    Result_41
  >,
  'list_file_favorites' : ActorMethod<
    [ListFileFavoritesInput, [] | [Uint8Array | number[]]],
    Result_42
  >,
  'list_files' : ActorMethod<
    [number, [] | [number], [] | [number], [] | [Uint8Array | number[]]],
    Result_43
  >,
  'list_folder_shares' : ActorMethod<
    [ListFolderSharesInput],
    ListFolderSharesOutput
  >,
  'list_folders' : ActorMethod<
    [number, [] | [number], [] | [number], [] | [Uint8Array | number[]]],
    Result_44
  >,
  'list_my_share_messages' : ActorMethod<
    [ListShareMessagesInput],
    ListShareMessagesOutput
  >,
  'lookup_folder_share_code' : ActorMethod<
    [LookupFolderShareCodeInput],
    Result_45
  >,
  'move_file' : ActorMethod<
    [MoveInput, [] | [Uint8Array | number[]]],
    Result_46
  >,
  'move_folder' : ActorMethod<
    [MoveInput, [] | [Uint8Array | number[]]],
    Result_46
  >,
  'oauth_begin' : ActorMethod<[OAuthBeginInput], Result_47>,
  'oauth_complete' : ActorMethod<[OAuthCompleteInput], Result_48>,
  /**
   * Reads exactly one chunk from an expected immutable file generation.
   */
  'read_file_chunk' : ActorMethod<
    [ReadFileChunkInput, [] | [Uint8Array | number[]]],
    Result_49
  >,
  /**
   * Reads a bounded byte range from an expected immutable file generation.
   */
  'read_file_range' : ActorMethod<
    [ReadFileRangeInput, [] | [Uint8Array | number[]]],
    Result_49
  >,
  'renew_upload' : ActorMethod<
    [AbortUploadInput, [] | [Uint8Array | number[]]],
    Result_50
  >,
  'report_share_message' : ActorMethod<[ReportShareMessageInput], Result_21>,
  'resolve_encryption_zone' : ActorMethod<
    [number, [] | [Uint8Array | number[]]],
    Result_51
  >,
  'resolve_encryption_zones' : ActorMethod<
    [Uint32Array | number[], [] | [Uint8Array | number[]]],
    Result_52
  >,
  'resolve_folder_share' : ActorMethod<[ResolveFolderShareInput], Result_53>,
  'retract_sent_share_message' : ActorMethod<
    [ShareMessageMutationInput],
    Result_21
  >,
  'retry_share_message_confirmations' : ActorMethod<
    [MigrateDirectoryStorageInput],
    RetryShareMessageConfirmationsOutput
  >,
  'revoke_folder_share' : ActorMethod<[RevokeFolderShareInput], Result_19>,
  'rotate_folder_share_secret' : ActorMethod<
    [RotateFolderShareSecretInput],
    Result_19
  >,
  'set_drift_bottle_message_channel' : ActorMethod<
    [SetDriftBottleChannelInput],
    Result_54
  >,
  'set_file_favorite' : ActorMethod<
    [SetFileFavoriteInput, [] | [Uint8Array | number[]]],
    Result_20
  >,
  'set_folder_share_messages' : ActorMethod<
    [SetFolderShareMessagesInput],
    Result_32
  >,
  'set_share_message_sender_block' : ActorMethod<
    [SetShareMessageSenderBlockInput],
    Result_55
  >,
  'share_get_file_descriptor' : ActorMethod<[ShareFileInput], Result_56>,
  'share_list_entries' : ActorMethod<[ShareListEntriesInput], Result_57>,
  'share_read_file_chunk' : ActorMethod<[ShareReadFileChunkInput], Result_58>,
  'share_read_file_range' : ActorMethod<[ShareReadFileRangeInput], Result_58>,
  'share_subtree_manifest' : ActorMethod<
    [ShareSubtreeManifestInput],
    Result_59
  >,
  'submit_share_message' : ActorMethod<[SubmitShareMessageInput], Result_21>,
  'update_file_chunk' : ActorMethod<
    [UpdateFileChunkInput, [] | [Uint8Array | number[]]],
    Result_60
  >,
  'update_file_info' : ActorMethod<
    [UpdateFileInput, [] | [Uint8Array | number[]]],
    Result_46
  >,
  'update_folder_info' : ActorMethod<
    [UpdateFolderInput, [] | [Uint8Array | number[]]],
    Result_46
  >,
  'update_folder_share' : ActorMethod<[UpdateFolderShareInput], Result_19>,
  'upload_chunk' : ActorMethod<
    [UploadChunkInput, [] | [Uint8Array | number[]]],
    Result_61
  >,
  'validate2_admin_set_auditors' : ActorMethod<[Array<Principal>], Result_62>,
  'validate2_admin_set_custom_domains' : ActorMethod<
    [Array<string>],
    Result_62
  >,
  'validate2_admin_set_managers' : ActorMethod<[Array<Principal>], Result_62>,
  'validate2_admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_62>,
  'validate_admin_add_auditors' : ActorMethod<[Array<Principal>], Result_62>,
  'validate_admin_add_managers' : ActorMethod<[Array<Principal>], Result_62>,
  'validate_admin_remove_auditors' : ActorMethod<[Array<Principal>], Result_62>,
  'validate_admin_remove_managers' : ActorMethod<[Array<Principal>], Result_62>,
  'validate_admin_set_auditors' : ActorMethod<[Array<Principal>], Result_1>,
  'validate_admin_set_custom_domains' : ActorMethod<[Array<string>], Result_1>,
  'validate_admin_set_managers' : ActorMethod<[Array<Principal>], Result_1>,
  'validate_admin_update_bucket' : ActorMethod<[UpdateBucketInput], Result_1>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

export const idlFactory = ({ IDL }) => {
  const UpgradeArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'max_custom_data_size' : IDL.Opt(IDL.Nat16),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
  });
  const InitArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'max_custom_data_size' : IDL.Nat16,
    'max_children' : IDL.Nat16,
    'enable_hash_index' : IDL.Bool,
    'max_file_size' : IDL.Nat64,
    'visibility' : IDL.Nat8,
    'max_folder_depth' : IDL.Nat8,
    'file_id' : IDL.Nat32,
  });
  const CanisterArgs = IDL.Variant({
    'Upgrade' : UpgradeArgs,
    'Init' : InitArgs,
  });
  const AbortUploadInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'session_id' : IDL.Vec(IDL.Nat8),
  });
  const EntryKind = IDL.Variant({ 'Folder' : IDL.Null, 'File' : IDL.Null });
  const EntryRef = IDL.Record({ 'id' : IDL.Nat32, 'kind' : EntryKind });
  const SyncError = IDL.Variant({
    'Internal' : IDL.Text,
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Text,
    'PermissionDenied' : IDL.Text,
    'Unauthorized' : IDL.Text,
    'LimitExceeded' : IDL.Text,
    'Conflict' : IDL.Record({
      'entries' : IDL.Vec(EntryRef),
      'message' : IDL.Text,
    }),
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : SyncError });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const ReaderGrantSpec = IDL.Record({
    'subject' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const BatchUpsertReaderGrantsInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'grants' : IDL.Vec(ReaderGrantSpec),
  });
  const ReaderGrantStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Revoked' : IDL.Null,
  });
  const ReaderGrant = IDL.Record({
    'status' : ReaderGrantStatus,
    'subject' : IDL.Principal,
    'updated_at_ms' : IDL.Nat64,
    'granted_by' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const ReaderGrantError = IDL.Variant({
    'InvalidExpiry' : IDL.Null,
    'InvalidInput' : IDL.Text,
    'AnonymousNotAllowed' : IDL.Null,
    'VersionConflict' : IDL.Record({ 'current_version' : IDL.Nat64 }),
    'StaleVersion' : IDL.Record({ 'current_version' : IDL.Nat64 }),
    'TooManyItems' : IDL.Record({ 'max' : IDL.Nat16 }),
    'Unauthorized' : IDL.Null,
  });
  const Result_2 = IDL.Variant({
    'Ok' : ReaderGrant,
    'Err' : ReaderGrantError,
  });
  const BatchUpsertReaderGrantsOutput = IDL.Record({
    'results' : IDL.Vec(Result_2),
  });
  const Result_3 = IDL.Variant({
    'Ok' : BatchUpsertReaderGrantsOutput,
    'Err' : ReaderGrantError,
  });
  const OAuthAccountStatus = IDL.Variant({
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const OAuthProvider = IDL.Variant({
    'Wechat' : IDL.Null,
    'Google' : IDL.Null,
  });
  const OAuthAccount = IDL.Record({
    'key' : IDL.Text,
    'status' : OAuthAccountStatus,
    'provider' : OAuthProvider,
    'avatar_url' : IDL.Text,
    'reviewed_at' : IDL.Opt(IDL.Nat64),
    'reviewed_by' : IDL.Opt(IDL.Principal),
    'email' : IDL.Text,
    'requested_at' : IDL.Nat64,
    'display_name' : IDL.Text,
    'last_login_at' : IDL.Nat64,
  });
  const MigrateDirectoryStorageInput = IDL.Record({
    'max_items' : IDL.Opt(IDL.Nat16),
  });
  const MigrationState = IDL.Variant({
    'Failed' : IDL.Null,
    'Migrating' : IDL.Null,
    'Ready' : IDL.Null,
    'Legacy' : IDL.Null,
  });
  const MigrateDirectoryStorageOutput = IDL.Record({
    'folder_cursor' : IDL.Opt(IDL.Nat32),
    'error' : IDL.Opt(IDL.Text),
    'file_cursor' : IDL.Opt(IDL.Nat32),
    'state' : MigrationState,
    'processed' : IDL.Nat16,
  });
  const OAuthReviewInput = IDL.Record({
    'key' : IDL.Text,
    'status' : OAuthAccountStatus,
  });
  const Result_4 = IDL.Variant({ 'Ok' : OAuthAccount, 'Err' : IDL.Text });
  const RevokeReaderGrantInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'subject' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
  });
  const OAuthProviderConfigInput = IDL.Record({
    'client_id' : IDL.Text,
    'client_secret' : IDL.Text,
  });
  const OAuthConfigInput = IDL.Record({
    'redirect_uris' : IDL.Vec(IDL.Text),
    'google' : IDL.Opt(OAuthProviderConfigInput),
    'schnorr_key_name' : IDL.Text,
    'session_ttl_seconds' : IDL.Nat64,
    'wechat' : IDL.Opt(OAuthProviderConfigInput),
  });
  const TransferCyclesInput = IDL.Record({
    'to_canister' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const TransferCyclesOutput = IDL.Record({
    'transferred' : IDL.Nat,
    'remaining_balance' : IDL.Nat,
  });
  const Result_5 = IDL.Variant({
    'Ok' : TransferCyclesOutput,
    'Err' : IDL.Text,
  });
  const ReaderPolicy = IDL.Record({
    'allow_by_hash' : IDL.Bool,
    'enabled' : IDL.Bool,
    'authority' : IDL.Opt(IDL.Principal),
  });
  const HttpReadMode = IDL.Variant({
    'TokenProtected' : IDL.Null,
    'Disabled' : IDL.Null,
    'Public' : IDL.Null,
    'Legacy' : IDL.Null,
  });
  const UpdateBucketInput = IDL.Record({
    'status' : IDL.Opt(IDL.Int8),
    'reader_policy' : IDL.Opt(ReaderPolicy),
    'trusted_eddsa_pub_keys' : IDL.Opt(IDL.Vec(IDL.Vec(IDL.Nat8))),
    'name' : IDL.Opt(IDL.Text),
    'max_custom_data_size' : IDL.Opt(IDL.Nat16),
    'http_read_mode' : IDL.Opt(HttpReadMode),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'visibility' : IDL.Opt(IDL.Nat8),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
    'trusted_ecdsa_pub_keys' : IDL.Opt(IDL.Vec(IDL.Vec(IDL.Nat8))),
  });
  const UpsertReaderGrantInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'subject' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const MetadataValue = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const CreateFileInput = IDL.Record({
    'dek' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'status' : IDL.Opt(IDL.Int8),
    'content' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'custom' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'size' : IDL.Opt(IDL.Nat64),
    'content_type' : IDL.Text,
    'parent' : IDL.Nat32,
  });
  const BatchCreateSmallFilesInput = IDL.Record({
    'files' : IDL.Vec(CreateFileInput),
    'request_id' : IDL.Vec(IDL.Nat8),
  });
  const CreateFileOutput = IDL.Record({
    'id' : IDL.Nat32,
    'created_at' : IDL.Nat64,
  });
  const Result_6 = IDL.Variant({ 'Ok' : CreateFileOutput, 'Err' : SyncError });
  const BatchCreateSmallFilesOutput = IDL.Record({
    'results' : IDL.Vec(Result_6),
  });
  const Result_7 = IDL.Variant({
    'Ok' : BatchCreateSmallFilesOutput,
    'Err' : SyncError,
  });
  const Result_8 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat32), 'Err' : IDL.Text });
  const CreateFolderInput = IDL.Record({
    'name' : IDL.Text,
    'parent' : IDL.Nat32,
  });
  const BatchEnsureFoldersInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'folders' : IDL.Vec(CreateFolderInput),
  });
  const EnsureFolderOutput = IDL.Record({
    'id' : IDL.Nat32,
    'created' : IDL.Bool,
    'created_at' : IDL.Nat64,
    'revision' : IDL.Nat64,
  });
  const Result_9 = IDL.Variant({
    'Ok' : EnsureFolderOutput,
    'Err' : SyncError,
  });
  const BatchEnsureFoldersOutput = IDL.Record({
    'results' : IDL.Vec(Result_9),
  });
  const Result_10 = IDL.Variant({
    'Ok' : BatchEnsureFoldersOutput,
    'Err' : SyncError,
  });
  const ReplaceFileInput = IDL.Record({
    'id' : IDL.Nat32,
    'expected_revision' : IDL.Nat64,
  });
  const BeginUploadInput = IDL.Record({
    'dek' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'request_id' : IDL.Vec(IDL.Nat8),
    'status' : IDL.Int8,
    'custom' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'expected_parent_revision' : IDL.Nat64,
    'name' : IDL.Text,
    'size' : IDL.Nat64,
    'content_type' : IDL.Text,
    'replace' : IDL.Opt(ReplaceFileInput),
    'parent' : IDL.Nat32,
  });
  const BeginUploadOutput = IDL.Record({
    'total_chunks' : IDL.Nat32,
    'session_id' : IDL.Vec(IDL.Nat8),
    'generation' : IDL.Nat64,
    'chunk_size' : IDL.Nat32,
    'expires_at' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const Result_11 = IDL.Variant({
    'Ok' : BeginUploadOutput,
    'Err' : SyncError,
  });
  const CollectGarbageInput = IDL.Record({ 'max_chunks' : IDL.Opt(IDL.Nat32) });
  const CollectGarbageOutput = IDL.Record({
    'removed_chunks' : IDL.Nat32,
    'remaining_items' : IDL.Nat64,
    'processed_chunks' : IDL.Nat32,
    'completed_items' : IDL.Nat32,
    'remaining_chunks' : IDL.Nat64,
  });
  const Result_12 = IDL.Variant({
    'Ok' : CollectGarbageOutput,
    'Err' : SyncError,
  });
  const CommitUploadOutput = IDL.Record({
    'id' : IDL.Nat32,
    'created' : IDL.Bool,
    'committed_at' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'revision' : IDL.Nat64,
  });
  const Result_13 = IDL.Variant({
    'Ok' : CommitUploadOutput,
    'Err' : SyncError,
  });
  const Result_14 = IDL.Variant({ 'Ok' : CreateFileOutput, 'Err' : IDL.Text });
  const DeleteEntryIfInput = IDL.Record({
    'id' : IDL.Nat32,
    'request_id' : IDL.Vec(IDL.Nat8),
    'kind' : EntryKind,
    'expected_parent' : IDL.Nat32,
    'expected_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'expected_revision' : IDL.Nat64,
  });
  const Result_15 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const EnsureFolderInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'parent' : IDL.Nat32,
  });
  const BucketInfo = IDL.Record({
    'status' : IDL.Int8,
    'reader_policy' : IDL.Opt(ReaderPolicy),
    'total_chunks' : IDL.Nat64,
    'trusted_eddsa_pub_keys' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'managers' : IDL.Vec(IDL.Principal),
    'governance_canister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'max_custom_data_size' : IDL.Nat16,
    'auditors' : IDL.Vec(IDL.Principal),
    'http_read_mode' : IDL.Opt(HttpReadMode),
    'total_files' : IDL.Nat64,
    'max_children' : IDL.Nat16,
    'enable_hash_index' : IDL.Bool,
    'max_file_size' : IDL.Nat64,
    'folder_id' : IDL.Nat32,
    'visibility' : IDL.Nat8,
    'max_folder_depth' : IDL.Nat8,
    'trusted_ecdsa_pub_keys' : IDL.Vec(IDL.Vec(IDL.Nat8)),
    'total_folders' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const Result_16 = IDL.Variant({ 'Ok' : BucketInfo, 'Err' : IDL.Text });
  const MemoryMetrics = IDL.Record({
    'wasm_binary_size' : IDL.Nat,
    'log_memory_store_size' : IDL.Nat,
    'wasm_chunk_store_size' : IDL.Nat,
    'canister_history_size' : IDL.Nat,
    'stable_memory_size' : IDL.Nat,
    'snapshots_size' : IDL.Nat,
    'wasm_memory_size' : IDL.Nat,
    'global_memory_size' : IDL.Nat,
    'custom_sections_size' : IDL.Nat,
  });
  const CanisterStatusType = IDL.Variant({
    'stopped' : IDL.Null,
    'stopping' : IDL.Null,
    'running' : IDL.Null,
  });
  const EnvironmentVariable = IDL.Record({
    'value' : IDL.Text,
    'name' : IDL.Text,
  });
  const LogVisibility = IDL.Variant({
    'controllers' : IDL.Null,
    'public' : IDL.Null,
    'allowed_viewers' : IDL.Vec(IDL.Principal),
  });
  const DefiniteCanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Nat,
    'wasm_memory_threshold' : IDL.Nat,
    'environment_variables' : IDL.Vec(EnvironmentVariable),
    'controllers' : IDL.Vec(IDL.Principal),
    'reserved_cycles_limit' : IDL.Nat,
    'log_visibility' : LogVisibility,
    'log_memory_limit' : IDL.Nat,
    'wasm_memory_limit' : IDL.Nat,
    'memory_allocation' : IDL.Nat,
    'compute_allocation' : IDL.Nat,
  });
  const QueryStats = IDL.Record({
    'response_payload_bytes_total' : IDL.Nat,
    'num_instructions_total' : IDL.Nat,
    'num_calls_total' : IDL.Nat,
    'request_payload_bytes_total' : IDL.Nat,
  });
  const CanisterStatusResult = IDL.Record({
    'memory_metrics' : MemoryMetrics,
    'status' : CanisterStatusType,
    'memory_size' : IDL.Nat,
    'ready_for_migration' : IDL.Bool,
    'version' : IDL.Nat64,
    'cycles' : IDL.Nat,
    'settings' : DefiniteCanisterSettings,
    'query_stats' : QueryStats,
    'idle_cycles_burned_per_day' : IDL.Nat,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'reserved_cycles' : IDL.Nat,
  });
  const Result_17 = IDL.Variant({
    'Ok' : CanisterStatusResult,
    'Err' : IDL.Text,
  });
  const BucketCapabilities = IDL.Record({
    'batch_operations' : IDL.Opt(IDL.Bool),
    'reader_grants' : IDL.Opt(IDL.Bool),
    'api_version' : IDL.Nat16,
    'incremental_gc' : IDL.Bool,
    'migration_state' : MigrationState,
    'ensure_folder' : IDL.Bool,
    'storage_metrics' : IDL.Opt(IDL.Bool),
    'conditional_delete' : IDL.Bool,
    'unique_names' : IDL.Bool,
    'get_entry' : IDL.Bool,
    'http_read_modes' : IDL.Opt(IDL.Bool),
    'storage_version' : IDL.Nat16,
    'manifest' : IDL.Bool,
    'atomic_commit' : IDL.Bool,
    'upload_sessions' : IDL.Bool,
  });
  const DirectoryStorageHealth = IDL.Record({
    'migration_error' : IDL.Opt(IDL.Text),
    'stable_folders' : IDL.Nat64,
    'duplicate_names' : IDL.Nat64,
    'legacy_folders' : IDL.Nat64,
    'stable_names' : IDL.Nat64,
    'stable_children' : IDL.Nat64,
    'dangling_entries' : IDL.Nat64,
  });
  const Result_18 = IDL.Variant({
    'Ok' : DirectoryStorageHealth,
    'Err' : SyncError,
  });
  const DomainConfig = IDL.Record({
    'derivation_origin' : IDL.Text,
    'custom_domains' : IDL.Vec(IDL.Text),
    'canister_id' : IDL.Principal,
  });
  const GetEntryInput = IDL.Record({ 'name' : IDL.Text, 'parent' : IDL.Nat32 });
  const EntryInfoV2 = IDL.Record({
    'id' : IDL.Nat32,
    'status' : IDL.Int8,
    'updated_at' : IDL.Nat64,
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'kind' : EntryKind,
    'name' : IDL.Text,
    'size' : IDL.Opt(IDL.Nat64),
    'content_type' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Nat64,
    'filled' : IDL.Opt(IDL.Nat64),
    'revision' : IDL.Nat64,
    'parent' : IDL.Nat32,
  });
  const Result_19 = IDL.Variant({
    'Ok' : IDL.Opt(EntryInfoV2),
    'Err' : SyncError,
  });
  const FolderName = IDL.Record({ 'id' : IDL.Nat32, 'name' : IDL.Text });
  const Result_20 = IDL.Variant({
    'Ok' : IDL.Vec(FolderName),
    'Err' : IDL.Text,
  });
  const Result_21 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Tuple(IDL.Nat32, IDL.Vec(IDL.Nat8))),
    'Err' : IDL.Text,
  });
  const FileDescriptor = IDL.Record({
    'id' : IDL.Nat32,
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'content_type' : IDL.Text,
    'chunks' : IDL.Nat32,
    'chunk_size' : IDL.Nat32,
  });
  const Result_22 = IDL.Variant({ 'Ok' : FileDescriptor, 'Err' : IDL.Text });
  const FileInfo = IDL.Record({
    'ex' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'id' : IDL.Nat32,
    'dek' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'status' : IDL.Int8,
    'updated_at' : IDL.Nat64,
    'custom' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'content_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'filled' : IDL.Nat64,
    'chunks' : IDL.Nat32,
    'revision' : IDL.Nat64,
    'parent' : IDL.Nat32,
  });
  const Result_23 = IDL.Variant({ 'Ok' : FileInfo, 'Err' : IDL.Text });
  const FolderInfo = IDL.Record({
    'id' : IDL.Nat32,
    'files' : IDL.Vec(IDL.Nat32),
    'status' : IDL.Int8,
    'updated_at' : IDL.Nat64,
    'name' : IDL.Text,
    'folders' : IDL.Vec(IDL.Nat32),
    'created_at' : IDL.Nat64,
    'revision' : IDL.Nat64,
    'parent' : IDL.Nat32,
  });
  const Result_24 = IDL.Variant({ 'Ok' : FolderInfo, 'Err' : IDL.Text });
  const GcHealth = IDL.Record({
    'pending_chunks' : IDL.Nat64,
    'pending_items' : IDL.Nat64,
    'oldest_enqueued_at' : IDL.Opt(IDL.Nat64),
  });
  const Result_25 = IDL.Variant({ 'Ok' : GcHealth, 'Err' : SyncError });
  const Result_26 = IDL.Variant({
    'Ok' : IDL.Opt(ReaderGrant),
    'Err' : ReaderGrantError,
  });
  const OAuthProviderPublicConfig = IDL.Record({ 'client_id' : IDL.Text });
  const OAuthPublicConfig = IDL.Record({
    'redirect_uris' : IDL.Vec(IDL.Text),
    'google' : IDL.Opt(OAuthProviderPublicConfig),
    'wechat' : IDL.Opt(OAuthProviderPublicConfig),
  });
  const BucketStorageMetrics = IDL.Record({
    'total_memory_size' : IDL.Nat64,
    'stable_memory_size' : IDL.Nat64,
    'cycles' : IDL.Opt(IDL.Nat),
    'stable_memory_limit' : IDL.Nat64,
    'wasm_memory_size' : IDL.Nat64,
    'memory_allocation' : IDL.Nat64,
    'reserved_cycles' : IDL.Opt(IDL.Nat),
  });
  const Result_27 = IDL.Variant({
    'Ok' : BucketStorageMetrics,
    'Err' : IDL.Text,
  });
  const ManifestFrame = IDL.Record({
    'after' : IDL.Opt(EntryRef),
    'path' : IDL.Text,
    'folder_id' : IDL.Nat32,
  });
  const SubtreeManifestCursor = IDL.Record({
    'stack' : IDL.Vec(ManifestFrame),
    'revision' : IDL.Nat64,
  });
  const SubtreeManifestInput = IDL.Record({
    'cursor' : IDL.Opt(SubtreeManifestCursor),
    'root' : IDL.Nat32,
    'take' : IDL.Opt(IDL.Nat16),
  });
  const ManifestEntry = IDL.Record({
    'path' : IDL.Text,
    'entry' : EntryInfoV2,
  });
  const SubtreeManifestOutput = IDL.Record({
    'next' : IDL.Opt(SubtreeManifestCursor),
    'entries' : IDL.Vec(ManifestEntry),
    'revision' : IDL.Nat64,
  });
  const Result_28 = IDL.Variant({
    'Ok' : SubtreeManifestOutput,
    'Err' : SyncError,
  });
  const UploadHealth = IDL.Record({
    'active_sessions' : IDL.Nat64,
    'max_active_sessions' : IDL.Nat16,
  });
  const Result_29 = IDL.Variant({ 'Ok' : UploadHealth, 'Err' : SyncError });
  const GetUploadStatusInput = IDL.Record({
    'session_id' : IDL.Vec(IDL.Nat8),
    'take' : IDL.Opt(IDL.Nat16),
    'start' : IDL.Opt(IDL.Nat32),
  });
  const UploadedChunkRange = IDL.Record({
    'end' : IDL.Nat32,
    'start' : IDL.Nat32,
  });
  const UploadStatusOutput = IDL.Record({
    'total_chunks' : IDL.Nat32,
    'next' : IDL.Opt(IDL.Nat32),
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'filled' : IDL.Nat64,
    'ranges' : IDL.Vec(UploadedChunkRange),
    'expires_at' : IDL.Nat64,
    'uploaded_chunks' : IDL.Nat32,
    'file_id' : IDL.Nat32,
  });
  const Result_30 = IDL.Variant({
    'Ok' : UploadStatusOutput,
    'Err' : SyncError,
  });
  const EntryCursor = IDL.Record({
    'id' : IDL.Nat32,
    'kind' : EntryKind,
    'parent_revision' : IDL.Nat64,
  });
  const ListEntriesInput = IDL.Record({
    'cursor' : IDL.Opt(EntryCursor),
    'take' : IDL.Opt(IDL.Nat16),
    'parent' : IDL.Nat32,
  });
  const ListEntriesOutput = IDL.Record({
    'next' : IDL.Opt(EntryCursor),
    'entries' : IDL.Vec(EntryInfoV2),
    'parent_revision' : IDL.Nat64,
  });
  const Result_31 = IDL.Variant({
    'Ok' : ListEntriesOutput,
    'Err' : SyncError,
  });
  const Result_32 = IDL.Variant({ 'Ok' : IDL.Vec(FileInfo), 'Err' : IDL.Text });
  const Result_33 = IDL.Variant({
    'Ok' : IDL.Vec(FolderInfo),
    'Err' : IDL.Text,
  });
  const MoveInput = IDL.Record({
    'id' : IDL.Nat32,
    'to' : IDL.Nat32,
    'from' : IDL.Nat32,
  });
  const UpdateFileOutput = IDL.Record({ 'updated_at' : IDL.Nat64 });
  const Result_34 = IDL.Variant({ 'Ok' : UpdateFileOutput, 'Err' : IDL.Text });
  const OAuthBeginInput = IDL.Record({
    'provider' : OAuthProvider,
    'redirect_uri' : IDL.Text,
  });
  const OAuthBeginOutput = IDL.Record({ 'authorization_url' : IDL.Text });
  const Result_35 = IDL.Variant({ 'Ok' : OAuthBeginOutput, 'Err' : IDL.Text });
  const OAuthCompleteInput = IDL.Record({
    'code' : IDL.Text,
    'state' : IDL.Text,
  });
  const OAuthCompleteOutput = IDL.Variant({
    'Approved' : IDL.Record({
      'token' : IDL.Vec(IDL.Nat8),
      'account' : OAuthAccount,
    }),
    'Rejected' : OAuthAccount,
    'Pending' : OAuthAccount,
  });
  const Result_36 = IDL.Variant({
    'Ok' : OAuthCompleteOutput,
    'Err' : IDL.Text,
  });
  const ReadFileChunkInput = IDL.Record({
    'generation' : IDL.Nat64,
    'index' : IDL.Nat32,
    'file_id' : IDL.Nat32,
  });
  const Result_37 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const ReadFileRangeInput = IDL.Record({
    'generation' : IDL.Nat64,
    'offset' : IDL.Nat64,
    'length' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const RenewUploadOutput = IDL.Record({ 'expires_at' : IDL.Nat64 });
  const Result_38 = IDL.Variant({
    'Ok' : RenewUploadOutput,
    'Err' : SyncError,
  });
  const UpdateFileChunkInput = IDL.Record({
    'id' : IDL.Nat32,
    'chunk_index' : IDL.Nat32,
    'content' : IDL.Vec(IDL.Nat8),
  });
  const UpdateFileChunkOutput = IDL.Record({
    'updated_at' : IDL.Nat64,
    'filled' : IDL.Nat64,
  });
  const Result_39 = IDL.Variant({
    'Ok' : UpdateFileChunkOutput,
    'Err' : IDL.Text,
  });
  const UpdateFileInput = IDL.Record({
    'id' : IDL.Nat32,
    'status' : IDL.Opt(IDL.Int8),
    'custom' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Opt(IDL.Text),
    'size' : IDL.Opt(IDL.Nat64),
    'content_type' : IDL.Opt(IDL.Text),
  });
  const UpdateFolderInput = IDL.Record({
    'id' : IDL.Nat32,
    'status' : IDL.Opt(IDL.Int8),
    'name' : IDL.Opt(IDL.Text),
  });
  const UploadChunkInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'chunk_index' : IDL.Nat32,
    'content' : IDL.Vec(IDL.Nat8),
    'session_id' : IDL.Vec(IDL.Nat8),
  });
  const UploadChunkOutput = IDL.Record({
    'filled' : IDL.Nat64,
    'expires_at' : IDL.Nat64,
    'uploaded_chunks' : IDL.Nat32,
  });
  const Result_40 = IDL.Variant({
    'Ok' : UploadChunkOutput,
    'Err' : SyncError,
  });
  const Result_41 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  return IDL.Service({
    'abort_upload' : IDL.Func(
        [AbortUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result],
        [],
      ),
    'admin_add_auditors' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'admin_add_managers' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'admin_batch_upsert_reader_grants' : IDL.Func(
        [BatchUpsertReaderGrantsInput],
        [Result_3],
        [],
      ),
    'admin_list_oauth_accounts' : IDL.Func(
        [],
        [IDL.Vec(OAuthAccount)],
        ['query'],
      ),
    'admin_migrate_directory_storage' : IDL.Func(
        [MigrateDirectoryStorageInput],
        [MigrateDirectoryStorageOutput],
        [],
      ),
    'admin_remove_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_1],
        [],
      ),
    'admin_remove_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_1],
        [],
      ),
    'admin_retry_directory_migration' : IDL.Func(
        [],
        [MigrateDirectoryStorageOutput],
        [],
      ),
    'admin_review_oauth_account' : IDL.Func([OAuthReviewInput], [Result_4], []),
    'admin_revoke_reader_grant' : IDL.Func(
        [RevokeReaderGrantInput],
        [Result_2],
        [],
      ),
    'admin_set_auditors' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'admin_set_custom_domains' : IDL.Func([IDL.Vec(IDL.Text)], [Result_1], []),
    'admin_set_governance_canister' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [Result_1],
        [],
      ),
    'admin_set_managers' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'admin_set_oauth_config' : IDL.Func([OAuthConfigInput], [Result_1], []),
    'admin_set_reader_authority' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [Result_1],
        [],
      ),
    'admin_transfer_cycles' : IDL.Func([TransferCyclesInput], [Result_5], []),
    'admin_update_bucket' : IDL.Func([UpdateBucketInput], [Result_1], []),
    'admin_upsert_reader_grant' : IDL.Func(
        [UpsertReaderGrantInput],
        [Result_2],
        [],
      ),
    'api_version' : IDL.Func([], [IDL.Nat16], ['query']),
    'batch_create_small_files' : IDL.Func(
        [BatchCreateSmallFilesInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_7],
        [],
      ),
    'batch_delete_subfiles' : IDL.Func(
        [IDL.Nat32, IDL.Vec(IDL.Nat32), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        [],
      ),
    'batch_ensure_folders' : IDL.Func(
        [BatchEnsureFoldersInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_10],
        [],
      ),
    'begin_upload' : IDL.Func(
        [BeginUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_11],
        [],
      ),
    'collect_garbage' : IDL.Func(
        [CollectGarbageInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_12],
        [],
      ),
    'commit_upload' : IDL.Func(
        [AbortUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_13],
        [],
      ),
    'create_file' : IDL.Func(
        [CreateFileInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_14],
        [],
      ),
    'create_folder' : IDL.Func(
        [CreateFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_14],
        [],
      ),
    'delete_entry_if' : IDL.Func(
        [DeleteEntryIfInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result],
        [],
      ),
    'delete_file' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_15],
        [],
      ),
    'delete_folder' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_15],
        [],
      ),
    'ensure_folder' : IDL.Func(
        [EnsureFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_9],
        [],
      ),
    'get_bucket_info' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_16],
        ['query'],
      ),
    'get_canister_status' : IDL.Func([], [Result_17], []),
    'get_capabilities' : IDL.Func([], [BucketCapabilities], ['query']),
    'get_directory_storage_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_18],
        ['query'],
      ),
    'get_domain_config' : IDL.Func([], [DomainConfig], ['query']),
    'get_entry' : IDL.Func(
        [GetEntryInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_19],
        ['query'],
      ),
    'get_file_ancestors' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_20],
        ['query'],
      ),
    'get_file_chunks' : IDL.Func(
        [IDL.Nat32, IDL.Nat32, IDL.Opt(IDL.Nat32), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_21],
        ['query'],
      ),
    'get_file_descriptor' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_22],
        ['query'],
      ),
    'get_file_info' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_23],
        ['query'],
      ),
    'get_file_info_by_hash' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_23],
        ['query'],
      ),
    'get_folder_ancestors' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_20],
        ['query'],
      ),
    'get_folder_info' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_24],
        ['query'],
      ),
    'get_gc_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_25],
        ['query'],
      ),
    'get_my_reader_grant' : IDL.Func([], [Result_26], ['query']),
    'get_oauth_config' : IDL.Func([], [OAuthPublicConfig], ['query']),
    'get_storage_metrics' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_27],
        [],
      ),
    'get_subtree_manifest' : IDL.Func(
        [SubtreeManifestInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_28],
        ['query'],
      ),
    'get_upload_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_29],
        ['query'],
      ),
    'get_upload_status' : IDL.Func(
        [GetUploadStatusInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_30],
        ['query'],
      ),
    'is_caller_controller' : IDL.Func([], [IDL.Bool], ['query']),
    'list_entries' : IDL.Func(
        [ListEntriesInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_31],
        ['query'],
      ),
    'list_files' : IDL.Func(
        [
          IDL.Nat32,
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
        ],
        [Result_32],
        ['query'],
      ),
    'list_folders' : IDL.Func(
        [
          IDL.Nat32,
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
        ],
        [Result_33],
        ['query'],
      ),
    'move_file' : IDL.Func(
        [MoveInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_34],
        [],
      ),
    'move_folder' : IDL.Func(
        [MoveInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_34],
        [],
      ),
    'oauth_begin' : IDL.Func([OAuthBeginInput], [Result_35], []),
    'oauth_complete' : IDL.Func([OAuthCompleteInput], [Result_36], []),
    'read_file_chunk' : IDL.Func(
        [ReadFileChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_37],
        ['query'],
      ),
    'read_file_range' : IDL.Func(
        [ReadFileRangeInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_37],
        ['query'],
      ),
    'renew_upload' : IDL.Func(
        [AbortUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_38],
        [],
      ),
    'update_file_chunk' : IDL.Func(
        [UpdateFileChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_39],
        [],
      ),
    'update_file_info' : IDL.Func(
        [UpdateFileInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_34],
        [],
      ),
    'update_folder_info' : IDL.Func(
        [UpdateFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_34],
        [],
      ),
    'upload_chunk' : IDL.Func(
        [UploadChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_40],
        [],
      ),
    'validate2_admin_set_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate2_admin_set_custom_domains' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [Result_41],
        [],
      ),
    'validate2_admin_set_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate2_admin_update_bucket' : IDL.Func(
        [UpdateBucketInput],
        [Result_41],
        [],
      ),
    'validate_admin_add_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate_admin_add_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate_admin_remove_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate_admin_remove_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_41],
        [],
      ),
    'validate_admin_set_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_1],
        [],
      ),
    'validate_admin_set_custom_domains' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [Result_1],
        [],
      ),
    'validate_admin_set_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_1],
        [],
      ),
    'validate_admin_update_bucket' : IDL.Func(
        [UpdateBucketInput],
        [Result_1],
        [],
      ),
  });
};
export const init = ({ IDL }) => {
  const UpgradeArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'max_custom_data_size' : IDL.Opt(IDL.Nat16),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
  });
  const InitArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'max_custom_data_size' : IDL.Nat16,
    'max_children' : IDL.Nat16,
    'enable_hash_index' : IDL.Bool,
    'max_file_size' : IDL.Nat64,
    'visibility' : IDL.Nat8,
    'max_folder_depth' : IDL.Nat8,
    'file_id' : IDL.Nat32,
  });
  const CanisterArgs = IDL.Variant({
    'Upgrade' : UpgradeArgs,
    'Init' : InitArgs,
  });
  return [IDL.Opt(CanisterArgs)];
};

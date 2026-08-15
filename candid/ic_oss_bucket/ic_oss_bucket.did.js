export const idlFactory = ({ IDL }) => {
  const UpgradeArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'max_custom_data_size' : IDL.Opt(IDL.Nat16),
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
  });
  const InitArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'max_custom_data_size' : IDL.Nat16,
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
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
  const SetWebsiteConfigInput = IDL.Record({
    'root_name' : IDL.Opt(IDL.Text),
    'enabled' : IDL.Bool,
  });
  const WebsiteConfig = IDL.Record({
    'root_name' : IDL.Text,
    'enabled' : IDL.Bool,
    'folder_id' : IDL.Opt(IDL.Nat32),
  });
  const Result_5 = IDL.Variant({ 'Ok' : WebsiteConfig, 'Err' : IDL.Text });
  const TransferCyclesInput = IDL.Record({
    'to_canister' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const TransferCyclesOutput = IDL.Record({
    'transferred' : IDL.Nat,
    'remaining_balance' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({
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
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'visibility' : IDL.Opt(IDL.Nat8),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
    'trusted_ecdsa_pub_keys' : IDL.Opt(IDL.Vec(IDL.Vec(IDL.Nat8))),
  });
  const ContentSafetyPublicKey = IDL.Record({
    'public_key' : IDL.Vec(IDL.Nat8),
    'key_id' : IDL.Text,
    'not_before_ms' : IDL.Nat64,
    'expires_at_ms' : IDL.Nat64,
  });
  const ContentSafetyMode = IDL.Variant({
    'Required' : IDL.Null,
    'RuleOnly' : IDL.Null,
  });
  const ContentSafetyVerifierConfig = IDL.Record({
    'text_policy_version' : IDL.Text,
    'clock_skew_ms' : IDL.Nat64,
    'max_attestation_ttl_ms' : IDL.Nat64,
    'keys' : IDL.Vec(ContentSafetyPublicKey),
    'mode' : ContentSafetyMode,
    'policy_version' : IDL.Text,
  });
  const UpdateShareMessageSafetyInput = IDL.Record({
    'config' : IDL.Opt(ContentSafetyVerifierConfig),
  });
  const ShareMessageError = IDL.Variant({
    'Internal' : IDL.Text,
    'InvalidInput' : IDL.Text,
    'AnonymousNotAllowed' : IDL.Null,
    'Duplicate' : IDL.Null,
    'InboxFull' : IDL.Null,
    'ChannelClosed' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'SafetyCheckRequired' : IDL.Null,
    'SafetyCheckUnavailable' : IDL.Null,
    'SenderBlocked' : IDL.Null,
    'Unavailable' : IDL.Null,
    'ExternalAuthorizationUnavailable' : IDL.Null,
    'DailyLimitExceeded' : IDL.Null,
    'Conflict' : IDL.Text,
  });
  const Result_7 = IDL.Variant({
    'Ok' : IDL.Opt(ContentSafetyVerifierConfig),
    'Err' : ShareMessageError,
  });
  const UpsertReaderGrantInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'subject' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const ArchiveEncryptionZoneInput = IDL.Record({
    'zone_id' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Nat64,
  });
  const KeyProviderRef = IDL.Variant({
    'BucketVetkd' : IDL.Record({ 'bucket' : IDL.Principal }),
    'VaultVetkd' : IDL.Record({
      'vault' : IDL.Principal,
      'vault_id' : IDL.Vec(IDL.Nat8),
      'key_ref' : IDL.Vec(IDL.Nat8),
    }),
  });
  const ContentCipher = IDL.Variant({ 'XChaCha20Poly1305' : IDL.Null });
  const ZoneKeyProtection = IDL.Variant({
    'VetkdAndPassword' : IDL.Null,
    'VetkdOnly' : IDL.Null,
  });
  const ZoneKeyEnvelopeV1 = IDL.Record({
    'provider' : KeyProviderRef,
    'key_version' : IDL.Nat32,
    'cipher' : ContentCipher,
    'aad_hash' : IDL.Vec(IDL.Nat8),
    'protection' : ZoneKeyProtection,
    'version' : IDL.Nat16,
    'nonce' : IDL.Vec(IDL.Nat8),
    'wrapped_zwk' : IDL.Vec(IDL.Nat8),
  });
  const EncryptionZoneState = IDL.Variant({
    'PendingInitialization' : IDL.Null,
    'Active' : IDL.Null,
    'Archived' : IDL.Null,
  });
  const KeyPolicy = IDL.Variant({
    'VaultManaged' : IDL.Null,
    'OwnerOnly' : IDL.Null,
  });
  const EncryptionZone = IDL.Record({
    'root_folder_id' : IDL.Nat32,
    'updated_at' : IDL.Nat64,
    'key_envelopes' : IDL.Vec(ZoneKeyEnvelopeV1),
    'owner' : IDL.Principal,
    'created_at' : IDL.Nat64,
    'state' : EncryptionZoneState,
    'zone_id' : IDL.Vec(IDL.Nat8),
    'revision' : IDL.Nat64,
    'active_envelope' : IDL.Opt(IDL.Nat16),
    'parent_zone_id' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'policy' : KeyPolicy,
  });
  const Result_8 = IDL.Variant({ 'Ok' : EncryptionZone, 'Err' : SyncError });
  const MetadataValue = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const FileKeyEnvelopeV1 = IDL.Record({
    'cipher' : ContentCipher,
    'aad_hash' : IDL.Vec(IDL.Nat8),
    'version' : IDL.Nat16,
    'nonce' : IDL.Vec(IDL.Nat8),
    'wrapped_dek' : IDL.Vec(IDL.Nat8),
  });
  const EncryptionInfoV1 = IDL.Record({
    'nonce_prefix' : IDL.Vec(IDL.Nat8),
    'plaintext_size' : IDL.Nat64,
    'envelope' : FileKeyEnvelopeV1,
    'object_id' : IDL.Vec(IDL.Nat8),
    'cipher' : ContentCipher,
    'version' : IDL.Nat16,
    'plaintext_chunk_size' : IDL.Nat32,
    'zone_id' : IDL.Vec(IDL.Nat8),
  });
  const CreateFileInput = IDL.Record({
    'dek' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'status' : IDL.Opt(IDL.Int8),
    'content' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'custom' : IDL.Opt(IDL.Vec(IDL.Tuple(IDL.Text, MetadataValue))),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'size' : IDL.Opt(IDL.Nat64),
    'encryption' : IDL.Opt(EncryptionInfoV1),
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
  const Result_9 = IDL.Variant({ 'Ok' : CreateFileOutput, 'Err' : SyncError });
  const BatchCreateSmallFilesOutput = IDL.Record({
    'results' : IDL.Vec(Result_9),
  });
  const Result_10 = IDL.Variant({
    'Ok' : BatchCreateSmallFilesOutput,
    'Err' : SyncError,
  });
  const Result_11 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat32),
    'Err' : IDL.Text,
  });
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
  const Result_12 = IDL.Variant({
    'Ok' : EnsureFolderOutput,
    'Err' : SyncError,
  });
  const BatchEnsureFoldersOutput = IDL.Record({
    'results' : IDL.Vec(Result_12),
  });
  const Result_13 = IDL.Variant({
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
    'encryption' : IDL.Opt(EncryptionInfoV1),
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
  const Result_14 = IDL.Variant({
    'Ok' : BeginUploadOutput,
    'Err' : SyncError,
  });
  const CollectFolderShareGarbageOutput = IDL.Record({
    'remaining_shares' : IDL.Nat64,
    'remaining_replays' : IDL.Nat64,
    'removed_shares' : IDL.Nat16,
    'removed_replays' : IDL.Nat16,
  });
  const CollectGarbageInput = IDL.Record({ 'max_chunks' : IDL.Opt(IDL.Nat32) });
  const CollectGarbageOutput = IDL.Record({
    'removed_chunks' : IDL.Nat32,
    'remaining_items' : IDL.Nat64,
    'processed_chunks' : IDL.Nat32,
    'completed_items' : IDL.Nat32,
    'remaining_chunks' : IDL.Nat64,
  });
  const Result_15 = IDL.Variant({
    'Ok' : CollectGarbageOutput,
    'Err' : SyncError,
  });
  const CollectMarketListingGarbageOutput = IDL.Record({
    'removed_tickets' : IDL.Nat16,
    'remaining_tickets' : IDL.Nat64,
  });
  const CollectShareMessageGarbageOutput = IDL.Record({
    'remaining_messages' : IDL.Nat64,
    'removed_messages' : IDL.Nat16,
    'remaining_body_bytes' : IDL.Nat64,
  });
  const CommitUploadOutput = IDL.Record({
    'id' : IDL.Nat32,
    'created' : IDL.Bool,
    'committed_at' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'revision' : IDL.Nat64,
  });
  const Result_16 = IDL.Variant({
    'Ok' : CommitUploadOutput,
    'Err' : SyncError,
  });
  const FolderShareCredential = IDL.Record({
    'share_id' : IDL.Vec(IDL.Nat8),
    'secret' : IDL.Vec(IDL.Nat8),
  });
  const ConsumeMarketListingTicketInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'ticket' : IDL.Vec(IDL.Nat8),
    'credential' : FolderShareCredential,
    'bottle_id' : IDL.Nat64,
    'publisher' : IDL.Principal,
  });
  const ConsumedMarketListing = IDL.Record({
    'share_revision' : IDL.Nat64,
    'listing_manifest_revision' : IDL.Nat64,
    'bottle_id' : IDL.Nat64,
    'share_id' : IDL.Vec(IDL.Nat8),
    'publisher' : IDL.Principal,
    'channel_revision' : IDL.Nat64,
    'market' : IDL.Principal,
    'bucket' : IDL.Principal,
    'share_title' : IDL.Text,
    'share_expires_at_ms' : IDL.Nat64,
  });
  const MarketListingError = IDL.Variant({
    'Internal' : IDL.Text,
    'AlreadyConsumed' : IDL.Null,
    'InvalidInput' : IDL.Text,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'Unavailable' : IDL.Null,
    'LimitExceeded' : IDL.Text,
    'Expired' : IDL.Null,
    'Conflict' : IDL.Text,
  });
  const Result_17 = IDL.Variant({
    'Ok' : ConsumedMarketListing,
    'Err' : MarketListingError,
  });
  const CreateEncryptionZoneInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'root_folder_id' : IDL.Nat32,
    'zone_id' : IDL.Vec(IDL.Nat8),
    'parent_zone_id' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result_18 = IDL.Variant({ 'Ok' : CreateFileOutput, 'Err' : IDL.Text });
  const ShareAccessMode = IDL.Variant({
    'Authenticated' : IDL.Null,
    'AnyoneWithLink' : IDL.Null,
    'Principals' : IDL.Vec(IDL.Principal),
  });
  const CreateFolderShareInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'access' : ShareAccessMode,
    'title' : IDL.Text,
    'share_id' : IDL.Vec(IDL.Nat8),
    'root_folder' : IDL.Nat32,
    'secret_hash' : IDL.Vec(IDL.Nat8),
    'share_code_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'expires_at_ms' : IDL.Nat64,
  });
  const FolderShareStatus = IDL.Variant({
    'Active' : IDL.Null,
    'Revoked' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const FolderShare = IDL.Record({
    'status' : FolderShareStatus,
    'access' : ShareAccessMode,
    'title' : IDL.Text,
    'share_id' : IDL.Vec(IDL.Nat8),
    'updated_at_ms' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'root_folder' : IDL.Nat32,
    'revision' : IDL.Nat64,
    'revoked_at_ms' : IDL.Opt(IDL.Nat64),
    'expires_at_ms' : IDL.Nat64,
  });
  const FolderShareError = IDL.Variant({
    'Internal' : IDL.Text,
    'InvalidInput' : IDL.Text,
    'EncryptedZone' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unavailable' : IDL.Null,
    'LimitExceeded' : IDL.Text,
    'RangeOutOfBounds' : IDL.Text,
    'Conflict' : IDL.Text,
  });
  const Result_19 = IDL.Variant({
    'Ok' : FolderShare,
    'Err' : FolderShareError,
  });
  const DeleteEntryIfInput = IDL.Record({
    'id' : IDL.Nat32,
    'request_id' : IDL.Vec(IDL.Nat8),
    'kind' : EntryKind,
    'expected_parent' : IDL.Nat32,
    'expected_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'expected_revision' : IDL.Nat64,
  });
  const Result_20 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const ShareMessageKey = IDL.Variant({
    'DirectShare' : IDL.Record({
      'share_id' : IDL.Vec(IDL.Nat8),
      'sender' : IDL.Principal,
    }),
    'DriftBottle' : IDL.Record({
      'catch_id' : IDL.Nat64,
      'market' : IDL.Principal,
    }),
  });
  const ShareMessageMutationInput = IDL.Record({
    'key' : ShareMessageKey,
    'request_id' : IDL.Vec(IDL.Nat8),
  });
  const ShareMessageOriginView = IDL.Variant({
    'DirectShare' : IDL.Record({
      'share_id' : IDL.Vec(IDL.Nat8),
      'share_title' : IDL.Text,
    }),
    'DriftBottle' : IDL.Record({
      'bottle_id' : IDL.Nat64,
      'catch_id' : IDL.Nat64,
      'market' : IDL.Principal,
    }),
  });
  const OssShareMessage = IDL.Record({
    'key' : ShareMessageKey,
    'reported_at_ms' : IDL.Opt(IDL.Nat64),
    'report_reason' : IDL.Opt(IDL.Text),
    'body' : IDL.Opt(IDL.Text),
    'origin' : ShareMessageOriginView,
    'sender' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'sender_alias' : IDL.Text,
    'body_sha256' : IDL.Vec(IDL.Nat8),
    'moderation_policy_version' : IDL.Text,
    'retracted_at_ms' : IDL.Opt(IDL.Nat64),
    'deleted_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const Result_21 = IDL.Variant({
    'Ok' : OssShareMessage,
    'Err' : ShareMessageError,
  });
  const DeriveZoneKeyInput = IDL.Record({
    'expected_key_version' : IDL.Nat32,
    'zone_id' : IDL.Vec(IDL.Nat8),
    'transport_public_key' : IDL.Vec(IDL.Nat8),
  });
  const DerivedZoneKey = IDL.Record({
    'encrypted_key' : IDL.Vec(IDL.Nat8),
    'provider' : KeyProviderRef,
    'key_version' : IDL.Nat32,
    'public_key' : IDL.Vec(IDL.Nat8),
  });
  const Result_22 = IDL.Variant({ 'Ok' : DerivedZoneKey, 'Err' : SyncError });
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
    'website' : IDL.Opt(WebsiteConfig),
    'http_read_mode' : IDL.Opt(HttpReadMode),
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'total_files' : IDL.Nat64,
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
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
  const Result_23 = IDL.Variant({ 'Ok' : BucketInfo, 'Err' : IDL.Text });
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
  const Result_24 = IDL.Variant({
    'Ok' : CanisterStatusResult,
    'Err' : IDL.Text,
  });
  const BucketCapabilities = IDL.Record({
    'batch_operations' : IDL.Opt(IDL.Bool),
    'folder_shares' : IDL.Opt(IDL.Bool),
    'share_manifest' : IDL.Opt(IDL.Bool),
    'reader_grants' : IDL.Opt(IDL.Bool),
    'api_version' : IDL.Nat16,
    'bucket_vetkd' : IDL.Opt(IDL.Bool),
    'encryption_zones' : IDL.Opt(IDL.Bool),
    'incremental_gc' : IDL.Bool,
    'migration_state' : MigrationState,
    'file_favorites' : IDL.Opt(IDL.Bool),
    'share_messages_v1' : IDL.Opt(IDL.Bool),
    'encryption_format_version' : IDL.Opt(IDL.Nat16),
    'ensure_folder' : IDL.Bool,
    'storage_metrics' : IDL.Opt(IDL.Bool),
    'conditional_delete' : IDL.Bool,
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'unique_names' : IDL.Bool,
    'market_bottle_inbox' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
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
  const Result_25 = IDL.Variant({
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
  const Result_26 = IDL.Variant({
    'Ok' : IDL.Opt(EntryInfoV2),
    'Err' : SyncError,
  });
  const FolderName = IDL.Record({ 'id' : IDL.Nat32, 'name' : IDL.Text });
  const Result_27 = IDL.Variant({
    'Ok' : IDL.Vec(FolderName),
    'Err' : IDL.Text,
  });
  const Result_28 = IDL.Variant({
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
  const Result_29 = IDL.Variant({ 'Ok' : FileDescriptor, 'Err' : IDL.Text });
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
    'encryption' : IDL.Opt(EncryptionInfoV1),
    'content_type' : IDL.Text,
    'created_at' : IDL.Nat64,
    'filled' : IDL.Nat64,
    'chunks' : IDL.Nat32,
    'revision' : IDL.Nat64,
    'parent' : IDL.Nat32,
  });
  const Result_30 = IDL.Variant({ 'Ok' : FileInfo, 'Err' : IDL.Text });
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
  const Result_31 = IDL.Variant({ 'Ok' : FolderInfo, 'Err' : IDL.Text });
  const ShareMessageChannelKey = IDL.Variant({
    'DirectShare' : IDL.Vec(IDL.Nat8),
    'DriftBottle' : IDL.Record({
      'bottle_id' : IDL.Nat64,
      'market' : IDL.Principal,
    }),
  });
  const ShareMessageChannel = IDL.Record({
    'key' : ShareMessageChannelKey,
    'share_revision' : IDL.Opt(IDL.Nat64),
    'share_id' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'updated_at_ms' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'enabled' : IDL.Bool,
    'deadline_ms' : IDL.Opt(IDL.Nat64),
    'revision' : IDL.Nat64,
  });
  const Result_32 = IDL.Variant({
    'Ok' : ShareMessageChannel,
    'Err' : ShareMessageError,
  });
  const GcHealth = IDL.Record({
    'pending_chunks' : IDL.Nat64,
    'pending_items' : IDL.Nat64,
    'oldest_enqueued_at' : IDL.Opt(IDL.Nat64),
  });
  const Result_33 = IDL.Variant({ 'Ok' : GcHealth, 'Err' : SyncError });
  const MarketListingTicketView = IDL.Record({
    'share_revision' : IDL.Nat64,
    'market_request_id' : IDL.Vec(IDL.Nat8),
    'ticket' : IDL.Vec(IDL.Nat8),
    'share_id' : IDL.Vec(IDL.Nat8),
    'publisher' : IDL.Principal,
    'market' : IDL.Principal,
    'expires_at_ms' : IDL.Nat64,
  });
  const Result_34 = IDL.Variant({
    'Ok' : MarketListingTicketView,
    'Err' : MarketListingError,
  });
  const EncryptionProfile = IDL.Record({
    'updated_at' : IDL.Nat64,
    'root_zone_id' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at' : IDL.Nat64,
    'enabled' : IDL.Bool,
  });
  const Result_35 = IDL.Variant({
    'Ok' : IDL.Opt(EncryptionProfile),
    'Err' : SyncError,
  });
  const Result_36 = IDL.Variant({
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
    'vetkd_cycles_attached' : IDL.Opt(IDL.Nat),
    'encryption_zones' : IDL.Opt(IDL.Nat64),
    'vetkd_derive_attempts' : IDL.Opt(IDL.Nat64),
    'stable_memory_size' : IDL.Nat64,
    'cycles' : IDL.Opt(IDL.Nat),
    'vetkd_derive_in_flight' : IDL.Opt(IDL.Nat32),
    'vetkd_derive_rejections' : IDL.Opt(IDL.Nat64),
    'stable_memory_limit' : IDL.Nat64,
    'vetkd_derive_successes' : IDL.Opt(IDL.Nat64),
    'wasm_memory_size' : IDL.Nat64,
    'memory_allocation' : IDL.Nat64,
    'vetkd_derive_failures' : IDL.Opt(IDL.Nat64),
    'reserved_cycles' : IDL.Opt(IDL.Nat),
  });
  const Result_37 = IDL.Variant({
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
  const Result_38 = IDL.Variant({
    'Ok' : SubtreeManifestOutput,
    'Err' : SyncError,
  });
  const UploadHealth = IDL.Record({
    'active_sessions' : IDL.Nat64,
    'max_active_sessions' : IDL.Nat16,
  });
  const Result_39 = IDL.Variant({ 'Ok' : UploadHealth, 'Err' : SyncError });
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
  const Result_40 = IDL.Variant({
    'Ok' : UploadStatusOutput,
    'Err' : SyncError,
  });
  const SupportedStandard = IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text });
  const ConsentMessageMetadata = IDL.Record({
    'utc_offset_minutes' : IDL.Opt(IDL.Int16),
    'language' : IDL.Text,
  });
  const ConsentMessageDeviceSpec = IDL.Variant({
    'GenericDisplay' : IDL.Null,
    'FieldsDisplay' : IDL.Null,
  });
  const ConsentMessageSpec = IDL.Record({
    'metadata' : ConsentMessageMetadata,
    'device_spec' : IDL.Opt(ConsentMessageDeviceSpec),
  });
  const ConsentMessageRequest = IDL.Record({
    'arg' : IDL.Vec(IDL.Nat8),
    'method' : IDL.Text,
    'user_preferences' : ConsentMessageSpec,
  });
  const TextValue = IDL.Record({ 'content' : IDL.Text });
  const TokenAmount = IDL.Record({
    'decimals' : IDL.Nat8,
    'amount' : IDL.Nat64,
    'symbol' : IDL.Text,
  });
  const DurationSeconds = IDL.Record({ 'amount' : IDL.Nat64 });
  const ConsentValue = IDL.Variant({
    'Text' : TextValue,
    'TokenAmount' : TokenAmount,
    'TimestampSeconds' : DurationSeconds,
    'DurationSeconds' : DurationSeconds,
  });
  const ConsentMessage = IDL.Variant({
    'FieldsDisplayMessage' : IDL.Record({
      'fields' : IDL.Vec(IDL.Tuple(IDL.Text, ConsentValue)),
      'intent' : IDL.Text,
    }),
    'GenericDisplayMessage' : IDL.Text,
  });
  const ConsentInfo = IDL.Record({
    'metadata' : ConsentMessageMetadata,
    'consent_message' : ConsentMessage,
  });
  const ConsentErrorInfo = IDL.Record({ 'description' : IDL.Text });
  const ConsentError = IDL.Variant({
    'GenericError' : IDL.Record({
      'description' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'InsufficientPayment' : ConsentErrorInfo,
    'UnsupportedCanisterCall' : ConsentErrorInfo,
    'ConsentMessageUnavailable' : ConsentErrorInfo,
  });
  const ConsentMessageResponse = IDL.Variant({
    'Ok' : ConsentInfo,
    'Err' : ConsentError,
  });
  const InitializeEncryptionZoneKeyInput = IDL.Record({
    'envelope' : ZoneKeyEnvelopeV1,
    'zone_id' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Nat64,
  });
  const IssueMarketListingTicketInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'market_request_id' : IDL.Vec(IDL.Nat8),
    'share_id' : IDL.Vec(IDL.Nat8),
    'market' : IDL.Principal,
    'expected_share_revision' : IDL.Nat64,
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
  const Result_41 = IDL.Variant({
    'Ok' : ListEntriesOutput,
    'Err' : SyncError,
  });
  const ListFileFavoritesInput = IDL.Record({
    'cursor' : IDL.Opt(IDL.Nat32),
    'take' : IDL.Opt(IDL.Nat16),
  });
  const FileFavorite = IDL.Record({
    'entry' : IDL.Opt(EntryInfoV2),
    'favorited_at_ms' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const ListFileFavoritesOutput = IDL.Record({
    'favorites' : IDL.Vec(FileFavorite),
    'next' : IDL.Opt(IDL.Nat32),
  });
  const Result_42 = IDL.Variant({
    'Ok' : ListFileFavoritesOutput,
    'Err' : IDL.Text,
  });
  const Result_43 = IDL.Variant({ 'Ok' : IDL.Vec(FileInfo), 'Err' : IDL.Text });
  const ListFolderSharesInput = IDL.Record({
    'cursor' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'take' : IDL.Opt(IDL.Nat16),
    'include_inactive' : IDL.Opt(IDL.Bool),
  });
  const ListFolderSharesOutput = IDL.Record({
    'shares' : IDL.Vec(FolderShare),
    'next' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result_44 = IDL.Variant({
    'Ok' : IDL.Vec(FolderInfo),
    'Err' : IDL.Text,
  });
  const ShareMessageCursor = IDL.Record({
    'key' : ShareMessageKey,
    'reverse_created_at' : IDL.Nat64,
  });
  const ShareMessageOriginKind = IDL.Variant({
    'DirectShare' : IDL.Null,
    'DriftBottle' : IDL.Null,
  });
  const ListShareMessagesInput = IDL.Record({
    'include_deleted' : IDL.Opt(IDL.Bool),
    'cursor' : IDL.Opt(ShareMessageCursor),
    'origin' : IDL.Opt(ShareMessageOriginKind),
    'take' : IDL.Opt(IDL.Nat16),
  });
  const ListShareMessagesOutput = IDL.Record({
    'messages' : IDL.Vec(OssShareMessage),
    'next' : IDL.Opt(ShareMessageCursor),
  });
  const LookupFolderShareCodeInput = IDL.Record({
    'code_hash' : IDL.Vec(IDL.Nat8),
  });
  const LookupFolderShareCodeOutput = IDL.Record({
    'share_id' : IDL.Vec(IDL.Nat8),
  });
  const Result_45 = IDL.Variant({
    'Ok' : LookupFolderShareCodeOutput,
    'Err' : FolderShareError,
  });
  const MoveInput = IDL.Record({
    'id' : IDL.Nat32,
    'to' : IDL.Nat32,
    'from' : IDL.Nat32,
  });
  const UpdateFileOutput = IDL.Record({ 'updated_at' : IDL.Nat64 });
  const Result_46 = IDL.Variant({ 'Ok' : UpdateFileOutput, 'Err' : IDL.Text });
  const OAuthBeginInput = IDL.Record({
    'provider' : OAuthProvider,
    'redirect_uri' : IDL.Text,
  });
  const OAuthBeginOutput = IDL.Record({ 'authorization_url' : IDL.Text });
  const Result_47 = IDL.Variant({ 'Ok' : OAuthBeginOutput, 'Err' : IDL.Text });
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
  const Result_48 = IDL.Variant({
    'Ok' : OAuthCompleteOutput,
    'Err' : IDL.Text,
  });
  const ReadFileChunkInput = IDL.Record({
    'generation' : IDL.Nat64,
    'index' : IDL.Nat32,
    'file_id' : IDL.Nat32,
  });
  const Result_49 = IDL.Variant({ 'Ok' : IDL.Vec(IDL.Nat8), 'Err' : IDL.Text });
  const ReadFileRangeInput = IDL.Record({
    'generation' : IDL.Nat64,
    'offset' : IDL.Nat64,
    'length' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const RenewUploadOutput = IDL.Record({ 'expires_at' : IDL.Nat64 });
  const Result_50 = IDL.Variant({
    'Ok' : RenewUploadOutput,
    'Err' : SyncError,
  });
  const ReportShareMessageInput = IDL.Record({
    'key' : ShareMessageKey,
    'request_id' : IDL.Vec(IDL.Nat8),
    'reason' : IDL.Text,
  });
  const Result_51 = IDL.Variant({
    'Ok' : IDL.Opt(EncryptionZone),
    'Err' : SyncError,
  });
  const ResolvedEncryptionZone = IDL.Record({
    'zone' : IDL.Opt(EncryptionZone),
    'folder_id' : IDL.Nat32,
  });
  const Result_52 = IDL.Variant({
    'Ok' : IDL.Vec(ResolvedEncryptionZone),
    'Err' : SyncError,
  });
  const ResolveFolderShareInput = IDL.Record({
    'credential' : FolderShareCredential,
  });
  const SharedFolderInfo = IDL.Record({
    'id' : IDL.Nat32,
    'name' : IDL.Text,
    'revision' : IDL.Nat64,
  });
  const FolderShareView = IDL.Record({
    'access' : ShareAccessMode,
    'title' : IDL.Text,
    'share_id' : IDL.Vec(IDL.Nat8),
    'root_folder' : IDL.Nat32,
    'revision' : IDL.Nat64,
    'expires_at_ms' : IDL.Nat64,
  });
  const ResolveFolderShareOutput = IDL.Record({
    'root' : SharedFolderInfo,
    'messages_enabled' : IDL.Bool,
    'share' : FolderShareView,
  });
  const Result_53 = IDL.Variant({
    'Ok' : ResolveFolderShareOutput,
    'Err' : FolderShareError,
  });
  const RetryShareMessageConfirmationsOutput = IDL.Record({
    'attempted' : IDL.Nat16,
    'remaining' : IDL.Nat64,
    'confirmed' : IDL.Nat16,
  });
  const RevokeFolderShareInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'share_id' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Opt(IDL.Nat64),
  });
  const RotateFolderShareSecretInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'share_id' : IDL.Vec(IDL.Nat8),
    'secret_hash' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Opt(IDL.Nat64),
    'share_code_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const SetDriftBottleChannelInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'publisher' : IDL.Principal,
    'expected_channel_revision' : IDL.Nat64,
    'enabled' : IDL.Bool,
  });
  const Result_54 = IDL.Variant({
    'Ok' : ShareMessageChannel,
    'Err' : MarketListingError,
  });
  const SetFileFavoriteInput = IDL.Record({
    'favorite' : IDL.Bool,
    'file_id' : IDL.Nat32,
  });
  const SetFolderShareMessagesInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'share_id' : IDL.Vec(IDL.Nat8),
    'expected_channel_revision' : IDL.Opt(IDL.Nat64),
    'enabled' : IDL.Bool,
  });
  const SetShareMessageSenderBlockInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'blocked' : IDL.Bool,
    'sender' : IDL.Principal,
  });
  const Result_55 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : ShareMessageError });
  const ShareFileInput = IDL.Record({
    'credential' : FolderShareCredential,
    'file_id' : IDL.Nat32,
  });
  const Result_56 = IDL.Variant({
    'Ok' : FileDescriptor,
    'Err' : FolderShareError,
  });
  const ShareListEntriesInput = IDL.Record({
    'credential' : FolderShareCredential,
    'cursor' : IDL.Opt(EntryCursor),
    'take' : IDL.Opt(IDL.Nat16),
    'parent' : IDL.Nat32,
  });
  const SharedEntryInfo = IDL.Record({
    'id' : IDL.Nat32,
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'kind' : EntryKind,
    'name' : IDL.Text,
    'size' : IDL.Opt(IDL.Nat64),
    'generation' : IDL.Opt(IDL.Nat64),
    'content_type' : IDL.Opt(IDL.Text),
    'revision' : IDL.Nat64,
    'parent' : IDL.Nat32,
  });
  const ShareListEntriesOutput = IDL.Record({
    'next' : IDL.Opt(EntryCursor),
    'entries' : IDL.Vec(SharedEntryInfo),
    'parent_revision' : IDL.Nat64,
  });
  const Result_57 = IDL.Variant({
    'Ok' : ShareListEntriesOutput,
    'Err' : FolderShareError,
  });
  const ShareReadFileChunkInput = IDL.Record({
    'credential' : FolderShareCredential,
    'read' : ReadFileChunkInput,
  });
  const Result_58 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat8),
    'Err' : FolderShareError,
  });
  const ShareReadFileRangeInput = IDL.Record({
    'credential' : FolderShareCredential,
    'read' : ReadFileRangeInput,
  });
  const ShareSubtreeManifestInput = IDL.Record({
    'credential' : FolderShareCredential,
    'cursor' : IDL.Opt(SubtreeManifestCursor),
    'take' : IDL.Opt(IDL.Nat16),
  });
  const SharedManifestEntry = IDL.Record({
    'path' : IDL.Text,
    'entry' : SharedEntryInfo,
  });
  const ShareSubtreeManifestOutput = IDL.Record({
    'next' : IDL.Opt(SubtreeManifestCursor),
    'entries' : IDL.Vec(SharedManifestEntry),
    'revision' : IDL.Nat64,
  });
  const Result_59 = IDL.Variant({
    'Ok' : ShareSubtreeManifestOutput,
    'Err' : FolderShareError,
  });
  const ShareMessageOrigin = IDL.Variant({
    'DirectShare' : ResolveFolderShareInput,
    'DriftBottle' : IDL.Record({
      'bottle_id' : IDL.Nat64,
      'catch_id' : IDL.Nat64,
      'market' : IDL.Principal,
    }),
  });
  const SubmitShareMessageInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'body' : IDL.Text,
    'origin' : ShareMessageOrigin,
    'safety_attestation' : IDL.Opt(IDL.Vec(IDL.Nat8)),
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
  const Result_60 = IDL.Variant({
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
  const UpdateFolderShareInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'access' : IDL.Opt(ShareAccessMode),
    'title' : IDL.Opt(IDL.Text),
    'share_id' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Opt(IDL.Nat64),
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
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
  const Result_61 = IDL.Variant({
    'Ok' : UploadChunkOutput,
    'Err' : SyncError,
  });
  const Result_62 = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
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
    'admin_set_website_config' : IDL.Func(
        [SetWebsiteConfigInput],
        [Result_5],
        [],
      ),
    'admin_set_website_enabled' : IDL.Func([IDL.Bool], [Result_5], []),
    'admin_transfer_cycles' : IDL.Func([TransferCyclesInput], [Result_6], []),
    'admin_update_bucket' : IDL.Func([UpdateBucketInput], [Result_1], []),
    'admin_update_share_message_safety' : IDL.Func(
        [UpdateShareMessageSafetyInput],
        [Result_7],
        [],
      ),
    'admin_upsert_reader_grant' : IDL.Func(
        [UpsertReaderGrantInput],
        [Result_2],
        [],
      ),
    'api_version' : IDL.Func([], [IDL.Nat16], ['query']),
    'archive_encryption_zone' : IDL.Func(
        [ArchiveEncryptionZoneInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        [],
      ),
    'batch_create_small_files' : IDL.Func(
        [BatchCreateSmallFilesInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_10],
        [],
      ),
    'batch_delete_subfiles' : IDL.Func(
        [IDL.Nat32, IDL.Vec(IDL.Nat32), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_11],
        [],
      ),
    'batch_ensure_folders' : IDL.Func(
        [BatchEnsureFoldersInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_13],
        [],
      ),
    'begin_upload' : IDL.Func(
        [BeginUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_14],
        [],
      ),
    'collect_folder_share_garbage' : IDL.Func(
        [MigrateDirectoryStorageInput],
        [CollectFolderShareGarbageOutput],
        [],
      ),
    'collect_garbage' : IDL.Func(
        [CollectGarbageInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_15],
        [],
      ),
    'collect_market_listing_garbage' : IDL.Func(
        [MigrateDirectoryStorageInput],
        [CollectMarketListingGarbageOutput],
        [],
      ),
    'collect_share_message_garbage' : IDL.Func(
        [MigrateDirectoryStorageInput],
        [CollectShareMessageGarbageOutput],
        [],
      ),
    'commit_upload' : IDL.Func(
        [AbortUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_16],
        [],
      ),
    'consume_market_listing_ticket' : IDL.Func(
        [ConsumeMarketListingTicketInput],
        [Result_17],
        [],
      ),
    'create_child_encryption_zone' : IDL.Func(
        [CreateEncryptionZoneInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        [],
      ),
    'create_file' : IDL.Func(
        [CreateFileInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_18],
        [],
      ),
    'create_folder' : IDL.Func(
        [CreateFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_18],
        [],
      ),
    'create_folder_share' : IDL.Func([CreateFolderShareInput], [Result_19], []),
    'create_root_encryption_zone' : IDL.Func(
        [CreateEncryptionZoneInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        [],
      ),
    'delete_entry_if' : IDL.Func(
        [DeleteEntryIfInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result],
        [],
      ),
    'delete_file' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_20],
        [],
      ),
    'delete_folder' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_20],
        [],
      ),
    'delete_my_share_message' : IDL.Func(
        [ShareMessageMutationInput],
        [Result_21],
        [],
      ),
    'derive_zone_key' : IDL.Func(
        [DeriveZoneKeyInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_22],
        [],
      ),
    'ensure_folder' : IDL.Func(
        [EnsureFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_12],
        [],
      ),
    'get_bucket_info' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_23],
        ['query'],
      ),
    'get_canister_status' : IDL.Func([], [Result_24], []),
    'get_capabilities' : IDL.Func([], [BucketCapabilities], ['query']),
    'get_directory_storage_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_25],
        ['query'],
      ),
    'get_domain_config' : IDL.Func([], [DomainConfig], ['query']),
    'get_encryption_zone' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        ['query'],
      ),
    'get_entry' : IDL.Func(
        [GetEntryInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_26],
        ['query'],
      ),
    'get_file_ancestors' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_27],
        ['query'],
      ),
    'get_file_chunks' : IDL.Func(
        [IDL.Nat32, IDL.Nat32, IDL.Opt(IDL.Nat32), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_28],
        ['query'],
      ),
    'get_file_descriptor' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_29],
        ['query'],
      ),
    'get_file_favorite_ids' : IDL.Func([], [Result_11], ['query']),
    'get_file_info' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_30],
        ['query'],
      ),
    'get_file_info_by_hash' : IDL.Func(
        [IDL.Vec(IDL.Nat8), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_30],
        ['query'],
      ),
    'get_folder_ancestors' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_27],
        ['query'],
      ),
    'get_folder_info' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_31],
        ['query'],
      ),
    'get_folder_share' : IDL.Func([IDL.Vec(IDL.Nat8)], [Result_19], ['query']),
    'get_folder_share_message_channel' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [Result_32],
        ['query'],
      ),
    'get_gc_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_33],
        ['query'],
      ),
    'get_market_listing_ticket' : IDL.Func(
        [IDL.Vec(IDL.Nat8)],
        [Result_34],
        ['query'],
      ),
    'get_my_encryption_profile' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_35],
        ['query'],
      ),
    'get_my_reader_grant' : IDL.Func([], [Result_36], ['query']),
    'get_oauth_config' : IDL.Func([], [OAuthPublicConfig], ['query']),
    'get_share_message_safety_config' : IDL.Func(
        [],
        [IDL.Opt(ContentSafetyVerifierConfig)],
        ['query'],
      ),
    'get_storage_metrics' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_37],
        [],
      ),
    'get_subtree_manifest' : IDL.Func(
        [SubtreeManifestInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_38],
        ['query'],
      ),
    'get_upload_health' : IDL.Func(
        [IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_39],
        ['query'],
      ),
    'get_upload_status' : IDL.Func(
        [GetUploadStatusInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_40],
        ['query'],
      ),
    'icrc10_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(SupportedStandard)],
        ['query'],
      ),
    'icrc21_canister_call_consent_message' : IDL.Func(
        [ConsentMessageRequest],
        [ConsentMessageResponse],
        [],
      ),
    'initialize_encryption_zone_key' : IDL.Func(
        [InitializeEncryptionZoneKeyInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_8],
        [],
      ),
    'is_caller_controller' : IDL.Func([], [IDL.Bool], ['query']),
    'issue_market_listing_ticket' : IDL.Func(
        [IssueMarketListingTicketInput],
        [Result_34],
        [],
      ),
    'list_entries' : IDL.Func(
        [ListEntriesInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_41],
        ['query'],
      ),
    'list_file_favorites' : IDL.Func(
        [ListFileFavoritesInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_42],
        ['query'],
      ),
    'list_files' : IDL.Func(
        [
          IDL.Nat32,
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
        ],
        [Result_43],
        ['query'],
      ),
    'list_folder_shares' : IDL.Func(
        [ListFolderSharesInput],
        [ListFolderSharesOutput],
        ['query'],
      ),
    'list_folders' : IDL.Func(
        [
          IDL.Nat32,
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Nat32),
          IDL.Opt(IDL.Vec(IDL.Nat8)),
        ],
        [Result_44],
        ['query'],
      ),
    'list_my_share_messages' : IDL.Func(
        [ListShareMessagesInput],
        [ListShareMessagesOutput],
        ['query'],
      ),
    'lookup_folder_share_code' : IDL.Func(
        [LookupFolderShareCodeInput],
        [Result_45],
        ['query'],
      ),
    'move_file' : IDL.Func(
        [MoveInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_46],
        [],
      ),
    'move_folder' : IDL.Func(
        [MoveInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_46],
        [],
      ),
    'oauth_begin' : IDL.Func([OAuthBeginInput], [Result_47], []),
    'oauth_complete' : IDL.Func([OAuthCompleteInput], [Result_48], []),
    'read_file_chunk' : IDL.Func(
        [ReadFileChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_49],
        ['query'],
      ),
    'read_file_range' : IDL.Func(
        [ReadFileRangeInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_49],
        ['query'],
      ),
    'renew_upload' : IDL.Func(
        [AbortUploadInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_50],
        [],
      ),
    'report_share_message' : IDL.Func(
        [ReportShareMessageInput],
        [Result_21],
        [],
      ),
    'resolve_encryption_zone' : IDL.Func(
        [IDL.Nat32, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_51],
        ['query'],
      ),
    'resolve_encryption_zones' : IDL.Func(
        [IDL.Vec(IDL.Nat32), IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_52],
        ['query'],
      ),
    'resolve_folder_share' : IDL.Func(
        [ResolveFolderShareInput],
        [Result_53],
        ['query'],
      ),
    'retract_sent_share_message' : IDL.Func(
        [ShareMessageMutationInput],
        [Result_21],
        [],
      ),
    'retry_share_message_confirmations' : IDL.Func(
        [MigrateDirectoryStorageInput],
        [RetryShareMessageConfirmationsOutput],
        [],
      ),
    'revoke_folder_share' : IDL.Func([RevokeFolderShareInput], [Result_19], []),
    'rotate_folder_share_secret' : IDL.Func(
        [RotateFolderShareSecretInput],
        [Result_19],
        [],
      ),
    'set_drift_bottle_message_channel' : IDL.Func(
        [SetDriftBottleChannelInput],
        [Result_54],
        [],
      ),
    'set_file_favorite' : IDL.Func(
        [SetFileFavoriteInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_20],
        [],
      ),
    'set_folder_share_messages' : IDL.Func(
        [SetFolderShareMessagesInput],
        [Result_32],
        [],
      ),
    'set_share_message_sender_block' : IDL.Func(
        [SetShareMessageSenderBlockInput],
        [Result_55],
        [],
      ),
    'share_get_file_descriptor' : IDL.Func(
        [ShareFileInput],
        [Result_56],
        ['query'],
      ),
    'share_list_entries' : IDL.Func(
        [ShareListEntriesInput],
        [Result_57],
        ['query'],
      ),
    'share_read_file_chunk' : IDL.Func(
        [ShareReadFileChunkInput],
        [Result_58],
        ['query'],
      ),
    'share_read_file_range' : IDL.Func(
        [ShareReadFileRangeInput],
        [Result_58],
        ['query'],
      ),
    'share_subtree_manifest' : IDL.Func(
        [ShareSubtreeManifestInput],
        [Result_59],
        ['query'],
      ),
    'submit_share_message' : IDL.Func(
        [SubmitShareMessageInput],
        [Result_21],
        [],
      ),
    'update_file_chunk' : IDL.Func(
        [UpdateFileChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_60],
        [],
      ),
    'update_file_info' : IDL.Func(
        [UpdateFileInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_46],
        [],
      ),
    'update_folder_info' : IDL.Func(
        [UpdateFolderInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_46],
        [],
      ),
    'update_folder_share' : IDL.Func([UpdateFolderShareInput], [Result_19], []),
    'upload_chunk' : IDL.Func(
        [UploadChunkInput, IDL.Opt(IDL.Vec(IDL.Nat8))],
        [Result_61],
        [],
      ),
    'validate2_admin_set_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
        [],
      ),
    'validate2_admin_set_custom_domains' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [Result_62],
        [],
      ),
    'validate2_admin_set_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
        [],
      ),
    'validate2_admin_update_bucket' : IDL.Func(
        [UpdateBucketInput],
        [Result_62],
        [],
      ),
    'validate_admin_add_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
        [],
      ),
    'validate_admin_add_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
        [],
      ),
    'validate_admin_remove_auditors' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
        [],
      ),
    'validate_admin_remove_managers' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [Result_62],
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
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
    'max_children' : IDL.Opt(IDL.Nat16),
    'enable_hash_index' : IDL.Opt(IDL.Bool),
    'max_file_size' : IDL.Opt(IDL.Nat64),
    'max_folder_depth' : IDL.Opt(IDL.Nat8),
  });
  const InitArgs = IDL.Record({
    'governance_canister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'max_custom_data_size' : IDL.Nat16,
    'encryption_writes' : IDL.Opt(IDL.Bool),
    'vetkd_derivation' : IDL.Opt(IDL.Bool),
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

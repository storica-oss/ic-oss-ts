export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({ 'site_name' : IDL.Text });
  const RefundStatus = IDL.Variant({
    'Confirmed' : IDL.Null,
    'Requested' : IDL.Null,
    'Cancelled' : IDL.Null,
    'Submitted' : IDL.Null,
  });
  const RevenueAllocation = IDL.Record({
    'recipient' : IDL.Principal,
    'amount_e8s' : IDL.Nat64,
  });
  const Refund = IDL.Record({
    'id' : IDL.Nat64,
    'status' : RefundStatus,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'purchase_id' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'ledger_fee_e8s' : IDL.Opt(IDL.Nat64),
    'ledger' : IDL.Opt(IDL.Principal),
    'transfer_created_at_time' : IDL.Nat64,
    'buyer' : IDL.Principal,
    'idempotency_key' : IDL.Text,
    'allocation_reversals' : IDL.Vec(RevenueAllocation),
  });
  const Result = IDL.Variant({ 'Ok' : Refund, 'Err' : IDL.Text });
  const TranscodeJobStatus = IDL.Variant({
    'Queued' : IDL.Null,
    'Failed' : IDL.Null,
    'Ready' : IDL.Null,
    'Running' : IDL.Null,
    'AwaitingVerification' : IDL.Null,
    'Cancelled' : IDL.Null,
  });
  const SourceRetentionPolicy = IDL.Variant({
    'AllowOriginalDownload' : IDL.Null,
    'RetainOwnerOnly' : IDL.Null,
  });
  const BucketClass = IDL.Variant({
    'Protected' : IDL.Null,
    'Public' : IDL.Null,
  });
  const MediaVariantStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Ready' : IDL.Null,
    'Verifying' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const MediaVariantKind = IDL.Variant({
    'Poster' : IDL.Null,
    'Thumbnail' : IDL.Null,
    'Transcode' : IDL.Record({ 'profile' : IDL.Text }),
  });
  const MediaVariantSpec = IDL.Record({
    'height' : IDL.Opt(IDL.Nat32),
    'kind' : MediaVariantKind,
    'codec' : IDL.Text,
    'content_type' : IDL.Text,
    'label' : IDL.Text,
    'width' : IDL.Opt(IDL.Nat32),
    'bitrate_bps' : IDL.Opt(IDL.Nat64),
  });
  const MediaVariantCandidate = IDL.Record({
    'submitted_at_ms' : IDL.Nat64,
    'content_hash' : IDL.Vec(IDL.Nat8),
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'content_type' : IDL.Text,
    'bucket' : IDL.Principal,
    'submitted_by' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const MediaVariantVerification = IDL.Record({
    'height' : IDL.Opt(IDL.Nat32),
    'codec' : IDL.Text,
    'content_hash' : IDL.Vec(IDL.Nat8),
    'generation' : IDL.Nat64,
    'verified_at_ms' : IDL.Nat64,
    'verified_by' : IDL.Principal,
    'width' : IDL.Opt(IDL.Nat32),
    'bitrate_bps' : IDL.Opt(IDL.Nat64),
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const MediaVariantSubmission = IDL.Record({
    'attempt' : IDL.Nat16,
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const MediaVariant = IDL.Record({
    'last_error' : IDL.Opt(IDL.Text),
    'status' : MediaVariantStatus,
    'content_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'spec' : MediaVariantSpec,
    'asset_id' : IDL.Opt(IDL.Nat64),
    'candidate' : IDL.Opt(MediaVariantCandidate),
    'verification' : IDL.Opt(MediaVariantVerification),
    'submission' : IDL.Opt(MediaVariantSubmission),
  });
  const TranscodeJob = IDL.Record({
    'id' : IDL.Nat64,
    'source_generation' : IDL.Nat64,
    'last_error' : IDL.Opt(IDL.Text),
    'status' : TranscodeJobStatus,
    'source_retention' : SourceRetentionPolicy,
    'source_asset_id' : IDL.Nat64,
    'attempts' : IDL.Nat16,
    'security' : BucketClass,
    'updated_at_ms' : IDL.Nat64,
    'variants' : IDL.Vec(MediaVariant),
    'created_at_ms' : IDL.Nat64,
    'source_hash' : IDL.Vec(IDL.Nat8),
    'source_size' : IDL.Nat64,
    'worker' : IDL.Principal,
    'idempotency_key' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : TranscodeJob, 'Err' : IDL.Text });
  const Asset = IDL.Record({
    'id' : IDL.Nat64,
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'class' : BucketClass,
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'content_type' : IDL.Text,
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const Result_2 = IDL.Variant({ 'Ok' : Asset, 'Err' : IDL.Text });
  const PayoutStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Confirmed' : IDL.Null,
    'Submitted' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const Payout = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PayoutStatus,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'author' : IDL.Principal,
    'amount_e8s' : IDL.Nat64,
    'ledger_fee_e8s' : IDL.Opt(IDL.Nat64),
    'ledger' : IDL.Opt(IDL.Principal),
    'transfer_created_at_time' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_3 = IDL.Variant({ 'Ok' : Payout, 'Err' : IDL.Text });
  const ApiKeySummary = IDL.Record({
    'id' : IDL.Nat64,
    'last_used_at_ms' : IDL.Opt(IDL.Nat64),
    'name' : IDL.Text,
    'created_at_ms' : IDL.Nat64,
    'prefix' : IDL.Text,
    'revoked_at_ms' : IDL.Opt(IDL.Nat64),
    'expires_at_ms' : IDL.Nat64,
  });
  const ApiKeyCreated = IDL.Record({
    'token' : IDL.Text,
    'api_key' : ApiKeySummary,
  });
  const Result_4 = IDL.Variant({ 'Ok' : ApiKeyCreated, 'Err' : IDL.Text });
  const CreatePayoutInput = IDL.Record({
    'author' : IDL.Principal,
    'amount_e8s' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Vec(Result_3), 'Err' : IDL.Text });
  const CreateTranscodeJobInput = IDL.Record({
    'source_retention' : IDL.Opt(SourceRetentionPolicy),
    'source_asset_id' : IDL.Nat64,
    'variants' : IDL.Vec(MediaVariantSpec),
    'worker' : IDL.Principal,
    'idempotency_key' : IDL.Text,
  });
  const Purchase = IDL.Record({
    'id' : IDL.Nat64,
    'product_id' : IDL.Nat64,
    'available_at_ms' : IDL.Nat64,
    'rule_version' : IDL.Nat64,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'payment_intent_id' : IDL.Opt(IDL.Nat64),
    'ledger' : IDL.Opt(IDL.Principal),
    'transfer_created_at_time' : IDL.Opt(IDL.Nat64),
    'allocations' : IDL.Vec(RevenueAllocation),
    'buyer' : IDL.Principal,
  });
  const FinancialLedgerEntry = IDL.Variant({
    'Payout' : Payout,
    'Refund' : Refund,
    'Purchase' : Purchase,
  });
  const FinancialLedgerPage = IDL.Record({
    'entries' : IDL.Vec(FinancialLedgerEntry),
    'next_cursor' : IDL.Opt(IDL.Nat64),
  });
  const Result_6 = IDL.Variant({
    'Ok' : FinancialLedgerPage,
    'Err' : IDL.Text,
  });
  const CyclesStatus = IDL.Record({
    'cycles' : IDL.Nat,
    'measured_at_ms' : IDL.Nat64,
  });
  const Result_7 = IDL.Variant({ 'Ok' : CyclesStatus, 'Err' : IDL.Text });
  const RevenueShareRule = IDL.Record({
    'treasury_bps' : IDL.Nat16,
    'author_bps' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat16)),
    'version' : IDL.Nat64,
  });
  const Result_8 = IDL.Variant({
    'Ok' : IDL.Opt(RevenueShareRule),
    'Err' : IDL.Text,
  });
  const Result_9 = IDL.Variant({
    'Ok' : IDL.Vec(ApiKeySummary),
    'Err' : IDL.Text,
  });
  const AuthorProfile = IDL.Record({
    'bio' : IDL.Text,
    'principal' : IDL.Principal,
    'active' : IDL.Bool,
    'display_name' : IDL.Text,
  });
  const Result_10 = IDL.Variant({
    'Ok' : IDL.Vec(AuthorProfile),
    'Err' : IDL.Text,
  });
  const MembershipProduct = IDL.Record({
    'id' : IDL.Nat64,
    'active' : IDL.Bool,
    'name' : IDL.Text,
    'price_e8s' : IDL.Nat64,
    'duration_ms' : IDL.Opt(IDL.Nat64),
  });
  const Result_11 = IDL.Variant({
    'Ok' : IDL.Vec(MembershipProduct),
    'Err' : IDL.Text,
  });
  const OperationalState = IDL.Record({
    'writes_enabled' : IDL.Bool,
    'protected_reads_enabled' : IDL.Bool,
    'updated_at_ms' : IDL.Nat64,
    'purchases_enabled' : IDL.Bool,
    'version' : IDL.Nat64,
    'reason' : IDL.Text,
  });
  const Result_12 = IDL.Variant({
    'Ok' : IDL.Vec(OperationalState),
    'Err' : IDL.Text,
  });
  const TranscodeJobPage = IDL.Record({
    'jobs' : IDL.Vec(TranscodeJob),
    'next_cursor' : IDL.Opt(IDL.Nat64),
  });
  const Result_13 = IDL.Variant({ 'Ok' : TranscodeJobPage, 'Err' : IDL.Text });
  const PaymentStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Paid' : IDL.Null,
    'ReconcileRequired' : IDL.Null,
    'Processing' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const PaymentIntent = IDL.Record({
    'id' : IDL.Nat64,
    'status' : PaymentStatus,
    'product_id' : IDL.Nat64,
    'entitlement_duration_ms' : IDL.Opt(IDL.Nat64),
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'amount_e8s' : IDL.Nat64,
    'transfer_created_at_time' : IDL.Nat64,
    'buyer' : IDL.Principal,
    'expires_at_ms' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_14 = IDL.Variant({ 'Ok' : PaymentIntent, 'Err' : IDL.Text });
  const EntitlementStatus = IDL.Variant({
    'Revoking' : IDL.Null,
    'Active' : IDL.Null,
    'Provisioning' : IDL.Null,
    'Revoked' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const Entitlement = IDL.Record({
    'status' : EntitlementStatus,
    'subject' : IDL.Principal,
    'version' : IDL.Nat64,
    'expires_at_ms' : IDL.Opt(IDL.Nat64),
  });
  const Result_15 = IDL.Variant({ 'Ok' : Entitlement, 'Err' : IDL.Text });
  const PaymentReconciliationReport = IDL.Record({
    'scanned' : IDL.Nat16,
    'matched' : IDL.Nat16,
    'expired_without_transfer' : IDL.Nat16,
    'log_length' : IDL.Nat64,
    'next_cursor' : IDL.Nat64,
  });
  const Result_16 = IDL.Variant({
    'Ok' : PaymentReconciliationReport,
    'Err' : IDL.Text,
  });
  const TreasuryReconciliation = IDL.Record({
    'confirmed_ledger_fees_e8s' : IDL.Nat64,
    'ledger_balance_e8s' : IDL.Nat64,
    'confirmed_refunds_e8s' : IDL.Nat64,
    'unresolved_fee_records' : IDL.Nat64,
    'shortfall_e8s' : IDL.Nat64,
    'pending_payouts_e8s' : IDL.Nat64,
    'pending_refunds_e8s' : IDL.Nat64,
    'surplus_e8s' : IDL.Nat64,
    'book_balance_e8s' : IDL.Nat64,
    'gross_purchases_e8s' : IDL.Nat64,
    'confirmed_payouts_e8s' : IDL.Nat64,
  });
  const Result_17 = IDL.Variant({
    'Ok' : TreasuryReconciliation,
    'Err' : IDL.Text,
  });
  const Result_18 = IDL.Variant({ 'Ok' : Purchase, 'Err' : IDL.Text });
  const RegisterAssetInput = IDL.Record({
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'size' : IDL.Nat64,
    'generation' : IDL.Nat64,
    'content_type' : IDL.Text,
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const BucketStatus = IDL.Variant({
    'Draining' : IDL.Null,
    'Active' : IDL.Null,
    'Offline' : IDL.Null,
    'Provisioning' : IDL.Null,
  });
  const BucketRegistration = IDL.Record({
    'status' : BucketStatus,
    'class' : BucketClass,
    'label' : IDL.Text,
    'canister' : IDL.Principal,
  });
  const Result_19 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const ContentStatus = IDL.Variant({
    'Draft' : IDL.Null,
    'Archived' : IDL.Null,
    'Published' : IDL.Null,
  });
  const ContentKind = IDL.Variant({
    'Article' : IDL.Null,
    'Gallery' : IDL.Null,
    'Video' : IDL.Null,
  });
  const ContentVisibility = IDL.Variant({
    'PrivateLibrary' : IDL.Null,
    'Public' : IDL.Null,
    'OwnerOnly' : IDL.Null,
  });
  const Content = IDL.Record({
    'id' : IDL.Nat64,
    'status' : ContentStatus,
    'title' : IDL.Text,
    'body' : IDL.Text,
    'kind' : ContentKind,
    'assets' : IDL.Vec(IDL.Nat64),
    'slug' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'curation_weight' : IDL.Int16,
    'updated_at_ms' : IDL.Nat64,
    'cover_asset_id' : IDL.Opt(IDL.Nat64),
    'published_at_ms' : IDL.Opt(IDL.Nat64),
    'summary' : IDL.Text,
    'visibility' : ContentVisibility,
    'contributors' : IDL.Vec(IDL.Principal),
  });
  const Result_20 = IDL.Variant({ 'Ok' : Content, 'Err' : IDL.Text });
  const Result_21 = IDL.Variant({ 'Ok' : ApiKeySummary, 'Err' : IDL.Text });
  const Comment = IDL.Record({
    'id' : IDL.Nat64,
    'body' : IDL.Text,
    'content_id' : IDL.Nat64,
    'hidden' : IDL.Bool,
    'author' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'parent_id' : IDL.Opt(IDL.Nat64),
  });
  const Result_22 = IDL.Variant({ 'Ok' : Comment, 'Err' : IDL.Text });
  const FrontendOriginConfig = IDL.Record({
    'alternative_origins' : IDL.Vec(IDL.Text),
    'custom_domains' : IDL.Vec(IDL.Text),
    'canonical_origin' : IDL.Opt(IDL.Text),
  });
  const Result_23 = IDL.Variant({
    'Ok' : FrontendOriginConfig,
    'Err' : IDL.Text,
  });
  const VerifiedMediaRange = IDL.Record({
    'start_time_ms' : IDL.Nat64,
    'hash' : IDL.Vec(IDL.Nat8),
    'size' : IDL.Nat64,
    'offset' : IDL.Nat64,
    'duration_ms' : IDL.Nat64,
  });
  const MediaStreamManifest = IDL.Record({
    'initialization' : VerifiedMediaRange,
    'segments' : IDL.Vec(VerifiedMediaRange),
    'content_type' : IDL.Text,
    'asset_id' : IDL.Nat64,
    'duration_ms' : IDL.Nat64,
  });
  const Result_24 = IDL.Variant({
    'Ok' : MediaStreamManifest,
    'Err' : IDL.Text,
  });
  const SetOperationalStateInput = IDL.Record({
    'writes_enabled' : IDL.Bool,
    'protected_reads_enabled' : IDL.Bool,
    'purchases_enabled' : IDL.Bool,
    'reason' : IDL.Text,
  });
  const Result_25 = IDL.Variant({ 'Ok' : OperationalState, 'Err' : IDL.Text });
  const RevenueConfigurationInput = IDL.Record({
    'rule' : RevenueShareRule,
    'hold_ms' : IDL.Nat64,
  });
  const Result_26 = IDL.Variant({ 'Ok' : RevenueShareRule, 'Err' : IDL.Text });
  const SiteConfig = IDL.Record({
    'owner' : IDL.Principal,
    'site_name' : IDL.Text,
    'schema_version' : IDL.Nat16,
  });
  const Result_27 = IDL.Variant({ 'Ok' : SiteConfig, 'Err' : IDL.Text });
  const UpdateContentSettingsInput = IDL.Record({
    'kind' : ContentKind,
    'tags' : IDL.Vec(IDL.Text),
    'curation_weight' : IDL.Opt(IDL.Int16),
    'cover_asset_id' : IDL.Opt(IDL.Nat64),
    'summary' : IDL.Opt(IDL.Text),
    'visibility' : ContentVisibility,
  });
  const VerifyTranscodeOutputInput = IDL.Record({
    'height' : IDL.Opt(IDL.Nat32),
    'codec' : IDL.Text,
    'content_hash' : IDL.Vec(IDL.Nat8),
    'generation' : IDL.Nat64,
    'label' : IDL.Text,
    'width' : IDL.Opt(IDL.Nat32),
    'bitrate_bps' : IDL.Opt(IDL.Nat64),
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  const ApiFinishImageUploadInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'session_id' : IDL.Vec(IDL.Nat8),
    'bucket' : IDL.Principal,
  });
  const Result_28 = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const ApiAppendGalleryImagesInput = IDL.Record({
    'content_id' : IDL.Nat64,
    'asset_ids' : IDL.Vec(IDL.Nat64),
  });
  const ApiBeginImageUploadInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'name' : IDL.Text,
    'size' : IDL.Nat64,
    'content_type' : IDL.Text,
  });
  const ApiImageUploadSession = IDL.Record({
    'total_chunks' : IDL.Nat32,
    'session_id' : IDL.Vec(IDL.Nat8),
    'bucket' : IDL.Principal,
    'chunk_size' : IDL.Nat32,
    'expires_at' : IDL.Nat64,
    'file_id' : IDL.Nat32,
  });
  const Result_29 = IDL.Variant({
    'Ok' : ApiImageUploadSession,
    'Err' : IDL.Text,
  });
  const ApiCreateContentInput = IDL.Record({
    'title' : IDL.Text,
    'body' : IDL.Text,
    'kind' : ContentKind,
    'slug' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'cover_asset_id' : IDL.Opt(IDL.Nat64),
    'summary' : IDL.Text,
    'publish' : IDL.Bool,
    'asset_ids' : IDL.Vec(IDL.Nat64),
    'visibility' : ContentVisibility,
  });
  const ApiGallerySummary = IDL.Record({
    'id' : IDL.Nat64,
    'status' : ContentStatus,
    'title' : IDL.Text,
    'slug' : IDL.Text,
    'updated_at_ms' : IDL.Nat64,
    'asset_count' : IDL.Nat64,
  });
  const Result_30 = IDL.Variant({
    'Ok' : IDL.Vec(ApiGallerySummary),
    'Err' : IDL.Text,
  });
  const ApiUploadImageChunkInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'chunk_index' : IDL.Nat32,
    'content' : IDL.Vec(IDL.Nat8),
    'session_id' : IDL.Vec(IDL.Nat8),
    'bucket' : IDL.Principal,
  });
  const ApiUploadImageChunkOutput = IDL.Record({
    'filled' : IDL.Nat64,
    'expires_at' : IDL.Nat64,
    'uploaded_chunks' : IDL.Nat32,
  });
  const Result_31 = IDL.Variant({
    'Ok' : ApiUploadImageChunkOutput,
    'Err' : IDL.Text,
  });
  const CreateCommentInput = IDL.Record({
    'body' : IDL.Text,
    'content_id' : IDL.Nat64,
    'parent_id' : IDL.Opt(IDL.Nat64),
  });
  const CreateContentInput = IDL.Record({
    'title' : IDL.Text,
    'body' : IDL.Text,
    'kind' : IDL.Opt(ContentKind),
    'slug' : IDL.Text,
    'tags' : IDL.Opt(IDL.Vec(IDL.Text)),
    'cover_asset_id' : IDL.Opt(IDL.Nat64),
    'summary' : IDL.Opt(IDL.Text),
    'visibility' : ContentVisibility,
    'contributors' : IDL.Vec(IDL.Principal),
  });
  const CreatePaymentIntentInput = IDL.Record({
    'product_id' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_32 = IDL.Variant({
    'Ok' : RegisterAssetInput,
    'Err' : IDL.Text,
  });
  const GrantDeliveryStatus = IDL.Variant({
    'Applied' : IDL.Null,
    'Failed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const GrantDeliveryOperation = IDL.Variant({
    'Revoke' : IDL.Null,
    'Upsert' : IDL.Null,
  });
  const GrantDelivery = IDL.Record({
    'last_error' : IDL.Opt(IDL.Text),
    'status' : GrantDeliveryStatus,
    'subject' : IDL.Principal,
    'updated_at_ms' : IDL.Nat64,
    'operation' : GrantDeliveryOperation,
    'bucket' : IDL.Principal,
    'entitlement_version' : IDL.Nat64,
  });
  const CallerPermissions = IDL.Record({
    'can_manage' : IDL.Bool,
    'active_author' : IDL.Bool,
    'can_edit' : IDL.Bool,
  });
  const RevenueBalance = IDL.Record({
    'accrued_e8s' : IDL.Nat64,
    'reserved_e8s' : IDL.Nat64,
    'available_e8s' : IDL.Nat64,
    'pending_e8s' : IDL.Nat64,
    'debt_e8s' : IDL.Nat64,
  });
  const StorageLayoutStatus = IDL.Record({
    'active_generation' : IDL.Nat8,
    'persisted_record_count' : IDL.Nat64,
    'layout_version' : IDL.Nat16,
    'format' : IDL.Text,
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const StreamingCallbackToken = IDL.Record({ 'token' : IDL.Vec(IDL.Nat8) });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackHttpResponse],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'upgrade' : IDL.Opt(IDL.Bool),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const CommentPage = IDL.Record({
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'comments' : IDL.Vec(Comment),
  });
  const Result_33 = IDL.Variant({ 'Ok' : CommentPage, 'Err' : IDL.Text });
  const SubmitTranscodeOutputInput = IDL.Record({
    'label' : IDL.Text,
    'bucket' : IDL.Principal,
    'file_id' : IDL.Nat32,
  });
  return IDL.Service({
    'admin_cancel_refund' : IDL.Func([IDL.Nat64], [Result], []),
    'admin_cancel_transcode_job' : IDL.Func([IDL.Nat64], [Result_1], []),
    'admin_commit_bucket_asset' : IDL.Func(
        [IDL.Principal, IDL.Nat32],
        [Result_2],
        [],
      ),
    'admin_confirm_payout' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result_3], []),
    'admin_create_api_key' : IDL.Func([IDL.Text, IDL.Nat64], [Result_4], []),
    'admin_create_payout' : IDL.Func(
        [IDL.Principal, IDL.Nat64, IDL.Text],
        [Result_3],
        [],
      ),
    'admin_create_payout_batch' : IDL.Func(
        [IDL.Vec(CreatePayoutInput)],
        [Result_5],
        [],
      ),
    'admin_create_refund' : IDL.Func(
        [IDL.Nat64, IDL.Nat64, IDL.Text],
        [Result],
        [],
      ),
    'admin_create_transcode_job' : IDL.Func(
        [CreateTranscodeJobInput],
        [Result_1],
        [],
      ),
    'admin_execute_payout' : IDL.Func([IDL.Nat64], [Result_3], []),
    'admin_execute_payout_batch' : IDL.Func(
        [IDL.Vec(IDL.Nat64)],
        [Result_5],
        [],
      ),
    'admin_execute_refund' : IDL.Func([IDL.Nat64], [Result], []),
    'admin_export_financial_ledger' : IDL.Func(
        [IDL.Opt(IDL.Nat64), IDL.Nat16],
        [Result_6],
        ['query'],
      ),
    'admin_get_cycles_status' : IDL.Func([], [Result_7], ['query']),
    'admin_get_revenue_share_rule' : IDL.Func([], [Result_8], ['query']),
    'admin_list_api_keys' : IDL.Func([], [Result_9], ['query']),
    'admin_list_authors' : IDL.Func([], [Result_10], ['query']),
    'admin_list_membership_products' : IDL.Func([], [Result_11], ['query']),
    'admin_list_operational_events' : IDL.Func([], [Result_12], ['query']),
    'admin_list_transcode_jobs' : IDL.Func(
        [IDL.Opt(IDL.Nat64), IDL.Nat16],
        [Result_13],
        ['query'],
      ),
    'admin_mark_payment_paid' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_14],
        [],
      ),
    'admin_mark_payout_submitted' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_3],
        [],
      ),
    'admin_provision_entitlement' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [Result_15],
        [],
      ),
    'admin_reconcile_payments' : IDL.Func([IDL.Nat16], [Result_16], []),
    'admin_reconcile_treasury' : IDL.Func([], [Result_17], []),
    'admin_record_purchase' : IDL.Func(
        [IDL.Principal, IDL.Nat64, IDL.Nat64],
        [Result_18],
        [],
      ),
    'admin_register_asset' : IDL.Func([RegisterAssetInput], [Result_2], []),
    'admin_register_bucket' : IDL.Func([BucketRegistration], [Result_19], []),
    'admin_reorder_content_assets' : IDL.Func(
        [IDL.Nat64, IDL.Vec(IDL.Nat64)],
        [Result_20],
        [],
      ),
    'admin_revoke_api_key' : IDL.Func([IDL.Nat64], [Result_21], []),
    'admin_revoke_entitlement' : IDL.Func([IDL.Principal], [Result_15], []),
    'admin_set_comment_hidden' : IDL.Func(
        [IDL.Nat64, IDL.Bool],
        [Result_22],
        [],
      ),
    'admin_set_frontend_origin_config' : IDL.Func(
        [FrontendOriginConfig],
        [Result_23],
        [],
      ),
    'admin_set_media_manifest' : IDL.Func(
        [MediaStreamManifest],
        [Result_24],
        [],
      ),
    'admin_set_operational_state' : IDL.Func(
        [SetOperationalStateInput],
        [Result_25],
        [],
      ),
    'admin_set_payment_ledger' : IDL.Func(
        [IDL.Opt(IDL.Principal)],
        [Result_19],
        [],
      ),
    'admin_set_revenue_configuration' : IDL.Func(
        [RevenueConfigurationInput],
        [Result_26],
        [],
      ),
    'admin_set_revenue_hold_ms' : IDL.Func([IDL.Nat64], [Result_19], []),
    'admin_set_revenue_share_rule' : IDL.Func(
        [RevenueShareRule],
        [Result_26],
        [],
      ),
    'admin_set_test_entitlement' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [Result_15],
        [],
      ),
    'admin_transfer_ownership' : IDL.Func([IDL.Principal], [Result_27], []),
    'admin_update_content_settings' : IDL.Func(
        [IDL.Nat64, UpdateContentSettingsInput],
        [Result_20],
        [],
      ),
    'admin_upsert_author' : IDL.Func([AuthorProfile], [Result_19], []),
    'admin_upsert_membership_product' : IDL.Func(
        [MembershipProduct],
        [Result_19],
        [],
      ),
    'admin_verify_transcode_output' : IDL.Func(
        [IDL.Nat64, VerifyTranscodeOutputInput],
        [Result_1],
        [],
      ),
    'api_abort_image_upload' : IDL.Func(
        [IDL.Text, ApiFinishImageUploadInput],
        [Result_28],
        [],
      ),
    'api_abort_media_upload' : IDL.Func(
        [IDL.Text, ApiFinishImageUploadInput],
        [Result_28],
        [],
      ),
    'api_append_gallery_images' : IDL.Func(
        [IDL.Text, ApiAppendGalleryImagesInput],
        [Result_20],
        [],
      ),
    'api_begin_image_upload' : IDL.Func(
        [IDL.Text, ApiBeginImageUploadInput],
        [Result_29],
        [],
      ),
    'api_begin_media_upload' : IDL.Func(
        [IDL.Text, ApiBeginImageUploadInput],
        [Result_29],
        [],
      ),
    'api_create_content' : IDL.Func(
        [IDL.Text, ApiCreateContentInput],
        [Result_20],
        [],
      ),
    'api_finish_image_upload' : IDL.Func(
        [IDL.Text, ApiFinishImageUploadInput],
        [Result_2],
        [],
      ),
    'api_finish_media_upload' : IDL.Func(
        [IDL.Text, ApiFinishImageUploadInput],
        [Result_2],
        [],
      ),
    'api_list_galleries' : IDL.Func([IDL.Text], [Result_30], ['query']),
    'api_upload_image_chunk' : IDL.Func(
        [IDL.Text, ApiUploadImageChunkInput],
        [Result_31],
        [],
      ),
    'api_upload_media_chunk' : IDL.Func(
        [IDL.Text, ApiUploadImageChunkInput],
        [Result_31],
        [],
      ),
    'archive_content' : IDL.Func([IDL.Nat64], [Result_20], []),
    'attach_asset' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result_19], []),
    'create_comment' : IDL.Func([CreateCommentInput], [Result_22], []),
    'create_content' : IDL.Func([CreateContentInput], [Result_20], []),
    'create_payment_intent' : IDL.Func(
        [CreatePaymentIntentInput],
        [Result_14],
        [],
      ),
    'detach_asset' : IDL.Func([IDL.Nat64, IDL.Nat64], [Result_20], []),
    'get_asset_descriptor' : IDL.Func([IDL.Nat64], [Result_32], ['query']),
    'get_frontend_origin_config' : IDL.Func(
        [],
        [FrontendOriginConfig],
        ['query'],
      ),
    'get_media_manifest' : IDL.Func([IDL.Nat64], [Result_24], ['query']),
    'get_my_entitlement' : IDL.Func([], [IDL.Opt(Entitlement)], ['query']),
    'get_my_grant_deliveries' : IDL.Func(
        [],
        [IDL.Vec(GrantDelivery)],
        ['query'],
      ),
    'get_my_payment_intent' : IDL.Func([IDL.Nat64], [Result_14], ['query']),
    'get_my_payouts' : IDL.Func([], [IDL.Vec(Payout)], ['query']),
    'get_my_permissions' : IDL.Func([], [CallerPermissions], ['query']),
    'get_my_refunds' : IDL.Func([], [IDL.Vec(Refund)], ['query']),
    'get_my_revenue_balance' : IDL.Func([], [RevenueBalance], ['query']),
    'get_my_revenue_statement' : IDL.Func(
        [],
        [IDL.Vec(RevenueAllocation)],
        ['query'],
      ),
    'get_operational_state' : IDL.Func([], [OperationalState], ['query']),
    'get_payment_ledger' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'get_private_asset_descriptor' : IDL.Func(
        [IDL.Nat64],
        [Result_32],
        ['query'],
      ),
    'get_public_content' : IDL.Func([IDL.Text], [Result_20], ['query']),
    'get_revenue_hold_ms' : IDL.Func([], [IDL.Nat64], ['query']),
    'get_site_config' : IDL.Func([], [SiteConfig], ['query']),
    'get_storage_layout_status' : IDL.Func(
        [],
        [StorageLayoutStatus],
        ['query'],
      ),
    'get_transcode_job' : IDL.Func([IDL.Nat64], [Result_1], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'list_buckets' : IDL.Func([], [IDL.Vec(BucketRegistration)], ['query']),
    'list_comments' : IDL.Func([IDL.Nat64], [IDL.Vec(Comment)], ['query']),
    'list_comments_page' : IDL.Func(
        [IDL.Nat64, IDL.Opt(IDL.Nat64), IDL.Nat16],
        [Result_33],
        ['query'],
      ),
    'list_membership_products' : IDL.Func(
        [],
        [IDL.Vec(MembershipProduct)],
        ['query'],
      ),
    'list_visible_contents' : IDL.Func([], [IDL.Vec(Content)], ['query']),
    'pay_with_icp' : IDL.Func([IDL.Nat64], [Result_14], []),
    'publish_content' : IDL.Func([IDL.Nat64], [Result_20], []),
    'report_transcode_job_failure' : IDL.Func(
        [IDL.Nat64, IDL.Text],
        [Result_1],
        [],
      ),
    'retry_my_entitlement_delivery' : IDL.Func([], [Result_15], []),
    'retry_my_entitlement_provisioning' : IDL.Func([], [Result_15], []),
    'start_transcode_job' : IDL.Func([IDL.Nat64], [Result_1], []),
    'submit_transcode_output' : IDL.Func(
        [IDL.Nat64, SubmitTranscodeOutputInput],
        [Result_1],
        [],
      ),
    'update_content' : IDL.Func(
        [IDL.Nat64, CreateContentInput],
        [Result_20],
        [],
      ),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({ 'site_name' : IDL.Text });
  return [InitArgs];
};

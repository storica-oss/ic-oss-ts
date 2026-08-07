import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ApiAppendGalleryImagesInput {
  'content_id' : bigint,
  'asset_ids' : BigUint64Array | bigint[],
}
export interface ApiBeginImageUploadInput {
  'request_id' : Uint8Array | number[],
  'hash' : [] | [Uint8Array | number[]],
  'name' : string,
  'size' : bigint,
  'content_type' : string,
}
export interface ApiCreateContentInput {
  'title' : string,
  /**
   * Article bodies accept Markdown. Gallery and video bodies remain descriptions.
   */
  'body' : string,
  'kind' : ContentKind,
  'slug' : string,
  'tags' : Array<string>,
  'cover_asset_id' : [] | [bigint],
  'summary' : string,
  /**
   * Publish immediately after all existing media integrity checks pass.
   */
  'publish' : boolean,
  /**
   * Assets must already be registered in this Hub and match the visibility class.
   */
  'asset_ids' : BigUint64Array | bigint[],
  'visibility' : ContentVisibility,
}
export interface ApiFinishImageUploadInput {
  'request_id' : Uint8Array | number[],
  'session_id' : Uint8Array | number[],
  'bucket' : Principal,
}
export interface ApiGallerySummary {
  'id' : bigint,
  'status' : ContentStatus,
  'title' : string,
  'slug' : string,
  'updated_at_ms' : bigint,
  'asset_count' : bigint,
}
export interface ApiImageUploadSession {
  'total_chunks' : number,
  'session_id' : Uint8Array | number[],
  'bucket' : Principal,
  'chunk_size' : number,
  'expires_at' : bigint,
  'file_id' : number,
}
export interface ApiKeyCreated {
  /**
   * Returned once. Only its SHA3-256 digest is retained by the Hub.
   */
  'token' : string,
  'api_key' : ApiKeySummary,
}
export interface ApiKeySummary {
  'id' : bigint,
  'last_used_at_ms' : [] | [bigint],
  'name' : string,
  'created_at_ms' : bigint,
  'prefix' : string,
  'revoked_at_ms' : [] | [bigint],
  'expires_at_ms' : bigint,
}
export interface ApiUploadImageChunkInput {
  'request_id' : Uint8Array | number[],
  'chunk_index' : number,
  'content' : Uint8Array | number[],
  'session_id' : Uint8Array | number[],
  'bucket' : Principal,
}
export interface ApiUploadImageChunkOutput {
  'filled' : bigint,
  'expires_at' : bigint,
  'uploaded_chunks' : number,
}
export interface Asset {
  'id' : bigint,
  'hash' : [] | [Uint8Array | number[]],
  'class' : BucketClass,
  'size' : bigint,
  'generation' : bigint,
  'content_type' : string,
  'bucket' : Principal,
  'file_id' : number,
}
export interface AuthorProfile {
  'bio' : string,
  'principal' : Principal,
  'active' : boolean,
  'display_name' : string,
}
export type BucketClass = { 'Protected' : null } |
  { 'Public' : null };
export interface BucketRegistration {
  'status' : BucketStatus,
  'class' : BucketClass,
  'label' : string,
  'canister' : Principal,
}
export type BucketStatus = { 'Draining' : null } |
  { 'Active' : null } |
  { 'Offline' : null } |
  { 'Provisioning' : null };
export interface CallerPermissions {
  'can_manage' : boolean,
  'active_author' : boolean,
  'can_edit' : boolean,
}
export interface Comment {
  'id' : bigint,
  'body' : string,
  'content_id' : bigint,
  'hidden' : boolean,
  'author' : Principal,
  'created_at_ms' : bigint,
  'parent_id' : [] | [bigint],
}
export interface CommentPage {
  'next_cursor' : [] | [bigint],
  'comments' : Array<Comment>,
}
export interface Content {
  'id' : bigint,
  'status' : ContentStatus,
  'title' : string,
  'body' : string,
  'kind' : ContentKind,
  'assets' : BigUint64Array | bigint[],
  'slug' : string,
  'tags' : Array<string>,
  'curation_weight' : number,
  'updated_at_ms' : bigint,
  'cover_asset_id' : [] | [bigint],
  'published_at_ms' : [] | [bigint],
  'summary' : string,
  'visibility' : ContentVisibility,
  'contributors' : Array<Principal>,
}
export type ContentKind = { 'Article' : null } |
  { 'Gallery' : null } |
  { 'Video' : null };
export type ContentStatus = { 'Draft' : null } |
  { 'Archived' : null } |
  { 'Published' : null };
export type ContentVisibility = { 'PrivateLibrary' : null } |
  { 'Public' : null } |
  { 'OwnerOnly' : null };
export interface CreateCommentInput {
  'body' : string,
  'content_id' : bigint,
  'parent_id' : [] | [bigint],
}
export interface CreateContentInput {
  'title' : string,
  'body' : string,
  /**
   * Optional fields preserve wire compatibility with pre-metadata clients.
   */
  'kind' : [] | [ContentKind],
  'slug' : string,
  'tags' : [] | [Array<string>],
  'cover_asset_id' : [] | [bigint],
  'summary' : [] | [string],
  'visibility' : ContentVisibility,
  'contributors' : Array<Principal>,
}
export interface CreatePaymentIntentInput {
  'product_id' : bigint,
  'idempotency_key' : string,
}
export interface CreatePayoutInput {
  'author' : Principal,
  'amount_e8s' : bigint,
  'idempotency_key' : string,
}
export interface CreateTranscodeJobInput {
  'source_retention' : [] | [SourceRetentionPolicy],
  'source_asset_id' : bigint,
  'variants' : Array<MediaVariantSpec>,
  'worker' : Principal,
  'idempotency_key' : string,
}
export interface CyclesStatus { 'cycles' : bigint, 'measured_at_ms' : bigint }
export interface Entitlement {
  'status' : EntitlementStatus,
  'subject' : Principal,
  'version' : bigint,
  'expires_at_ms' : [] | [bigint],
}
export type EntitlementStatus = { 'Revoking' : null } |
  { 'Active' : null } |
  { 'Provisioning' : null } |
  { 'Revoked' : null } |
  { 'Expired' : null };
export type FinancialLedgerEntry = { 'Payout' : Payout } |
  { 'Refund' : Refund } |
  { 'Purchase' : Purchase };
export interface FinancialLedgerPage {
  'entries' : Array<FinancialLedgerEntry>,
  'next_cursor' : [] | [bigint],
}
export interface FrontendOriginConfig {
  /**
   * Other origins owned by this deployment that may request the canonical
   * derivation origin. Internet Identity caps this list at ten entries.
   */
  'alternative_origins' : Array<string>,
  /**
   * Domains served through the ICP custom-domain gateway and exposed by
   * `/.well-known/ic-domains`.
   */
  'custom_domains' : Array<string>,
  /**
   * Stable II principal derivation origin. Once real users exist, changing
   * this value changes their principals and must be treated as a migration.
   */
  'canonical_origin' : [] | [string],
}
export interface GrantDelivery {
  'last_error' : [] | [string],
  'status' : GrantDeliveryStatus,
  'subject' : Principal,
  'updated_at_ms' : bigint,
  'operation' : GrantDeliveryOperation,
  'bucket' : Principal,
  'entitlement_version' : bigint,
}
export type GrantDeliveryOperation = { 'Revoke' : null } |
  { 'Upsert' : null };
export type GrantDeliveryStatus = { 'Applied' : null } |
  { 'Failed' : null } |
  { 'Pending' : null };
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
}
export interface HttpResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<[string, string]>,
  'upgrade' : [] | [boolean],
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface InitArgs { 'site_name' : string }
export interface MediaStreamManifest {
  'initialization' : VerifiedMediaRange,
  'segments' : Array<VerifiedMediaRange>,
  'content_type' : string,
  'asset_id' : bigint,
  'duration_ms' : bigint,
}
export interface MediaVariant {
  'last_error' : [] | [string],
  'status' : MediaVariantStatus,
  'content_hash' : [] | [Uint8Array | number[]],
  'spec' : MediaVariantSpec,
  'asset_id' : [] | [bigint],
  'candidate' : [] | [MediaVariantCandidate],
  'verification' : [] | [MediaVariantVerification],
  'submission' : [] | [MediaVariantSubmission],
}
export interface MediaVariantCandidate {
  'submitted_at_ms' : bigint,
  'content_hash' : Uint8Array | number[],
  'size' : bigint,
  'generation' : bigint,
  'content_type' : string,
  'bucket' : Principal,
  'submitted_by' : Principal,
  'file_id' : number,
}
export type MediaVariantKind = { 'Poster' : null } |
  { 'Thumbnail' : null } |
  { 'Transcode' : { 'profile' : string } };
export interface MediaVariantSpec {
  'height' : [] | [number],
  'kind' : MediaVariantKind,
  'codec' : string,
  'content_type' : string,
  'label' : string,
  'width' : [] | [number],
  'bitrate_bps' : [] | [bigint],
}
export type MediaVariantStatus = { 'Failed' : null } |
  { 'Ready' : null } |
  { 'Verifying' : null } |
  { 'Pending' : null };
export interface MediaVariantSubmission {
  'attempt' : number,
  'bucket' : Principal,
  'file_id' : number,
}
export interface MediaVariantVerification {
  'height' : [] | [number],
  'codec' : string,
  'content_hash' : Uint8Array | number[],
  'generation' : bigint,
  'verified_at_ms' : bigint,
  'verified_by' : Principal,
  'width' : [] | [number],
  'bitrate_bps' : [] | [bigint],
  'bucket' : Principal,
  'file_id' : number,
}
export interface MembershipProduct {
  'id' : bigint,
  'active' : boolean,
  'name' : string,
  'price_e8s' : bigint,
  'duration_ms' : [] | [bigint],
}
export interface OperationalState {
  'writes_enabled' : boolean,
  'protected_reads_enabled' : boolean,
  'updated_at_ms' : bigint,
  'purchases_enabled' : boolean,
  'version' : bigint,
  'reason' : string,
}
export interface PaymentIntent {
  'id' : bigint,
  'status' : PaymentStatus,
  'product_id' : bigint,
  /**
   * Product duration is snapshotted; changing a product cannot alter an
   * already-created payment intent.
   */
  'entitlement_duration_ms' : [] | [bigint],
  'ledger_block' : [] | [bigint],
  'amount_e8s' : bigint,
  /**
   * Fixed at creation so retries are ICRC-2 idempotent, including after a
   * call timeout where the ledger outcome is unknown.
   */
  'transfer_created_at_time' : bigint,
  'buyer' : Principal,
  'expires_at_ms' : bigint,
  'idempotency_key' : string,
}
export interface PaymentReconciliationReport {
  'scanned' : number,
  'matched' : number,
  'expired_without_transfer' : number,
  'log_length' : bigint,
  'next_cursor' : bigint,
}
export type PaymentStatus = { 'Failed' : null } |
  { 'Paid' : null } |
  { 'ReconcileRequired' : null } |
  { 'Processing' : null } |
  { 'Pending' : null };
export interface Payout {
  'id' : bigint,
  'status' : PayoutStatus,
  'ledger_block' : [] | [bigint],
  'author' : Principal,
  'amount_e8s' : bigint,
  /**
   * Ledger fee fixed before the first transfer attempt. `None` only exists
   * for legacy or manually confirmed records whose fee is unknown.
   */
  'ledger_fee_e8s' : [] | [bigint],
  'ledger' : [] | [Principal],
  'transfer_created_at_time' : bigint,
  'idempotency_key' : string,
}
export type PayoutStatus = { 'Failed' : null } |
  { 'Confirmed' : null } |
  { 'Submitted' : null } |
  { 'Pending' : null };
export interface Purchase {
  'id' : bigint,
  'product_id' : bigint,
  /**
   * Revenue cannot be reserved for payout before this timestamp. Existing
   * pre-hold-period purchases decode as immediately available.
   */
  'available_at_ms' : bigint,
  'rule_version' : bigint,
  'ledger_block' : [] | [bigint],
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'payment_intent_id' : [] | [bigint],
  /**
   * Immutable settlement provenance. Legacy/manual records decode as None
   * and are reported as unverifiable by the production audit tool.
   */
  'ledger' : [] | [Principal],
  'transfer_created_at_time' : [] | [bigint],
  'allocations' : Array<RevenueAllocation>,
  'buyer' : Principal,
}
export interface Refund {
  'id' : bigint,
  'status' : RefundStatus,
  'ledger_block' : [] | [bigint],
  'purchase_id' : bigint,
  'amount_e8s' : bigint,
  /**
   * Ledger fee fixed before the first transfer attempt.
   */
  'ledger_fee_e8s' : [] | [bigint],
  'ledger' : [] | [Principal],
  'transfer_created_at_time' : bigint,
  'buyer' : Principal,
  'idempotency_key' : string,
  /**
   * Original revenue recipients are debited using the immutable Purchase
   * allocation proportions. Any integer remainder belongs to treasury.
   */
  'allocation_reversals' : Array<RevenueAllocation>,
}
export type RefundStatus = { 'Confirmed' : null } |
  { 'Requested' : null } |
  { 'Cancelled' : null } |
  { 'Submitted' : null };
export interface RegisterAssetInput {
  'hash' : [] | [Uint8Array | number[]],
  'size' : bigint,
  'generation' : bigint,
  'content_type' : string,
  'bucket' : Principal,
  'file_id' : number,
}
export type Result = { 'Ok' : Refund } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : TranscodeJob } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Array<AuthorProfile> } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : Array<MembershipProduct> } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : Array<OperationalState> } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : TranscodeJobPage } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : PaymentIntent } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : Entitlement } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : PaymentReconciliationReport } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : TreasuryReconciliation } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : Purchase } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : Asset } |
  { 'Err' : string };
export type Result_20 = { 'Ok' : Content } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : ApiKeySummary } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : Comment } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : FrontendOriginConfig } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : MediaStreamManifest } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : OperationalState } |
  { 'Err' : string };
export type Result_26 = { 'Ok' : RevenueShareRule } |
  { 'Err' : string };
export type Result_27 = { 'Ok' : SiteConfig } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : boolean } |
  { 'Err' : string };
export type Result_29 = { 'Ok' : ApiImageUploadSession } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : Payout } |
  { 'Err' : string };
export type Result_30 = { 'Ok' : Array<ApiGallerySummary> } |
  { 'Err' : string };
export type Result_31 = { 'Ok' : ApiUploadImageChunkOutput } |
  { 'Err' : string };
export type Result_32 = { 'Ok' : RegisterAssetInput } |
  { 'Err' : string };
export type Result_33 = { 'Ok' : CommentPage } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : ApiKeyCreated } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : Array<Result_3> } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : FinancialLedgerPage } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : CyclesStatus } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : [] | [RevenueShareRule] } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : Array<ApiKeySummary> } |
  { 'Err' : string };
export interface RevenueAllocation {
  'recipient' : Principal,
  'amount_e8s' : bigint,
}
export interface RevenueBalance {
  'accrued_e8s' : bigint,
  'reserved_e8s' : bigint,
  'available_e8s' : bigint,
  'pending_e8s' : bigint,
  'debt_e8s' : bigint,
}
export interface RevenueConfigurationInput {
  'rule' : RevenueShareRule,
  'hold_ms' : bigint,
}
export interface RevenueShareRule {
  'treasury_bps' : number,
  'author_bps' : Array<[Principal, number]>,
  'version' : bigint,
}
export interface SetOperationalStateInput {
  'writes_enabled' : boolean,
  'protected_reads_enabled' : boolean,
  'purchases_enabled' : boolean,
  'reason' : string,
}
export interface SiteConfig {
  'owner' : Principal,
  'site_name' : string,
  'schema_version' : number,
}
export type SourceRetentionPolicy = { 'AllowOriginalDownload' : null } |
  { 'RetainOwnerOnly' : null };
export interface StorageLayoutStatus {
  'active_generation' : number,
  /**
   * Records currently persisted across the active checkpoint and all
   * write-through maps. Heap-only collections join the next checkpoint.
   */
  'persisted_record_count' : bigint,
  'layout_version' : number,
  'format' : string,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array | number[],
}
/**
 * Retained in the response type so `http_request` remains wire-compatible
 * with the IC HTTP interface even though the embedded UI is currently small
 * enough to return in one response.
 */
export interface StreamingCallbackToken { 'token' : Uint8Array | number[] }
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export interface SubmitTranscodeOutputInput {
  'label' : string,
  'bucket' : Principal,
  'file_id' : number,
}
export interface TranscodeJob {
  'id' : bigint,
  'source_generation' : bigint,
  'last_error' : [] | [string],
  'status' : TranscodeJobStatus,
  'source_retention' : SourceRetentionPolicy,
  'source_asset_id' : bigint,
  'attempts' : number,
  'security' : BucketClass,
  'updated_at_ms' : bigint,
  'variants' : Array<MediaVariant>,
  'created_at_ms' : bigint,
  'source_hash' : Uint8Array | number[],
  'source_size' : bigint,
  'worker' : Principal,
  'idempotency_key' : string,
}
export interface TranscodeJobPage {
  'jobs' : Array<TranscodeJob>,
  'next_cursor' : [] | [bigint],
}
export type TranscodeJobStatus = { 'Queued' : null } |
  { 'Failed' : null } |
  { 'Ready' : null } |
  { 'Running' : null } |
  { 'AwaitingVerification' : null } |
  { 'Cancelled' : null };
export interface TreasuryReconciliation {
  'confirmed_ledger_fees_e8s' : bigint,
  'ledger_balance_e8s' : bigint,
  'confirmed_refunds_e8s' : bigint,
  'unresolved_fee_records' : bigint,
  'shortfall_e8s' : bigint,
  'pending_payouts_e8s' : bigint,
  'pending_refunds_e8s' : bigint,
  'surplus_e8s' : bigint,
  'book_balance_e8s' : bigint,
  'gross_purchases_e8s' : bigint,
  'confirmed_payouts_e8s' : bigint,
}
export interface UpdateContentSettingsInput {
  'kind' : ContentKind,
  'tags' : Array<string>,
  'curation_weight' : [] | [number],
  'cover_asset_id' : [] | [bigint],
  /**
   * Optional so clients compiled before curation metadata remain accepted.
   */
  'summary' : [] | [string],
  'visibility' : ContentVisibility,
}
export interface VerifiedMediaRange {
  'start_time_ms' : bigint,
  'hash' : Uint8Array | number[],
  'size' : bigint,
  'offset' : bigint,
  'duration_ms' : bigint,
}
export interface VerifyTranscodeOutputInput {
  'height' : [] | [number],
  'codec' : string,
  'content_hash' : Uint8Array | number[],
  'generation' : bigint,
  'label' : string,
  'width' : [] | [number],
  'bitrate_bps' : [] | [bigint],
  'bucket' : Principal,
  'file_id' : number,
}
export interface _SERVICE {
  'admin_cancel_refund' : ActorMethod<[bigint], Result>,
  'admin_cancel_transcode_job' : ActorMethod<[bigint], Result_1>,
  /**
   * Commits an Asset only after reading its immutable descriptor from the
   * registered Bucket.  The Hub must be configured as a Bucket Manager (or use
   * an equivalent service identity); browser-supplied size/hash/generation are
   * never trusted on this path.
   */
  'admin_commit_bucket_asset' : ActorMethod<[Principal, number], Result_2>,
  'admin_confirm_payout' : ActorMethod<[bigint, bigint], Result_3>,
  'admin_create_api_key' : ActorMethod<[string, bigint], Result_4>,
  'admin_create_payout' : ActorMethod<[Principal, bigint, string], Result_3>,
  /**
   * Reserves multiple author payouts in one update. Validation is independent
   * per entry, so an invalid or over-limit author does not roll back successful
   * reservations for other authors.
   */
  'admin_create_payout_batch' : ActorMethod<
    [Array<CreatePayoutInput>],
    Result_5
  >,
  'admin_create_refund' : ActorMethod<[bigint, bigint, string], Result>,
  'admin_create_transcode_job' : ActorMethod<
    [CreateTranscodeJobInput],
    Result_1
  >,
  /**
   * Sends an approved payout from the Hub treasury through ICRC-1. A call that
   * loses its response remains Submitted; retrying reuses its immutable memo and
   * timestamp, so the ledger returns Duplicate with the original block instead
   * of sending the author a second payment.
   */
  'admin_execute_payout' : ActorMethod<[bigint], Result_3>,
  /**
   * Executes up to 20 reserved payouts sequentially. Each result is retained
   * independently, making the operation safe to retry with the same payout IDs.
   */
  'admin_execute_payout_batch' : ActorMethod<
    [BigUint64Array | bigint[]],
    Result_5
  >,
  /**
   * Returns funds from the Hub treasury to the original Purchase buyer. Lost
   * responses are retried with the same memo and timestamp, so an ICRC ledger
   * resolves the transfer as Duplicate instead of paying twice.
   */
  'admin_execute_refund' : ActorMethod<[bigint], Result>,
  /**
   * Exports an immutable, globally ordered financial audit page. The cursor is
   * the last seen global record ID; at most 500 entries are returned per call.
   */
  'admin_export_financial_ledger' : ActorMethod<
    [[] | [bigint], number],
    Result_6
  >,
  'admin_get_cycles_status' : ActorMethod<[], Result_7>,
  'admin_get_revenue_share_rule' : ActorMethod<[], Result_8>,
  'admin_list_api_keys' : ActorMethod<[], Result_9>,
  'admin_list_authors' : ActorMethod<[], Result_10>,
  'admin_list_membership_products' : ActorMethod<[], Result_11>,
  'admin_list_operational_events' : ActorMethod<[], Result_12>,
  'admin_list_transcode_jobs' : ActorMethod<[[] | [bigint], number], Result_13>,
  'admin_mark_payment_paid' : ActorMethod<[bigint, bigint], Result_14>,
  'admin_mark_payout_submitted' : ActorMethod<[bigint, bigint], Result_3>,
  /**
   * Synchronizes a versioned Reader Grant to every active Protected Bucket.
   * The Hub must be configured as each Bucket's reader authority before this is
   * called.  A failed Bucket keeps the entitlement in Provisioning for retry.
   */
  'admin_provision_entitlement' : ActorMethod<
    [Principal, [] | [bigint]],
    Result_15
  >,
  'admin_reconcile_payments' : ActorMethod<[number], Result_16>,
  /**
   * Compares the Hub's internal purchase/refund/payout book with its default
   * ICRC-1 treasury account. The cross-canister observation is not an atomic
   * ledger snapshot, so callers should retry if payments are actively settling.
   */
  'admin_reconcile_treasury' : ActorMethod<[], Result_17>,
  'admin_record_purchase' : ActorMethod<[Principal, bigint, bigint], Result_18>,
  'admin_register_asset' : ActorMethod<[RegisterAssetInput], Result_2>,
  'admin_register_bucket' : ActorMethod<[BucketRegistration], Result_19>,
  'admin_reorder_content_assets' : ActorMethod<
    [bigint, BigUint64Array | bigint[]],
    Result_20
  >,
  'admin_revoke_api_key' : ActorMethod<[bigint], Result_21>,
  /**
   * Revokes a member without requiring a financial refund. Uses the same
   * versioned per-Bucket Saga as refund revocation, so stale grants cannot
   * overwrite the tombstone and partial delivery remains retryable.
   */
  'admin_revoke_entitlement' : ActorMethod<[Principal], Result_15>,
  'admin_set_comment_hidden' : ActorMethod<[bigint, boolean], Result_22>,
  'admin_set_frontend_origin_config' : ActorMethod<
    [FrontendOriginConfig],
    Result_23
  >,
  'admin_set_media_manifest' : ActorMethod<[MediaStreamManifest], Result_24>,
  'admin_set_operational_state' : ActorMethod<
    [SetOperationalStateInput],
    Result_25
  >,
  /**
   * Enables ICRC-2 collection into this Hub's default ICRC account. The Hub
   * principal is deliberately the treasury owner, so revenue is never routed
   * through a browser or a mutable external destination.
   */
  'admin_set_payment_ledger' : ActorMethod<[[] | [Principal]], Result_19>,
  /**
   * Atomically updates the revenue rule and refund hold used by future
   * Purchases, preventing a browser or network interruption from leaving a
   * half-applied financial configuration.
   */
  'admin_set_revenue_configuration' : ActorMethod<
    [RevenueConfigurationInput],
    Result_26
  >,
  /**
   * Configures how long newly collected revenue remains unavailable for author
   * payout. A non-zero hold leaves room for refund review before funds leave the
   * Hub treasury. The current value is snapshotted into every Purchase.
   */
  'admin_set_revenue_hold_ms' : ActorMethod<[bigint], Result_19>,
  'admin_set_revenue_share_rule' : ActorMethod<[RevenueShareRule], Result_26>,
  'admin_set_test_entitlement' : ActorMethod<
    [Principal, [] | [bigint]],
    Result_15
  >,
  'admin_transfer_ownership' : ActorMethod<[Principal], Result_27>,
  'admin_update_content_settings' : ActorMethod<
    [bigint, UpdateContentSettingsInput],
    Result_20
  >,
  'admin_upsert_author' : ActorMethod<[AuthorProfile], Result_19>,
  'admin_upsert_membership_product' : ActorMethod<
    [MembershipProduct],
    Result_19
  >,
  'admin_verify_transcode_output' : ActorMethod<
    [bigint, VerifyTranscodeOutputInput],
    Result_1
  >,
  'api_abort_image_upload' : ActorMethod<
    [string, ApiFinishImageUploadInput],
    Result_28
  >,
  'api_abort_media_upload' : ActorMethod<
    [string, ApiFinishImageUploadInput],
    Result_28
  >,
  /**
   * Adds uploaded images to an existing Public gallery. Published galleries
   * remain published after the same media-integrity checks succeed.
   */
  'api_append_gallery_images' : ActorMethod<
    [string, ApiAppendGalleryImagesInput],
    Result_20
  >,
  /**
   * Starts an image-only Hub-managed upload in the active Public Bucket.
   */
  'api_begin_image_upload' : ActorMethod<
    [string, ApiBeginImageUploadInput],
    Result_29
  >,
  /**
   * Starts a Hub-managed image or MP4 upload. The API Key never grants direct
   * Bucket authority; the Hub remains the only Bucket caller.
   */
  'api_begin_media_upload' : ActorMethod<
    [string, ApiBeginImageUploadInput],
    Result_29
  >,
  /**
   * Bearer-token content ingestion for integrations. Assets must already exist
   * in this Hub; publishing reuses the same media and storage-class checks as
   * the owner-facing workflow.
   */
  'api_create_content' : ActorMethod<
    [string, ApiCreateContentInput],
    Result_20
  >,
  /**
   * Commits an image upload and records its immutable descriptor as a Public
   * Asset. Repeated commits return the previously registered Asset.
   */
  'api_finish_image_upload' : ActorMethod<
    [string, ApiFinishImageUploadInput],
    Result_2
  >,
  /**
   * Commits an image or MP4 upload and records its immutable descriptor as a
   * Public Asset. Repeated commits return the previously registered Asset.
   */
  'api_finish_media_upload' : ActorMethod<
    [string, ApiFinishImageUploadInput],
    Result_2
  >,
  /**
   * Returns Public galleries visible to external publishers. The query validates
   * the token without mutating its last-used timestamp.
   */
  'api_list_galleries' : ActorMethod<[string], Result_30>,
  'api_upload_image_chunk' : ActorMethod<
    [string, ApiUploadImageChunkInput],
    Result_31
  >,
  'api_upload_media_chunk' : ActorMethod<
    [string, ApiUploadImageChunkInput],
    Result_31
  >,
  'archive_content' : ActorMethod<[bigint], Result_20>,
  'attach_asset' : ActorMethod<[bigint, bigint], Result_19>,
  'create_comment' : ActorMethod<[CreateCommentInput], Result_22>,
  'create_content' : ActorMethod<[CreateContentInput], Result_20>,
  'create_payment_intent' : ActorMethod<[CreatePaymentIntentInput], Result_14>,
  'detach_asset' : ActorMethod<[bigint, bigint], Result_20>,
  'get_asset_descriptor' : ActorMethod<[bigint], Result_32>,
  'get_frontend_origin_config' : ActorMethod<[], FrontendOriginConfig>,
  'get_media_manifest' : ActorMethod<[bigint], Result_24>,
  'get_my_entitlement' : ActorMethod<[], [] | [Entitlement]>,
  'get_my_grant_deliveries' : ActorMethod<[], Array<GrantDelivery>>,
  'get_my_payment_intent' : ActorMethod<[bigint], Result_14>,
  'get_my_payouts' : ActorMethod<[], Array<Payout>>,
  'get_my_permissions' : ActorMethod<[], CallerPermissions>,
  'get_my_refunds' : ActorMethod<[], Array<Refund>>,
  'get_my_revenue_balance' : ActorMethod<[], RevenueBalance>,
  'get_my_revenue_statement' : ActorMethod<[], Array<RevenueAllocation>>,
  'get_operational_state' : ActorMethod<[], OperationalState>,
  'get_payment_ledger' : ActorMethod<[], [] | [Principal]>,
  'get_private_asset_descriptor' : ActorMethod<[bigint], Result_32>,
  'get_public_content' : ActorMethod<[string], Result_20>,
  'get_revenue_hold_ms' : ActorMethod<[], bigint>,
  'get_site_config' : ActorMethod<[], SiteConfig>,
  'get_storage_layout_status' : ActorMethod<[], StorageLayoutStatus>,
  'get_transcode_job' : ActorMethod<[bigint], Result_1>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'list_buckets' : ActorMethod<[], Array<BucketRegistration>>,
  'list_comments' : ActorMethod<[bigint], Array<Comment>>,
  'list_comments_page' : ActorMethod<
    [bigint, [] | [bigint], number],
    Result_33
  >,
  'list_membership_products' : ActorMethod<[], Array<MembershipProduct>>,
  'list_visible_contents' : ActorMethod<[], Array<Content>>,
  /**
   * Collects an approved membership payment via ICRC-2. The caller must first
   * approve this Hub Canister as spender on the configured ledger. Repeating an
   * interrupted call uses the same memo and `created_at_time`, so the ledger
   * returns its original block instead of charging twice.
   */
  'pay_with_icp' : ActorMethod<[bigint], Result_14>,
  'publish_content' : ActorMethod<[bigint], Result_20>,
  'report_transcode_job_failure' : ActorMethod<[bigint, string], Result_1>,
  'retry_my_entitlement_delivery' : ActorMethod<[], Result_15>,
  /**
   * Retries a paid entitlement or refund revocation whose Bucket delivery was
   * interrupted. This never creates a newer version or changes expiry.
   */
  'retry_my_entitlement_provisioning' : ActorMethod<[], Result_15>,
  'start_transcode_job' : ActorMethod<[bigint], Result_1>,
  'submit_transcode_output' : ActorMethod<
    [bigint, SubmitTranscodeOutputInput],
    Result_1
  >,
  'update_content' : ActorMethod<[bigint, CreateContentInput], Result_20>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

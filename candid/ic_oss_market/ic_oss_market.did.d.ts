import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

/**
 * [Account](https://github.com/dfinity/ICRC-1/blob/main/standards/ICRC-3/README.md#value)
 * representation of ledgers supporting the ICRC-1 standard.
 */
export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export interface AdminBottleReportPage {
  'next' : [] | [Uint8Array | number[]],
  'items' : Array<AdminBottleReportView>,
}
export interface AdminBottleReportPageRequest {
  'cursor' : [] | [Uint8Array | number[]],
  'take' : [] | [number],
}
export interface AdminBottleReportView {
  'bottle_id' : bigint,
  'created_at_ms' : bigint,
  'reporter' : Principal,
  'reason' : string,
}
export interface AdminDashboard {
  'deployments' : DeploymentPage,
  'tools' : Array<OfficialTool>,
  'storage' : MarketStorageStatus,
  'orders' : OrderPage,
  'cycles' : MarketCyclesStatus,
  'withdrawals' : IcpWithdrawalPage,
  'updates' : PlatformUpdatePage,
  'domains' : MarketDomainConfig,
  'users' : UserSummaryPage,
  'config' : MarketConfig,
  'referral_withdrawals' : ReferralWithdrawalPage,
  'referral_rewards' : ReferralRewardPage,
}
export interface AdminSetDriftBottleStatusInput {
  'status' : DriftBottleStatus,
  'bottle_id' : bigint,
  'reason' : string,
}
export interface BeginToolAttachmentUploadInput {
  'tool' : UpsertOfficialToolInput,
  'content_type' : string,
  'file_name' : string,
  'expected_size' : bigint,
  'expected_sha256' : Uint8Array | number[],
}
export interface BeginWasmUploadInput {
  'expected_size' : bigint,
  'version' : string,
  'expected_sha256' : Uint8Array | number[],
  'release_notes' : string,
}
export interface BlockBottleParticipantInput {
  'request_id' : Uint8Array | number[],
  'blocked' : boolean,
  'participant' : Principal,
}
export interface BottleCatchPage {
  'next' : [] | [bigint],
  'items' : Array<BottleCatchView>,
}
export interface BottleCatchView {
  'message_target' : [] | [BottleMessageTarget],
  'listing_manifest_revision' : bigint,
  'bottle_revision' : bigint,
  'bottle_id' : bigint,
  'caught_at_ms' : bigint,
  'share' : BottleShareRef,
  'catch_id' : bigint,
  'introduction' : string,
  'publisher_alias' : string,
  'location' : [] | [UserSubmittedLocation],
}
export type BottleError = { 'Internal' : string } |
  { 'AlreadyDelivered' : null } |
  { 'DailyCatchLimitReached' : null } |
  { 'InvalidInput' : string } |
  { 'AnonymousNotAllowed' : null } |
  { 'PendingLimitReached' : null } |
  { 'NoEligibleBottleSampled' : null } |
  { 'DailyCreateLimitReached' : null } |
  { 'Disabled' : null } |
  { 'ExternalCallFailed' : string } |
  { 'ChannelClosed' : null } |
  { 'NotFound' : null } |
  { 'Unauthorized' : null } |
  { 'OwnerActiveLimitReached' : null } |
  { 'SafetyCheckRequired' : null } |
  { 'SafetyCheckUnavailable' : null } |
  { 'GlobalActiveLimitReached' : null } |
  { 'Unavailable' : null } |
  { 'PendingOperation' : null } |
  { 'PoolEmpty' : null } |
  { 'Conflict' : string } |
  { 'MessageWindowClosed' : null };
export interface BottleMessageTarget {
  'bottle_id' : bigint,
  'catch_id' : bigint,
  'deadline_ms' : bigint,
  'market' : Principal,
  'source_bucket' : Principal,
}
export interface BottleMutationInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'expected_revision' : bigint,
}
export interface BottleOwnerPage {
  'next' : [] | [bigint],
  'items' : Array<BottleOwnerView>,
}
export interface BottleOwnerView {
  'id' : bigint,
  'status' : DriftBottleStatus,
  'listing_manifest_revision' : bigint,
  'max_opens' : number,
  'message_channel_revision' : bigint,
  'share_id' : Uint8Array | number[],
  'messages_enabled' : boolean,
  'created_at_ms' : bigint,
  'introduction' : string,
  'source_bucket' : Principal,
  'revision' : bigint,
  'location' : [] | [UserSubmittedLocation],
  'successful_opens' : number,
  'active_until_ms' : bigint,
}
export interface BottlePageRequest {
  'cursor' : [] | [bigint],
  'take' : [] | [number],
}
export interface BottleQuotaView {
  'created' : number,
  'day_id' : bigint,
  'global_create_used' : number,
  'create_remaining' : number,
  'global_catch_limit' : number,
  'create_limit' : number,
  'resets_at_ms' : bigint,
  'global_create_limit' : number,
  'global_catch_used' : number,
  'catch_limit' : number,
  'global_create_remaining' : number,
  'caught' : number,
  'global_catch_remaining' : number,
  'catch_remaining' : number,
}
export interface BottleShareRef {
  'share_revision' : bigint,
  'credential' : FolderShareCredential,
  'bucket' : Principal,
}
export interface CollectDriftBottleGarbageInput { 'max_items' : [] | [number] }
export interface CollectDriftBottleGarbageOutput {
  'recovered_pending' : number,
  'removed_unique_catches' : number,
  'remaining_replays' : bigint,
  'removed_abuse_records' : number,
  'removed_bottle_tombstones' : number,
  'removed_catch_receipts' : number,
  'removed_delivery_reservations' : number,
  'expired_bottles' : number,
  'removed_daily_usage' : number,
  'removed_replays' : number,
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
export interface CreateDriftBottleInput {
  'request_id' : Uint8Array | number[],
  'credential' : FolderShareCredential,
  'max_opens' : number,
  'share_id' : Uint8Array | number[],
  'introduction' : string,
  'listing_ticket' : Uint8Array | number[],
  'bucket' : Principal,
  'location' : [] | [UserSubmittedLocation],
  'introduction_safety_attestation' : [] | [Uint8Array | number[]],
}
export interface CreateOrderInput {
  'name' : string,
  'deployment_target_id' : [] | [string],
  'idempotency_key' : string,
}
export interface DeliveryAuthorization {
  'bottle_id' : bigint,
  'reservation_expires_at_ms' : bigint,
  'sender' : Principal,
  'catch_id' : bigint,
  'body_sha256' : Uint8Array | number[],
  'source_bucket' : Principal,
}
export interface Deployment {
  'id' : bigint,
  'controller_checked_at_ms' : [] | [bigint],
  'last_error' : [] | [string],
  'status' : DeploymentStatus,
  'market_controller_status' : MarketControllerStatus,
  'version_id' : bigint,
  'owner' : Principal,
  'subnet_id' : [] | [Principal],
  'name' : string,
  'updated_at_ms' : bigint,
  'created_at_ms' : bigint,
  'canister' : [] | [Principal],
  'observed_module_hash' : [] | [Uint8Array | number[]],
  'deployment_target_id' : string,
}
export interface DeploymentPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<Deployment>,
}
export type DeploymentStatus = { 'Creating' : null } |
  { 'Failed' : null } |
  { 'Installing' : null } |
  { 'Active' : null } |
  { 'UpgradePending' : null };
export interface DeploymentTarget {
  'id' : string,
  'region' : string,
  'node_count' : number,
  'description_zh' : [] | [string],
  'topology_updated_at_ms' : bigint,
  /**
   * None creates on the Market canister's subnet. Some(id) uses the CMC.
   */
  'subnet_id' : [] | [Principal],
  'name' : string,
  'sort_order' : number,
  'description' : string,
  'region_zh' : [] | [string],
  'data_residency' : boolean,
  'enabled' : boolean,
  'name_zh' : [] | [string],
  'cost_multiplier_basis_points' : number,
  'country_count' : number,
}
export interface DriftBottleAdminPage {
  'next' : [] | [bigint],
  'items' : Array<DriftBottleAdminView>,
}
export interface DriftBottleAdminView {
  'owner' : Principal,
  'report_count' : number,
  'bottle' : BottleOwnerView,
}
export interface DriftBottleConfig {
  'auto_hide_report_threshold' : number,
  'content_safety' : [] | [ContentSafetyVerifierConfig],
  'bottle_ttl_ms' : bigint,
  'global_pending_limit' : number,
  'message_window_ms' : bigint,
  'active_per_owner_limit' : number,
  'enabled' : boolean,
  'global_daily_create_limit' : [] | [number],
  'daily_create_limit' : number,
  'global_daily_catch_limit' : [] | [number],
  'global_active_limit' : bigint,
  'daily_catch_limit' : number,
}
export type DriftBottleStatus = { 'Exhausted' : null } |
  { 'PendingValidation' : null } |
  { 'Active' : null } |
  { 'Withdrawn' : null } |
  { 'Hidden' : null } |
  { 'Purged' : null } |
  { 'Expired' : null };
export interface DriftBottleStorageStatus {
  'unique_catches' : bigint,
  'pending_operations' : number,
  'replay_records' : bigint,
  'bottles' : bigint,
  'payloads' : bigint,
  'active_bottles' : bigint,
  'delivery_reservations' : bigint,
  'catches' : bigint,
}
export interface DurationSeconds { 'amount' : bigint }
export interface FinishBottleMessageInput {
  'request_id' : Uint8Array | number[],
  'sender' : Principal,
  'catch_id' : bigint,
  'body_sha256' : Uint8Array | number[],
}
export interface FishDriftBottleInput { 'request_id' : Uint8Array | number[] }
export interface FolderShareCredential {
  'share_id' : Uint8Array | number[],
  'secret' : Uint8Array | number[],
}
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
export interface IcpWithdrawal {
  'id' : bigint,
  'to' : Account,
  'last_error' : [] | [string],
  'status' : IcpWithdrawalStatus,
  'completed_at_ms' : [] | [bigint],
  'ledger_block' : [] | [bigint],
  'fee_e8s' : bigint,
  'requested_by' : Principal,
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'ledger' : Principal,
  'transfer_created_at_time' : bigint,
  'idempotency_key' : string,
}
export interface IcpWithdrawalPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<IcpWithdrawal>,
}
export type IcpWithdrawalStatus = { 'Failed' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface InitArgs {
  'owner' : [] | [Principal],
  'create_price_e8s' : [] | [bigint],
  'deployment_cycles' : [] | [bigint],
  'upgrade_price_e8s' : [] | [bigint],
  'sales_enabled' : [] | [boolean],
  'payment_ledger' : [] | [Principal],
}
export interface MarketConfig {
  'deployment_targets' : Array<[string, DeploymentTarget]>,
  'custom_domains' : [] | [Array<string>],
  'referral_config' : [] | [ReferralConfig],
  'owner' : Principal,
  'create_price_e8s' : bigint,
  'deployment_cycles' : bigint,
  'admins' : Array<Principal>,
  'upgrade_price_e8s' : bigint,
  'sales_enabled' : boolean,
  'pending_owner' : [] | [Principal],
  'payment_ledger' : [] | [Principal],
}
export type MarketControllerStatus = { 'Missing' : null } |
  { 'Present' : null } |
  { 'Unreachable' : null } |
  { 'Unknown' : null };
export interface MarketCyclesStatus {
  'balance' : bigint,
  'reserved_deployment_cycles' : bigint,
  'available_deployment_slots' : bigint,
  'deployment_cycles' : bigint,
  'transferable_cycles' : bigint,
  'reserve_cycles' : bigint,
}
export interface MarketDomainConfig {
  'derivation_origin' : string,
  'custom_domains' : Array<string>,
  'canister_id' : Principal,
}
export interface MarketIcpRevenue {
  'withdrawable_e8s' : bigint,
  'ledger_fee_e8s' : bigint,
  'ledger' : Principal,
  'withdrawn_e8s' : bigint,
  'balance_e8s' : bigint,
  'referral_liability_e8s' : bigint,
  'market_account' : Account,
  'recorded_revenue_e8s' : bigint,
}
export interface MarketSalesReadiness {
  'blockers' : Array<SalesReadinessBlocker>,
  'available_deployment_slots' : bigint,
  'ready' : boolean,
}
export interface MarketStorageStatus {
  'tool_attachment_bytes' : bigint,
  'previous_snapshot_bytes' : bigint,
  'wasm_versions' : bigint,
  'active_generation' : number,
  'pending_upload_bytes' : bigint,
  'wasm_bytes' : bigint,
  'active_snapshot_bytes' : bigint,
  'layout_version' : number,
  'pending_tool_upload_bytes' : bigint,
  'tool_attachments' : bigint,
}
export interface MarketUpgradeReadiness {
  'processing_orders' : bigint,
  'provisioning_orders' : bigint,
  'pending_withdrawals' : bigint,
  /**
   * Optional keeps the pre-referral readiness response upgrade-compatible.
   */
  'pending_referral_withdrawals' : [] | [bigint],
  'refunding_orders' : bigint,
  'paid_orders' : bigint,
  'ready' : boolean,
}
export interface MyDashboard {
  'deployments' : DeploymentPage,
  'principal' : Principal,
  'referral' : [] | [ReferralSummary],
  'is_admin' : boolean,
  'orders' : OrderPage,
  'upgrades' : UpgradePage,
  'referral_withdrawals' : ReferralWithdrawalPage,
  'referral_rewards' : ReferralRewardPage,
}
export interface OfficialTool {
  'id' : bigint,
  'homepage_url' : [] | [string],
  'featured' : boolean,
  'documentation_url' : [] | [string],
  'description_zh' : [] | [string],
  'external_url' : [] | [string],
  'kind' : ToolKind,
  'published' : boolean,
  'name' : string,
  'slug' : string,
  'sort_order' : number,
  'description' : string,
  'updated_at_ms' : bigint,
  'created_by' : Principal,
  'created_at_ms' : bigint,
  'version' : string,
  'summary' : string,
  'platforms' : Array<string>,
  'summary_zh' : [] | [string],
  'name_zh' : [] | [string],
  'attachment' : [] | [ToolAttachment],
}
export type OperationKind = { 'Upgrade' : null } |
  { 'Create' : null };
export interface Order {
  'id' : bigint,
  'last_error' : [] | [string],
  'status' : OrderStatus,
  'requested_name' : [] | [string],
  'referrer' : [] | [Principal],
  'refunded_at_ms' : [] | [bigint],
  'kind' : OperationKind,
  'ledger_block' : [] | [bigint],
  'target_subnet_id' : [] | [Principal],
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'referral_discount_e8s' : [] | [bigint],
  'deployment_cycles' : [] | [bigint],
  'transfer_created_at_time' : bigint,
  'provisioning_started_at_ms' : [] | [bigint],
  'refund_block' : [] | [bigint],
  'refund_transfer_created_at_time' : [] | [bigint],
  'buyer' : Principal,
  'target_version_id' : bigint,
  'deployment_target_id' : string,
  'referral_reward_e8s' : [] | [bigint],
  'referral_reward_id' : [] | [bigint],
  'expires_at_ms' : bigint,
  'deployment_id' : [] | [bigint],
  'idempotency_key' : string,
  'payment_ledger' : [] | [Principal],
}
export interface OrderPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<Order>,
}
export type OrderStatus = { 'Refunding' : null } |
  { 'Failed' : null } |
  { 'Refunded' : null } |
  { 'Paid' : null } |
  { 'Processing' : null } |
  { 'Provisioning' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface OssAccess {
  'market_controller' : Principal,
  'controllers' : Array<Principal>,
  'managers' : Array<Principal>,
  'canister' : Principal,
  'deployment_id' : bigint,
}
export interface PageRequest { 'cursor' : [] | [bigint], 'limit' : number }
export interface PlatformUpdate {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'content_zh' : [] | [string],
  'kind' : PlatformUpdateKind,
  'published' : boolean,
  'slug' : string,
  'updated_at_ms' : bigint,
  'created_by' : Principal,
  'published_at_ms' : [] | [bigint],
  'created_at_ms' : bigint,
  'version' : [] | [string],
  'summary' : string,
  'summary_zh' : [] | [string],
  'title_zh' : [] | [string],
}
export type PlatformUpdateKind = { 'Release' : null } |
  { 'Announcement' : null } |
  { 'Security' : null } |
  { 'Maintenance' : null } |
  { 'Feature' : null };
export interface PlatformUpdatePage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<PlatformUpdate>,
}
export interface PublicConfig {
  'deployment_targets' : Array<DeploymentTarget>,
  /**
   * Optional keeps pre-referral canisters decodable during a rolling upgrade.
   */
  'referral_config' : [] | [ReferralConfig],
  'available_deployment_slots' : bigint,
  'create_price_e8s' : bigint,
  'upgrade_price_e8s' : bigint,
  'latest_version' : [] | [WasmVersionSummary],
  'sales_enabled' : boolean,
  'payment_ledger' : [] | [Principal],
}
export interface PublicDashboard {
  'tools' : Array<OfficialTool>,
  'sales_readiness' : MarketSalesReadiness,
  'updates' : PlatformUpdatePage,
  'config' : PublicConfig,
  'versions' : WasmVersionPage,
}
export interface ReferralAccount {
  'reward_ledger' : [] | [Principal],
  'principal' : Principal,
  'code' : string,
  'referred_by' : [] | [Principal],
  'total_earned_e8s' : bigint,
  'created_at_ms' : bigint,
  'available_reward_e8s' : bigint,
  'referred_at_ms' : [] | [bigint],
  'total_withdrawn_e8s' : bigint,
  'qualified_order_id' : [] | [bigint],
  'discount_order_id' : [] | [bigint],
}
export interface ReferralConfig {
  'withdrawal_threshold_e8s' : bigint,
  'inviter_reward_e8s' : bigint,
  'enabled' : boolean,
  'new_user_discount_e8s' : bigint,
}
export interface ReferralReward {
  'id' : bigint,
  'referred_user' : Principal,
  'inviter' : Principal,
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'ledger' : Principal,
  'order_id' : bigint,
}
export interface ReferralRewardPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<ReferralReward>,
}
export interface ReferralSummary {
  'account' : ReferralAccount,
  'config' : ReferralConfig,
  'invited_count' : bigint,
  'qualified_count' : bigint,
}
export interface ReferralWithdrawal {
  'id' : bigint,
  'to' : Account,
  'last_error' : [] | [string],
  'status' : IcpWithdrawalStatus,
  'owner' : Principal,
  'completed_at_ms' : [] | [bigint],
  'ledger_block' : [] | [bigint],
  'fee_e8s' : bigint,
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'ledger' : Principal,
  'transfer_created_at_time' : bigint,
  'idempotency_key' : string,
}
export interface ReferralWithdrawalPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<ReferralWithdrawal>,
}
export interface RefreshDriftBottleShareInput {
  'request_id' : Uint8Array | number[],
  'credential' : FolderShareCredential,
  'bottle_id' : bigint,
  'listing_ticket' : Uint8Array | number[],
  'expected_revision' : bigint,
}
export interface ReportBottleInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'reason' : string,
}
export interface ReserveBottleMessageInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'sender' : Principal,
  'catch_id' : bigint,
  'body_sha256' : Uint8Array | number[],
  'safety_attestation' : [] | [Uint8Array | number[]],
}
export type Result = { 'Ok' : null } |
  { 'Err' : BottleError };
export type Result_1 = { 'Ok' : MarketConfig } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : MarketUpgradeReadiness } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : Array<Deployment> } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : DeploymentPage } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : AdminBottleReportPage } |
  { 'Err' : BottleError };
export type Result_14 = { 'Ok' : DriftBottleAdminPage } |
  { 'Err' : BottleError };
export type Result_15 = { 'Ok' : IcpWithdrawalPage } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : Array<OfficialTool> } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : Array<Order> } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : OrderPage } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : PlatformUpdatePage } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_20 = { 'Ok' : ReferralRewardPage } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : ReferralWithdrawalPage } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : Array<UserSummary> } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : UserSummaryPage } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : Order } |
  { 'Err' : string };
export type Result_25 = { 'Ok' : MarketDomainConfig } |
  { 'Err' : string };
export type Result_26 = { 'Ok' : BottleOwnerView } |
  { 'Err' : BottleError };
export type Result_27 = { 'Ok' : TransferMarketCyclesOutput } |
  { 'Err' : string };
export type Result_28 = { 'Ok' : DriftBottleConfig } |
  { 'Err' : BottleError };
export type Result_29 = { 'Ok' : ReferralConfig } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : OfficialTool } |
  { 'Err' : string };
export type Result_30 = { 'Ok' : DeploymentTarget } |
  { 'Err' : string };
export type Result_31 = { 'Ok' : PlatformUpdate } |
  { 'Err' : string };
export type Result_32 = { 'Ok' : IcpWithdrawal } |
  { 'Err' : string };
export type Result_33 = { 'Ok' : ReferralSummary } |
  { 'Err' : string };
export type Result_34 = { 'Ok' : CollectDriftBottleGarbageOutput } |
  { 'Err' : BottleError };
export type Result_35 = { 'Ok' : Deployment } |
  { 'Err' : string };
export type Result_36 = { 'Ok' : BottleCatchView } |
  { 'Err' : BottleError };
export type Result_37 = { 'Ok' : AdminDashboard } |
  { 'Err' : string };
export type Result_38 = { 'Ok' : MyDashboard } |
  { 'Err' : string };
export type Result_39 = { 'Ok' : BottleQuotaView } |
  { 'Err' : BottleError };
export type Result_4 = { 'Ok' : WasmVersionSummary } |
  { 'Err' : string };
export type Result_40 = { 'Ok' : OssAccess } |
  { 'Err' : string };
export type Result_41 = { 'Ok' : [Principal, boolean] } |
  { 'Err' : string };
export type Result_42 = { 'Ok' : BottleCatchPage } |
  { 'Err' : BottleError };
export type Result_43 = { 'Ok' : BottleOwnerPage } |
  { 'Err' : BottleError };
export type Result_44 = { 'Ok' : Array<UpgradeRecord> } |
  { 'Err' : string };
export type Result_45 = { 'Ok' : UpgradePage } |
  { 'Err' : string };
export type Result_46 = { 'Ok' : WasmVersionPage } |
  { 'Err' : string };
export type Result_47 = { 'Ok' : DeliveryAuthorization } |
  { 'Err' : BottleError };
export type Result_48 = { 'Ok' : ReferralWithdrawal } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : null } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : MarketCyclesStatus } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : DriftBottleStorageStatus } |
  { 'Err' : BottleError };
export type Result_8 = { 'Ok' : MarketIcpRevenue } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : MarketStorageStatus } |
  { 'Err' : string };
export type SalesReadinessBlocker = { 'DeploymentTargetMissing' : null } |
  { 'PaymentLedgerMissing' : null } |
  { 'UpgradePriceZero' : null } |
  { 'PublishedWasmMissing' : null } |
  { 'InsufficientCycles' : null } |
  { 'CreatePriceZero' : null } |
  { 'DeploymentCyclesZero' : null };
export interface SetBottleMessagesInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'enabled' : boolean,
  'expected_revision' : bigint,
}
export interface SetOssControllersInput {
  'controllers' : Array<Principal>,
  'expected_controllers' : Array<Principal>,
  'deployment_id' : bigint,
}
export interface SetOssManagersInput {
  'managers' : Array<Principal>,
  'expected_managers' : Array<Principal>,
  'deployment_id' : bigint,
}
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingCallbackToken],
  'body' : Uint8Array | number[],
}
export interface StreamingCallbackToken {
  'chunk_index' : number,
  'sha256' : Uint8Array | number[],
  'tool_id' : bigint,
}
export type StreamingStrategy = {
    'Callback' : {
      'token' : StreamingCallbackToken,
      'callback' : [Principal, string],
    }
  };
export interface SupportedStandard { 'url' : string, 'name' : string }
export interface TextValue { 'content' : string }
export interface TokenAmount {
  'decimals' : number,
  'amount' : bigint,
  'symbol' : string,
}
export interface ToolAttachment {
  'sha256' : Uint8Array | number[],
  'size' : bigint,
  'content_type' : string,
  'file_name' : string,
  'download_path' : string,
}
export type ToolKind = { 'Sdk' : null } |
  { 'BrowserExtension' : null } |
  { 'CommandLine' : null } |
  { 'Other' : null } |
  { 'Desktop' : null } |
  { 'Integration' : null };
export interface TransferMarketCyclesInput {
  'to_canister' : Principal,
  'amount' : bigint,
}
export interface TransferMarketCyclesOutput {
  'transferred' : bigint,
  'required_reserve' : bigint,
  'remaining_balance' : bigint,
}
export interface UpdateConfigInput {
  'create_price_e8s' : bigint,
  'deployment_cycles' : bigint,
  'upgrade_price_e8s' : bigint,
  'sales_enabled' : boolean,
  'payment_ledger' : [] | [Principal],
}
export interface UpdateDriftBottleIntroductionInput {
  'request_id' : Uint8Array | number[],
  'bottle_id' : bigint,
  'introduction' : string,
  'expected_revision' : bigint,
  'introduction_safety_attestation' : [] | [Uint8Array | number[]],
}
export interface UpgradeOrderInput {
  'deployment_id' : bigint,
  'idempotency_key' : string,
}
export interface UpgradePage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<UpgradeRecord>,
}
export interface UpgradeRecord {
  'id' : bigint,
  'status' : DeploymentStatus,
  'to_version_id' : bigint,
  'completed_at_ms' : [] | [bigint],
  'from_version_id' : bigint,
  'ledger_block' : [] | [bigint],
  'error' : [] | [string],
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'to_module_hash' : [] | [Uint8Array | number[]],
  'canister' : Principal,
  'order_id' : bigint,
  'from_module_hash' : [] | [Uint8Array | number[]],
  'deployment_id' : bigint,
}
export interface UpsertOfficialToolInput {
  'id' : [] | [bigint],
  'homepage_url' : [] | [string],
  'featured' : boolean,
  'documentation_url' : [] | [string],
  'description_zh' : [] | [string],
  'external_url' : [] | [string],
  'kind' : ToolKind,
  'published' : boolean,
  'name' : string,
  'slug' : string,
  'sort_order' : number,
  'description' : string,
  'version' : string,
  'summary' : string,
  'platforms' : Array<string>,
  'summary_zh' : [] | [string],
  'name_zh' : [] | [string],
}
export interface UpsertPlatformUpdateInput {
  'id' : [] | [bigint],
  'title' : string,
  'content' : string,
  'content_zh' : [] | [string],
  'kind' : PlatformUpdateKind,
  'published' : boolean,
  'slug' : string,
  'version' : [] | [string],
  'summary' : string,
  'summary_zh' : [] | [string],
  'title_zh' : [] | [string],
}
export interface UserPageRequest {
  'cursor' : [] | [Principal],
  'limit' : number,
}
export interface UserSubmittedLocation {
  'region' : [] | [string],
  'source' : [] | [string],
  'city' : [] | [string],
  'country_code' : [] | [string],
}
export interface UserSummary {
  'last_active_at_ms' : bigint,
  'total_paid_e8s' : bigint,
  'principal' : Principal,
  'order_count' : bigint,
  'deployment_count' : bigint,
}
export interface UserSummaryPage {
  'total' : bigint,
  'next_cursor' : [] | [Principal],
  'items' : Array<UserSummary>,
}
export interface WasmVersionPage {
  'total' : bigint,
  'next_cursor' : [] | [bigint],
  'items' : Array<WasmVersionSummary>,
}
export interface WasmVersionSummary {
  'id' : bigint,
  'published' : boolean,
  'size' : bigint,
  'created_by' : Principal,
  'wasm_sha256' : Uint8Array | number[],
  'created_at_ms' : bigint,
  'version' : string,
  'release_notes' : string,
}
export interface WithdrawIcpInput {
  'to' : Account,
  'amount_e8s' : bigint,
  'idempotency_key' : string,
}
export interface _SERVICE {
  'abort_bottle_message_delivery' : ActorMethod<
    [FinishBottleMessageInput],
    Result
  >,
  'accept_market_ownership' : ActorMethod<[], Result_1>,
  'admin_begin_tool_attachment_upload' : ActorMethod<
    [BeginToolAttachmentUploadInput],
    Result_2
  >,
  'admin_begin_wasm_upload' : ActorMethod<[BeginWasmUploadInput], Result_2>,
  'admin_cleanup_expired_orders' : ActorMethod<[], Result_2>,
  'admin_commit_tool_attachment_upload' : ActorMethod<[bigint], Result_3>,
  'admin_commit_wasm_upload' : ActorMethod<[bigint, boolean], Result_4>,
  'admin_delete_official_tool' : ActorMethod<[bigint], Result_5>,
  'admin_delete_platform_update' : ActorMethod<[bigint], Result_5>,
  'admin_get_config' : ActorMethod<[], Result_1>,
  'admin_get_cycles_status' : ActorMethod<[], Result_6>,
  'admin_get_drift_bottle_quota' : ActorMethod<[], Result_39>,
  'admin_get_drift_bottle_storage_status' : ActorMethod<[], Result_7>,
  'admin_get_icp_revenue' : ActorMethod<[], Result_8>,
  'admin_get_storage_status' : ActorMethod<[], Result_9>,
  'admin_get_upgrade_readiness' : ActorMethod<[], Result_10>,
  'admin_list_deployments' : ActorMethod<[], Result_11>,
  'admin_list_deployments_page' : ActorMethod<[PageRequest], Result_12>,
  'admin_list_drift_bottle_reports' : ActorMethod<
    [AdminBottleReportPageRequest],
    Result_13
  >,
  'admin_list_drift_bottles' : ActorMethod<[BottlePageRequest], Result_14>,
  'admin_list_icp_withdrawals_page' : ActorMethod<[PageRequest], Result_15>,
  'admin_list_official_tools' : ActorMethod<[], Result_16>,
  'admin_list_orders' : ActorMethod<[], Result_17>,
  'admin_list_orders_page' : ActorMethod<[PageRequest], Result_18>,
  'admin_list_platform_updates_page' : ActorMethod<[PageRequest], Result_19>,
  'admin_list_referral_rewards_page' : ActorMethod<[PageRequest], Result_20>,
  'admin_list_referral_withdrawals_page' : ActorMethod<
    [PageRequest],
    Result_21
  >,
  'admin_list_users' : ActorMethod<[], Result_22>,
  'admin_list_users_page' : ActorMethod<[UserPageRequest], Result_23>,
  'admin_propose_owner' : ActorMethod<[[] | [Principal]], Result_1>,
  'admin_reconcile_order_refund' : ActorMethod<[bigint, bigint], Result_24>,
  'admin_refund_order' : ActorMethod<[bigint], Result_24>,
  'admin_remove_deployment_target' : ActorMethod<[string], Result_1>,
  'admin_set_admin' : ActorMethod<[Principal, boolean], Result_1>,
  'admin_set_custom_domains' : ActorMethod<[Array<string>], Result_25>,
  'admin_set_drift_bottle_status' : ActorMethod<
    [AdminSetDriftBottleStatusInput],
    Result_26
  >,
  'admin_set_version_published' : ActorMethod<[bigint, boolean], Result_4>,
  'admin_transfer_cycles' : ActorMethod<[TransferMarketCyclesInput], Result_27>,
  'admin_update_config' : ActorMethod<[UpdateConfigInput], Result_1>,
  'admin_update_drift_bottle_config' : ActorMethod<
    [DriftBottleConfig],
    Result_28
  >,
  'admin_update_referral_config' : ActorMethod<[ReferralConfig], Result_29>,
  'admin_upload_tool_attachment_chunk' : ActorMethod<
    [bigint, number, Uint8Array | number[]],
    Result_2
  >,
  'admin_upload_wasm_chunk' : ActorMethod<
    [bigint, number, Uint8Array | number[]],
    Result_2
  >,
  'admin_upsert_deployment_target' : ActorMethod<[DeploymentTarget], Result_30>,
  'admin_upsert_official_tool' : ActorMethod<
    [UpsertOfficialToolInput],
    Result_3
  >,
  'admin_upsert_platform_update' : ActorMethod<
    [UpsertPlatformUpdateInput],
    Result_31
  >,
  'admin_withdraw_icp' : ActorMethod<[WithdrawIcpInput], Result_32>,
  'block_bottle_participant' : ActorMethod<
    [BlockBottleParticipantInput],
    Result
  >,
  'claim_referral' : ActorMethod<[string], Result_33>,
  'collect_drift_bottle_garbage' : ActorMethod<
    [CollectDriftBottleGarbageInput],
    Result_34
  >,
  'confirm_bottle_message_delivery' : ActorMethod<
    [FinishBottleMessageInput],
    Result
  >,
  'create_deployment_order' : ActorMethod<[CreateOrderInput], Result_24>,
  'create_drift_bottle' : ActorMethod<[CreateDriftBottleInput], Result_26>,
  'create_upgrade_order' : ActorMethod<[UpgradeOrderInput], Result_24>,
  'detach_market_from_my_oss' : ActorMethod<[bigint], Result_35>,
  'ensure_my_referral_account' : ActorMethod<[], Result_33>,
  'fish_drift_bottle' : ActorMethod<[FishDriftBottleInput], Result_36>,
  'get_admin_dashboard' : ActorMethod<[], Result_37>,
  'get_domain_config' : ActorMethod<[], MarketDomainConfig>,
  'get_drift_bottle_config' : ActorMethod<[], DriftBottleConfig>,
  'get_market_sales_readiness' : ActorMethod<[], MarketSalesReadiness>,
  'get_my_dashboard' : ActorMethod<[], Result_38>,
  'get_my_drift_bottle_quota' : ActorMethod<[], Result_39>,
  'get_my_oss_access' : ActorMethod<[bigint], Result_40>,
  'get_my_referral_summary' : ActorMethod<[], Result_33>,
  'get_platform_update' : ActorMethod<[string], [] | [PlatformUpdate]>,
  'get_public_config' : ActorMethod<[], PublicConfig>,
  'get_public_dashboard' : ActorMethod<[], PublicDashboard>,
  'get_session' : ActorMethod<[], Result_41>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'icrc10_supported_standards' : ActorMethod<[], Array<SupportedStandard>>,
  'icrc21_canister_call_consent_message' : ActorMethod<
    [ConsentMessageRequest],
    ConsentMessageResponse
  >,
  'list_my_bottle_catches' : ActorMethod<[BottlePageRequest], Result_42>,
  'list_my_deployments' : ActorMethod<[], Result_11>,
  'list_my_deployments_page' : ActorMethod<[PageRequest], Result_12>,
  'list_my_drift_bottles' : ActorMethod<[BottlePageRequest], Result_43>,
  'list_my_orders' : ActorMethod<[], Result_17>,
  'list_my_orders_page' : ActorMethod<[PageRequest], Result_18>,
  'list_my_referral_rewards_page' : ActorMethod<[PageRequest], Result_20>,
  'list_my_referral_withdrawals_page' : ActorMethod<[PageRequest], Result_21>,
  'list_my_upgrades' : ActorMethod<[], Result_44>,
  'list_my_upgrades_page' : ActorMethod<[PageRequest], Result_45>,
  'list_official_tools' : ActorMethod<[], Array<OfficialTool>>,
  'list_platform_updates_page' : ActorMethod<[PageRequest], Result_19>,
  'list_versions' : ActorMethod<[], Array<WasmVersionSummary>>,
  'list_versions_page' : ActorMethod<[PageRequest], Result_46>,
  'pay_order' : ActorMethod<[bigint], Result_24>,
  'reconcile_order_payment' : ActorMethod<[bigint, bigint], Result_24>,
  'refresh_drift_bottle_share' : ActorMethod<
    [RefreshDriftBottleShareInput],
    Result_26
  >,
  'refresh_my_deployment' : ActorMethod<[bigint], Result_35>,
  'report_drift_bottle' : ActorMethod<[ReportBottleInput], Result>,
  'reserve_bottle_message_delivery' : ActorMethod<
    [ReserveBottleMessageInput],
    Result_47
  >,
  'retry_order' : ActorMethod<[bigint], Result_24>,
  'set_drift_bottle_messages' : ActorMethod<
    [SetBottleMessagesInput],
    Result_26
  >,
  'set_my_oss_controllers' : ActorMethod<[SetOssControllersInput], Result_40>,
  'set_my_oss_managers' : ActorMethod<[SetOssManagersInput], Result_40>,
  'update_drift_bottle_introduction' : ActorMethod<
    [UpdateDriftBottleIntroductionInput],
    Result_26
  >,
  'withdraw_drift_bottle' : ActorMethod<[BottleMutationInput], Result_26>,
  'withdraw_referral_reward' : ActorMethod<[WithdrawIcpInput], Result_48>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

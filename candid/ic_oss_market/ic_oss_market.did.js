export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'owner' : IDL.Opt(IDL.Principal),
    'create_price_e8s' : IDL.Opt(IDL.Nat64),
    'deployment_cycles' : IDL.Opt(IDL.Nat),
    'upgrade_price_e8s' : IDL.Opt(IDL.Nat64),
    'sales_enabled' : IDL.Opt(IDL.Bool),
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const FinishBottleMessageInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'sender' : IDL.Principal,
    'catch_id' : IDL.Nat64,
    'body_sha256' : IDL.Vec(IDL.Nat8),
  });
  const BottleError = IDL.Variant({
    'Internal' : IDL.Text,
    'AlreadyDelivered' : IDL.Null,
    'DailyCatchLimitReached' : IDL.Null,
    'InvalidInput' : IDL.Text,
    'AnonymousNotAllowed' : IDL.Null,
    'PendingLimitReached' : IDL.Null,
    'NoEligibleBottleSampled' : IDL.Null,
    'DailyCreateLimitReached' : IDL.Null,
    'Disabled' : IDL.Null,
    'ExternalCallFailed' : IDL.Text,
    'ChannelClosed' : IDL.Null,
    'NotFound' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'OwnerActiveLimitReached' : IDL.Null,
    'SafetyCheckRequired' : IDL.Null,
    'SafetyCheckUnavailable' : IDL.Null,
    'GlobalActiveLimitReached' : IDL.Null,
    'Unavailable' : IDL.Null,
    'PendingOperation' : IDL.Null,
    'PoolEmpty' : IDL.Null,
    'Conflict' : IDL.Text,
    'MessageWindowClosed' : IDL.Null,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : BottleError });
  const DeploymentTarget = IDL.Record({
    'id' : IDL.Text,
    'region' : IDL.Text,
    'node_count' : IDL.Nat16,
    'description_zh' : IDL.Opt(IDL.Text),
    'topology_updated_at_ms' : IDL.Nat64,
    'subnet_id' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'sort_order' : IDL.Nat16,
    'description' : IDL.Text,
    'region_zh' : IDL.Opt(IDL.Text),
    'data_residency' : IDL.Bool,
    'enabled' : IDL.Bool,
    'name_zh' : IDL.Opt(IDL.Text),
    'cost_multiplier_basis_points' : IDL.Nat32,
    'country_count' : IDL.Nat16,
  });
  const ReferralConfig = IDL.Record({
    'withdrawal_threshold_e8s' : IDL.Nat64,
    'inviter_reward_e8s' : IDL.Nat64,
    'enabled' : IDL.Bool,
    'new_user_discount_e8s' : IDL.Nat64,
  });
  const MarketConfig = IDL.Record({
    'deployment_targets' : IDL.Vec(IDL.Tuple(IDL.Text, DeploymentTarget)),
    'custom_domains' : IDL.Opt(IDL.Vec(IDL.Text)),
    'referral_config' : IDL.Opt(ReferralConfig),
    'owner' : IDL.Principal,
    'create_price_e8s' : IDL.Nat64,
    'deployment_cycles' : IDL.Nat,
    'admins' : IDL.Vec(IDL.Principal),
    'upgrade_price_e8s' : IDL.Nat64,
    'sales_enabled' : IDL.Bool,
    'pending_owner' : IDL.Opt(IDL.Principal),
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const Result_1 = IDL.Variant({ 'Ok' : MarketConfig, 'Err' : IDL.Text });
  const ToolKind = IDL.Variant({
    'Sdk' : IDL.Null,
    'BrowserExtension' : IDL.Null,
    'CommandLine' : IDL.Null,
    'Other' : IDL.Null,
    'Desktop' : IDL.Null,
    'Integration' : IDL.Null,
  });
  const UpsertOfficialToolInput = IDL.Record({
    'id' : IDL.Opt(IDL.Nat64),
    'homepage_url' : IDL.Opt(IDL.Text),
    'featured' : IDL.Bool,
    'documentation_url' : IDL.Opt(IDL.Text),
    'description_zh' : IDL.Opt(IDL.Text),
    'external_url' : IDL.Opt(IDL.Text),
    'kind' : ToolKind,
    'published' : IDL.Bool,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'sort_order' : IDL.Nat16,
    'description' : IDL.Text,
    'version' : IDL.Text,
    'summary' : IDL.Text,
    'platforms' : IDL.Vec(IDL.Text),
    'summary_zh' : IDL.Opt(IDL.Text),
    'name_zh' : IDL.Opt(IDL.Text),
  });
  const BeginToolAttachmentUploadInput = IDL.Record({
    'tool' : UpsertOfficialToolInput,
    'content_type' : IDL.Text,
    'file_name' : IDL.Text,
    'expected_size' : IDL.Nat64,
    'expected_sha256' : IDL.Vec(IDL.Nat8),
  });
  const Result_2 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const BeginWasmUploadInput = IDL.Record({
    'expected_size' : IDL.Nat64,
    'version' : IDL.Text,
    'expected_sha256' : IDL.Vec(IDL.Nat8),
    'release_notes' : IDL.Text,
  });
  const ToolAttachment = IDL.Record({
    'sha256' : IDL.Vec(IDL.Nat8),
    'size' : IDL.Nat64,
    'content_type' : IDL.Text,
    'file_name' : IDL.Text,
    'download_path' : IDL.Text,
  });
  const OfficialTool = IDL.Record({
    'id' : IDL.Nat64,
    'homepage_url' : IDL.Opt(IDL.Text),
    'featured' : IDL.Bool,
    'documentation_url' : IDL.Opt(IDL.Text),
    'description_zh' : IDL.Opt(IDL.Text),
    'external_url' : IDL.Opt(IDL.Text),
    'kind' : ToolKind,
    'published' : IDL.Bool,
    'name' : IDL.Text,
    'slug' : IDL.Text,
    'sort_order' : IDL.Nat16,
    'description' : IDL.Text,
    'updated_at_ms' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'version' : IDL.Text,
    'summary' : IDL.Text,
    'platforms' : IDL.Vec(IDL.Text),
    'summary_zh' : IDL.Opt(IDL.Text),
    'name_zh' : IDL.Opt(IDL.Text),
    'attachment' : IDL.Opt(ToolAttachment),
  });
  const Result_3 = IDL.Variant({ 'Ok' : OfficialTool, 'Err' : IDL.Text });
  const WasmVersionSummary = IDL.Record({
    'id' : IDL.Nat64,
    'published' : IDL.Bool,
    'size' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'wasm_sha256' : IDL.Vec(IDL.Nat8),
    'created_at_ms' : IDL.Nat64,
    'version' : IDL.Text,
    'release_notes' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'Ok' : WasmVersionSummary, 'Err' : IDL.Text });
  const Result_5 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const MarketCyclesStatus = IDL.Record({
    'balance' : IDL.Nat,
    'reserved_deployment_cycles' : IDL.Nat,
    'available_deployment_slots' : IDL.Nat64,
    'deployment_cycles' : IDL.Nat,
    'transferable_cycles' : IDL.Nat,
    'reserve_cycles' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'Ok' : MarketCyclesStatus, 'Err' : IDL.Text });
  const BottleQuotaView = IDL.Record({
    'created' : IDL.Nat16,
    'day_id' : IDL.Nat64,
    'global_create_used' : IDL.Nat16,
    'create_remaining' : IDL.Nat16,
    'global_catch_limit' : IDL.Nat16,
    'create_limit' : IDL.Nat16,
    'resets_at_ms' : IDL.Nat64,
    'global_create_limit' : IDL.Nat16,
    'global_catch_used' : IDL.Nat16,
    'catch_limit' : IDL.Nat16,
    'global_create_remaining' : IDL.Nat16,
    'caught' : IDL.Nat16,
    'global_catch_remaining' : IDL.Nat16,
    'catch_remaining' : IDL.Nat16,
  });
  const Result_39 = IDL.Variant({
    'Ok' : BottleQuotaView,
    'Err' : BottleError,
  });
  const DriftBottleStorageStatus = IDL.Record({
    'unique_catches' : IDL.Nat64,
    'pending_operations' : IDL.Nat16,
    'replay_records' : IDL.Nat64,
    'bottles' : IDL.Nat64,
    'payloads' : IDL.Nat64,
    'active_bottles' : IDL.Nat64,
    'delivery_reservations' : IDL.Nat64,
    'catches' : IDL.Nat64,
  });
  const Result_7 = IDL.Variant({
    'Ok' : DriftBottleStorageStatus,
    'Err' : BottleError,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const MarketIcpRevenue = IDL.Record({
    'withdrawable_e8s' : IDL.Nat64,
    'ledger_fee_e8s' : IDL.Nat64,
    'ledger' : IDL.Principal,
    'withdrawn_e8s' : IDL.Nat64,
    'balance_e8s' : IDL.Nat64,
    'referral_liability_e8s' : IDL.Nat64,
    'market_account' : Account,
    'recorded_revenue_e8s' : IDL.Nat64,
  });
  const Result_8 = IDL.Variant({ 'Ok' : MarketIcpRevenue, 'Err' : IDL.Text });
  const MarketStorageStatus = IDL.Record({
    'tool_attachment_bytes' : IDL.Nat64,
    'previous_snapshot_bytes' : IDL.Nat64,
    'wasm_versions' : IDL.Nat64,
    'active_generation' : IDL.Nat8,
    'pending_upload_bytes' : IDL.Nat64,
    'wasm_bytes' : IDL.Nat64,
    'active_snapshot_bytes' : IDL.Nat64,
    'layout_version' : IDL.Nat16,
    'pending_tool_upload_bytes' : IDL.Nat64,
    'tool_attachments' : IDL.Nat64,
  });
  const Result_9 = IDL.Variant({
    'Ok' : MarketStorageStatus,
    'Err' : IDL.Text,
  });
  const MarketUpgradeReadiness = IDL.Record({
    'processing_orders' : IDL.Nat64,
    'provisioning_orders' : IDL.Nat64,
    'pending_withdrawals' : IDL.Nat64,
    'pending_referral_withdrawals' : IDL.Opt(IDL.Nat64),
    'refunding_orders' : IDL.Nat64,
    'paid_orders' : IDL.Nat64,
    'ready' : IDL.Bool,
  });
  const Result_10 = IDL.Variant({
    'Ok' : MarketUpgradeReadiness,
    'Err' : IDL.Text,
  });
  const DeploymentStatus = IDL.Variant({
    'Creating' : IDL.Null,
    'Failed' : IDL.Null,
    'Installing' : IDL.Null,
    'Active' : IDL.Null,
    'UpgradePending' : IDL.Null,
  });
  const MarketControllerStatus = IDL.Variant({
    'Missing' : IDL.Null,
    'Present' : IDL.Null,
    'Unreachable' : IDL.Null,
    'Unknown' : IDL.Null,
  });
  const Deployment = IDL.Record({
    'id' : IDL.Nat64,
    'controller_checked_at_ms' : IDL.Opt(IDL.Nat64),
    'last_error' : IDL.Opt(IDL.Text),
    'status' : DeploymentStatus,
    'market_controller_status' : MarketControllerStatus,
    'version_id' : IDL.Nat64,
    'owner' : IDL.Principal,
    'subnet_id' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'updated_at_ms' : IDL.Nat64,
    'created_at_ms' : IDL.Nat64,
    'canister' : IDL.Opt(IDL.Principal),
    'observed_module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'deployment_target_id' : IDL.Text,
  });
  const Result_11 = IDL.Variant({
    'Ok' : IDL.Vec(Deployment),
    'Err' : IDL.Text,
  });
  const PageRequest = IDL.Record({
    'cursor' : IDL.Opt(IDL.Nat64),
    'limit' : IDL.Nat16,
  });
  const DeploymentPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(Deployment),
  });
  const Result_12 = IDL.Variant({ 'Ok' : DeploymentPage, 'Err' : IDL.Text });
  const AdminBottleReportPageRequest = IDL.Record({
    'cursor' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'take' : IDL.Opt(IDL.Nat16),
  });
  const AdminBottleReportView = IDL.Record({
    'bottle_id' : IDL.Nat64,
    'created_at_ms' : IDL.Nat64,
    'reporter' : IDL.Principal,
    'reason' : IDL.Text,
  });
  const AdminBottleReportPage = IDL.Record({
    'next' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'items' : IDL.Vec(AdminBottleReportView),
  });
  const Result_13 = IDL.Variant({
    'Ok' : AdminBottleReportPage,
    'Err' : BottleError,
  });
  const BottlePageRequest = IDL.Record({
    'cursor' : IDL.Opt(IDL.Nat64),
    'take' : IDL.Opt(IDL.Nat16),
  });
  const DriftBottleStatus = IDL.Variant({
    'Exhausted' : IDL.Null,
    'PendingValidation' : IDL.Null,
    'Active' : IDL.Null,
    'Withdrawn' : IDL.Null,
    'Hidden' : IDL.Null,
    'Purged' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const UserSubmittedLocation = IDL.Record({
    'region' : IDL.Opt(IDL.Text),
    'source' : IDL.Opt(IDL.Text),
    'city' : IDL.Opt(IDL.Text),
    'country_code' : IDL.Opt(IDL.Text),
  });
  const BottleOwnerView = IDL.Record({
    'id' : IDL.Nat64,
    'status' : DriftBottleStatus,
    'listing_manifest_revision' : IDL.Nat64,
    'max_opens' : IDL.Nat8,
    'message_channel_revision' : IDL.Nat64,
    'share_id' : IDL.Vec(IDL.Nat8),
    'messages_enabled' : IDL.Bool,
    'created_at_ms' : IDL.Nat64,
    'introduction' : IDL.Text,
    'source_bucket' : IDL.Principal,
    'revision' : IDL.Nat64,
    'location' : IDL.Opt(UserSubmittedLocation),
    'successful_opens' : IDL.Nat8,
    'active_until_ms' : IDL.Nat64,
  });
  const DriftBottleAdminView = IDL.Record({
    'owner' : IDL.Principal,
    'report_count' : IDL.Nat16,
    'bottle' : BottleOwnerView,
  });
  const DriftBottleAdminPage = IDL.Record({
    'next' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(DriftBottleAdminView),
  });
  const Result_14 = IDL.Variant({
    'Ok' : DriftBottleAdminPage,
    'Err' : BottleError,
  });
  const IcpWithdrawalStatus = IDL.Variant({
    'Failed' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const IcpWithdrawal = IDL.Record({
    'id' : IDL.Nat64,
    'to' : Account,
    'last_error' : IDL.Opt(IDL.Text),
    'status' : IcpWithdrawalStatus,
    'completed_at_ms' : IDL.Opt(IDL.Nat64),
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'fee_e8s' : IDL.Nat64,
    'requested_by' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'ledger' : IDL.Principal,
    'transfer_created_at_time' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const IcpWithdrawalPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(IcpWithdrawal),
  });
  const Result_15 = IDL.Variant({ 'Ok' : IcpWithdrawalPage, 'Err' : IDL.Text });
  const Result_16 = IDL.Variant({
    'Ok' : IDL.Vec(OfficialTool),
    'Err' : IDL.Text,
  });
  const OrderStatus = IDL.Variant({
    'Refunding' : IDL.Null,
    'Failed' : IDL.Null,
    'Refunded' : IDL.Null,
    'Paid' : IDL.Null,
    'Processing' : IDL.Null,
    'Provisioning' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const OperationKind = IDL.Variant({
    'Upgrade' : IDL.Null,
    'Create' : IDL.Null,
  });
  const Order = IDL.Record({
    'id' : IDL.Nat64,
    'last_error' : IDL.Opt(IDL.Text),
    'status' : OrderStatus,
    'requested_name' : IDL.Opt(IDL.Text),
    'referrer' : IDL.Opt(IDL.Principal),
    'refunded_at_ms' : IDL.Opt(IDL.Nat64),
    'kind' : OperationKind,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'target_subnet_id' : IDL.Opt(IDL.Principal),
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'referral_discount_e8s' : IDL.Opt(IDL.Nat64),
    'deployment_cycles' : IDL.Opt(IDL.Nat),
    'transfer_created_at_time' : IDL.Nat64,
    'provisioning_started_at_ms' : IDL.Opt(IDL.Nat64),
    'refund_block' : IDL.Opt(IDL.Nat64),
    'refund_transfer_created_at_time' : IDL.Opt(IDL.Nat64),
    'buyer' : IDL.Principal,
    'target_version_id' : IDL.Nat64,
    'deployment_target_id' : IDL.Text,
    'referral_reward_e8s' : IDL.Opt(IDL.Nat64),
    'referral_reward_id' : IDL.Opt(IDL.Nat64),
    'expires_at_ms' : IDL.Nat64,
    'deployment_id' : IDL.Opt(IDL.Nat64),
    'idempotency_key' : IDL.Text,
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const Result_17 = IDL.Variant({ 'Ok' : IDL.Vec(Order), 'Err' : IDL.Text });
  const OrderPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(Order),
  });
  const Result_18 = IDL.Variant({ 'Ok' : OrderPage, 'Err' : IDL.Text });
  const PlatformUpdateKind = IDL.Variant({
    'Release' : IDL.Null,
    'Announcement' : IDL.Null,
    'Security' : IDL.Null,
    'Maintenance' : IDL.Null,
    'Feature' : IDL.Null,
  });
  const PlatformUpdate = IDL.Record({
    'id' : IDL.Nat64,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'content_zh' : IDL.Opt(IDL.Text),
    'kind' : PlatformUpdateKind,
    'published' : IDL.Bool,
    'slug' : IDL.Text,
    'updated_at_ms' : IDL.Nat64,
    'created_by' : IDL.Principal,
    'published_at_ms' : IDL.Opt(IDL.Nat64),
    'created_at_ms' : IDL.Nat64,
    'version' : IDL.Opt(IDL.Text),
    'summary' : IDL.Text,
    'summary_zh' : IDL.Opt(IDL.Text),
    'title_zh' : IDL.Opt(IDL.Text),
  });
  const PlatformUpdatePage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(PlatformUpdate),
  });
  const Result_19 = IDL.Variant({
    'Ok' : PlatformUpdatePage,
    'Err' : IDL.Text,
  });
  const ReferralReward = IDL.Record({
    'id' : IDL.Nat64,
    'referred_user' : IDL.Principal,
    'inviter' : IDL.Principal,
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'ledger' : IDL.Principal,
    'order_id' : IDL.Nat64,
  });
  const ReferralRewardPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(ReferralReward),
  });
  const Result_20 = IDL.Variant({
    'Ok' : ReferralRewardPage,
    'Err' : IDL.Text,
  });
  const ReferralWithdrawal = IDL.Record({
    'id' : IDL.Nat64,
    'to' : Account,
    'last_error' : IDL.Opt(IDL.Text),
    'status' : IcpWithdrawalStatus,
    'owner' : IDL.Principal,
    'completed_at_ms' : IDL.Opt(IDL.Nat64),
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'fee_e8s' : IDL.Nat64,
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'ledger' : IDL.Principal,
    'transfer_created_at_time' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const ReferralWithdrawalPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(ReferralWithdrawal),
  });
  const Result_21 = IDL.Variant({
    'Ok' : ReferralWithdrawalPage,
    'Err' : IDL.Text,
  });
  const UserSummary = IDL.Record({
    'last_active_at_ms' : IDL.Nat64,
    'total_paid_e8s' : IDL.Nat64,
    'principal' : IDL.Principal,
    'order_count' : IDL.Nat64,
    'deployment_count' : IDL.Nat64,
  });
  const Result_22 = IDL.Variant({
    'Ok' : IDL.Vec(UserSummary),
    'Err' : IDL.Text,
  });
  const UserPageRequest = IDL.Record({
    'cursor' : IDL.Opt(IDL.Principal),
    'limit' : IDL.Nat16,
  });
  const UserSummaryPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Principal),
    'items' : IDL.Vec(UserSummary),
  });
  const Result_23 = IDL.Variant({ 'Ok' : UserSummaryPage, 'Err' : IDL.Text });
  const Result_24 = IDL.Variant({ 'Ok' : Order, 'Err' : IDL.Text });
  const MarketDomainConfig = IDL.Record({
    'derivation_origin' : IDL.Text,
    'custom_domains' : IDL.Vec(IDL.Text),
    'canister_id' : IDL.Principal,
  });
  const Result_25 = IDL.Variant({
    'Ok' : MarketDomainConfig,
    'Err' : IDL.Text,
  });
  const AdminSetDriftBottleStatusInput = IDL.Record({
    'status' : DriftBottleStatus,
    'bottle_id' : IDL.Nat64,
    'reason' : IDL.Text,
  });
  const Result_26 = IDL.Variant({
    'Ok' : BottleOwnerView,
    'Err' : BottleError,
  });
  const TransferMarketCyclesInput = IDL.Record({
    'to_canister' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const TransferMarketCyclesOutput = IDL.Record({
    'transferred' : IDL.Nat,
    'required_reserve' : IDL.Nat,
    'remaining_balance' : IDL.Nat,
  });
  const Result_27 = IDL.Variant({
    'Ok' : TransferMarketCyclesOutput,
    'Err' : IDL.Text,
  });
  const UpdateConfigInput = IDL.Record({
    'create_price_e8s' : IDL.Nat64,
    'deployment_cycles' : IDL.Nat,
    'upgrade_price_e8s' : IDL.Nat64,
    'sales_enabled' : IDL.Bool,
    'payment_ledger' : IDL.Opt(IDL.Principal),
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
  const DriftBottleConfig = IDL.Record({
    'auto_hide_report_threshold' : IDL.Nat16,
    'content_safety' : IDL.Opt(ContentSafetyVerifierConfig),
    'bottle_ttl_ms' : IDL.Nat64,
    'global_pending_limit' : IDL.Nat16,
    'message_window_ms' : IDL.Nat64,
    'active_per_owner_limit' : IDL.Nat16,
    'enabled' : IDL.Bool,
    'global_daily_create_limit' : IDL.Opt(IDL.Nat16),
    'daily_create_limit' : IDL.Nat16,
    'global_daily_catch_limit' : IDL.Opt(IDL.Nat16),
    'global_active_limit' : IDL.Nat64,
    'daily_catch_limit' : IDL.Nat16,
  });
  const Result_28 = IDL.Variant({
    'Ok' : DriftBottleConfig,
    'Err' : BottleError,
  });
  const Result_29 = IDL.Variant({ 'Ok' : ReferralConfig, 'Err' : IDL.Text });
  const Result_30 = IDL.Variant({ 'Ok' : DeploymentTarget, 'Err' : IDL.Text });
  const UpsertPlatformUpdateInput = IDL.Record({
    'id' : IDL.Opt(IDL.Nat64),
    'title' : IDL.Text,
    'content' : IDL.Text,
    'content_zh' : IDL.Opt(IDL.Text),
    'kind' : PlatformUpdateKind,
    'published' : IDL.Bool,
    'slug' : IDL.Text,
    'version' : IDL.Opt(IDL.Text),
    'summary' : IDL.Text,
    'summary_zh' : IDL.Opt(IDL.Text),
    'title_zh' : IDL.Opt(IDL.Text),
  });
  const Result_31 = IDL.Variant({ 'Ok' : PlatformUpdate, 'Err' : IDL.Text });
  const WithdrawIcpInput = IDL.Record({
    'to' : Account,
    'amount_e8s' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_32 = IDL.Variant({ 'Ok' : IcpWithdrawal, 'Err' : IDL.Text });
  const BlockBottleParticipantInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'blocked' : IDL.Bool,
    'participant' : IDL.Principal,
  });
  const ReferralAccount = IDL.Record({
    'reward_ledger' : IDL.Opt(IDL.Principal),
    'principal' : IDL.Principal,
    'code' : IDL.Text,
    'referred_by' : IDL.Opt(IDL.Principal),
    'total_earned_e8s' : IDL.Nat64,
    'created_at_ms' : IDL.Nat64,
    'available_reward_e8s' : IDL.Nat64,
    'referred_at_ms' : IDL.Opt(IDL.Nat64),
    'total_withdrawn_e8s' : IDL.Nat64,
    'qualified_order_id' : IDL.Opt(IDL.Nat64),
    'discount_order_id' : IDL.Opt(IDL.Nat64),
  });
  const ReferralSummary = IDL.Record({
    'account' : ReferralAccount,
    'config' : ReferralConfig,
    'invited_count' : IDL.Nat64,
    'qualified_count' : IDL.Nat64,
  });
  const Result_33 = IDL.Variant({ 'Ok' : ReferralSummary, 'Err' : IDL.Text });
  const CollectDriftBottleGarbageInput = IDL.Record({
    'max_items' : IDL.Opt(IDL.Nat16),
  });
  const CollectDriftBottleGarbageOutput = IDL.Record({
    'recovered_pending' : IDL.Nat16,
    'removed_unique_catches' : IDL.Nat16,
    'remaining_replays' : IDL.Nat64,
    'removed_abuse_records' : IDL.Nat16,
    'removed_bottle_tombstones' : IDL.Nat16,
    'removed_catch_receipts' : IDL.Nat16,
    'removed_delivery_reservations' : IDL.Nat16,
    'expired_bottles' : IDL.Nat16,
    'removed_daily_usage' : IDL.Nat16,
    'removed_replays' : IDL.Nat16,
  });
  const Result_34 = IDL.Variant({
    'Ok' : CollectDriftBottleGarbageOutput,
    'Err' : BottleError,
  });
  const CreateOrderInput = IDL.Record({
    'name' : IDL.Text,
    'deployment_target_id' : IDL.Opt(IDL.Text),
    'idempotency_key' : IDL.Text,
  });
  const FolderShareCredential = IDL.Record({
    'share_id' : IDL.Vec(IDL.Nat8),
    'secret' : IDL.Vec(IDL.Nat8),
  });
  const CreateDriftBottleInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'credential' : FolderShareCredential,
    'max_opens' : IDL.Nat8,
    'share_id' : IDL.Vec(IDL.Nat8),
    'introduction' : IDL.Text,
    'listing_ticket' : IDL.Vec(IDL.Nat8),
    'bucket' : IDL.Principal,
    'location' : IDL.Opt(UserSubmittedLocation),
    'introduction_safety_attestation' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const UpgradeOrderInput = IDL.Record({
    'deployment_id' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_35 = IDL.Variant({ 'Ok' : Deployment, 'Err' : IDL.Text });
  const FishDriftBottleInput = IDL.Record({ 'request_id' : IDL.Vec(IDL.Nat8) });
  const BottleMessageTarget = IDL.Record({
    'bottle_id' : IDL.Nat64,
    'catch_id' : IDL.Nat64,
    'deadline_ms' : IDL.Nat64,
    'market' : IDL.Principal,
    'source_bucket' : IDL.Principal,
  });
  const BottleShareRef = IDL.Record({
    'share_revision' : IDL.Nat64,
    'credential' : FolderShareCredential,
    'bucket' : IDL.Principal,
  });
  const BottleCatchView = IDL.Record({
    'message_target' : IDL.Opt(BottleMessageTarget),
    'listing_manifest_revision' : IDL.Nat64,
    'bottle_revision' : IDL.Nat64,
    'bottle_id' : IDL.Nat64,
    'caught_at_ms' : IDL.Nat64,
    'share' : BottleShareRef,
    'catch_id' : IDL.Nat64,
    'introduction' : IDL.Text,
    'publisher_alias' : IDL.Text,
    'location' : IDL.Opt(UserSubmittedLocation),
  });
  const Result_36 = IDL.Variant({
    'Ok' : BottleCatchView,
    'Err' : BottleError,
  });
  const AdminDashboard = IDL.Record({
    'deployments' : DeploymentPage,
    'tools' : IDL.Vec(OfficialTool),
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
  });
  const Result_37 = IDL.Variant({ 'Ok' : AdminDashboard, 'Err' : IDL.Text });
  const SalesReadinessBlocker = IDL.Variant({
    'DeploymentTargetMissing' : IDL.Null,
    'PaymentLedgerMissing' : IDL.Null,
    'UpgradePriceZero' : IDL.Null,
    'PublishedWasmMissing' : IDL.Null,
    'InsufficientCycles' : IDL.Null,
    'CreatePriceZero' : IDL.Null,
    'DeploymentCyclesZero' : IDL.Null,
  });
  const MarketSalesReadiness = IDL.Record({
    'blockers' : IDL.Vec(SalesReadinessBlocker),
    'available_deployment_slots' : IDL.Nat64,
    'ready' : IDL.Bool,
  });
  const UpgradeRecord = IDL.Record({
    'id' : IDL.Nat64,
    'status' : DeploymentStatus,
    'to_version_id' : IDL.Nat64,
    'completed_at_ms' : IDL.Opt(IDL.Nat64),
    'from_version_id' : IDL.Nat64,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'error' : IDL.Opt(IDL.Text),
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'to_module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'canister' : IDL.Principal,
    'order_id' : IDL.Nat64,
    'from_module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'deployment_id' : IDL.Nat64,
  });
  const UpgradePage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(UpgradeRecord),
  });
  const MyDashboard = IDL.Record({
    'deployments' : DeploymentPage,
    'principal' : IDL.Principal,
    'referral' : IDL.Opt(ReferralSummary),
    'is_admin' : IDL.Bool,
    'orders' : OrderPage,
    'upgrades' : UpgradePage,
    'referral_withdrawals' : ReferralWithdrawalPage,
    'referral_rewards' : ReferralRewardPage,
  });
  const Result_38 = IDL.Variant({ 'Ok' : MyDashboard, 'Err' : IDL.Text });
  const OssAccess = IDL.Record({
    'market_controller' : IDL.Principal,
    'controllers' : IDL.Vec(IDL.Principal),
    'managers' : IDL.Vec(IDL.Principal),
    'canister' : IDL.Principal,
    'deployment_id' : IDL.Nat64,
  });
  const Result_40 = IDL.Variant({ 'Ok' : OssAccess, 'Err' : IDL.Text });
  const PublicConfig = IDL.Record({
    'deployment_targets' : IDL.Vec(DeploymentTarget),
    'referral_config' : IDL.Opt(ReferralConfig),
    'available_deployment_slots' : IDL.Nat64,
    'create_price_e8s' : IDL.Nat64,
    'upgrade_price_e8s' : IDL.Nat64,
    'latest_version' : IDL.Opt(WasmVersionSummary),
    'sales_enabled' : IDL.Bool,
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const WasmVersionPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(WasmVersionSummary),
  });
  const PublicDashboard = IDL.Record({
    'tools' : IDL.Vec(OfficialTool),
    'sales_readiness' : MarketSalesReadiness,
    'updates' : PlatformUpdatePage,
    'config' : PublicConfig,
    'versions' : WasmVersionPage,
  });
  const Result_41 = IDL.Variant({
    'Ok' : IDL.Tuple(IDL.Principal, IDL.Bool),
    'Err' : IDL.Text,
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const StreamingCallbackToken = IDL.Record({
    'chunk_index' : IDL.Nat32,
    'sha256' : IDL.Vec(IDL.Nat8),
    'tool_id' : IDL.Nat64,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackResponse],
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
  const BottleCatchPage = IDL.Record({
    'next' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(BottleCatchView),
  });
  const Result_42 = IDL.Variant({
    'Ok' : BottleCatchPage,
    'Err' : BottleError,
  });
  const BottleOwnerPage = IDL.Record({
    'next' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(BottleOwnerView),
  });
  const Result_43 = IDL.Variant({
    'Ok' : BottleOwnerPage,
    'Err' : BottleError,
  });
  const Result_44 = IDL.Variant({
    'Ok' : IDL.Vec(UpgradeRecord),
    'Err' : IDL.Text,
  });
  const Result_45 = IDL.Variant({ 'Ok' : UpgradePage, 'Err' : IDL.Text });
  const Result_46 = IDL.Variant({ 'Ok' : WasmVersionPage, 'Err' : IDL.Text });
  const RefreshDriftBottleShareInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'credential' : FolderShareCredential,
    'bottle_id' : IDL.Nat64,
    'listing_ticket' : IDL.Vec(IDL.Nat8),
    'expected_revision' : IDL.Nat64,
  });
  const ReportBottleInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'reason' : IDL.Text,
  });
  const ReserveBottleMessageInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'sender' : IDL.Principal,
    'catch_id' : IDL.Nat64,
    'body_sha256' : IDL.Vec(IDL.Nat8),
    'safety_attestation' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const DeliveryAuthorization = IDL.Record({
    'bottle_id' : IDL.Nat64,
    'reservation_expires_at_ms' : IDL.Nat64,
    'sender' : IDL.Principal,
    'catch_id' : IDL.Nat64,
    'body_sha256' : IDL.Vec(IDL.Nat8),
    'source_bucket' : IDL.Principal,
  });
  const Result_47 = IDL.Variant({
    'Ok' : DeliveryAuthorization,
    'Err' : BottleError,
  });
  const SetBottleMessagesInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'enabled' : IDL.Bool,
    'expected_revision' : IDL.Nat64,
  });
  const SetOssControllersInput = IDL.Record({
    'controllers' : IDL.Vec(IDL.Principal),
    'expected_controllers' : IDL.Vec(IDL.Principal),
    'deployment_id' : IDL.Nat64,
  });
  const SetOssManagersInput = IDL.Record({
    'managers' : IDL.Vec(IDL.Principal),
    'expected_managers' : IDL.Vec(IDL.Principal),
    'deployment_id' : IDL.Nat64,
  });
  const UpdateDriftBottleIntroductionInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'introduction' : IDL.Text,
    'expected_revision' : IDL.Nat64,
    'introduction_safety_attestation' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const BottleMutationInput = IDL.Record({
    'request_id' : IDL.Vec(IDL.Nat8),
    'bottle_id' : IDL.Nat64,
    'expected_revision' : IDL.Nat64,
  });
  const Result_48 = IDL.Variant({
    'Ok' : ReferralWithdrawal,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'abort_bottle_message_delivery' : IDL.Func(
        [FinishBottleMessageInput],
        [Result],
        [],
      ),
    'accept_market_ownership' : IDL.Func([], [Result_1], []),
    'admin_begin_tool_attachment_upload' : IDL.Func(
        [BeginToolAttachmentUploadInput],
        [Result_2],
        [],
      ),
    'admin_begin_wasm_upload' : IDL.Func(
        [BeginWasmUploadInput],
        [Result_2],
        [],
      ),
    'admin_cleanup_expired_orders' : IDL.Func([], [Result_2], []),
    'admin_commit_tool_attachment_upload' : IDL.Func(
        [IDL.Nat64],
        [Result_3],
        [],
      ),
    'admin_commit_wasm_upload' : IDL.Func(
        [IDL.Nat64, IDL.Bool],
        [Result_4],
        [],
      ),
    'admin_delete_official_tool' : IDL.Func([IDL.Nat64], [Result_5], []),
    'admin_delete_platform_update' : IDL.Func([IDL.Nat64], [Result_5], []),
    'admin_get_config' : IDL.Func([], [Result_1], ['query']),
    'admin_get_cycles_status' : IDL.Func([], [Result_6], ['query']),
    'admin_get_drift_bottle_quota' : IDL.Func([], [Result_39], ['query']),
    'admin_get_drift_bottle_storage_status' : IDL.Func(
        [],
        [Result_7],
        ['query'],
      ),
    'admin_get_icp_revenue' : IDL.Func([], [Result_8], []),
    'admin_get_storage_status' : IDL.Func([], [Result_9], ['query']),
    'admin_get_upgrade_readiness' : IDL.Func([], [Result_10], ['query']),
    'admin_list_deployments' : IDL.Func([], [Result_11], ['query']),
    'admin_list_deployments_page' : IDL.Func(
        [PageRequest],
        [Result_12],
        ['query'],
      ),
    'admin_list_drift_bottle_reports' : IDL.Func(
        [AdminBottleReportPageRequest],
        [Result_13],
        ['query'],
      ),
    'admin_list_drift_bottles' : IDL.Func(
        [BottlePageRequest],
        [Result_14],
        ['query'],
      ),
    'admin_list_icp_withdrawals_page' : IDL.Func(
        [PageRequest],
        [Result_15],
        ['query'],
      ),
    'admin_list_official_tools' : IDL.Func([], [Result_16], ['query']),
    'admin_list_orders' : IDL.Func([], [Result_17], ['query']),
    'admin_list_orders_page' : IDL.Func([PageRequest], [Result_18], ['query']),
    'admin_list_platform_updates_page' : IDL.Func(
        [PageRequest],
        [Result_19],
        ['query'],
      ),
    'admin_list_referral_rewards_page' : IDL.Func(
        [PageRequest],
        [Result_20],
        ['query'],
      ),
    'admin_list_referral_withdrawals_page' : IDL.Func(
        [PageRequest],
        [Result_21],
        ['query'],
      ),
    'admin_list_users' : IDL.Func([], [Result_22], ['query']),
    'admin_list_users_page' : IDL.Func(
        [UserPageRequest],
        [Result_23],
        ['query'],
      ),
    'admin_propose_owner' : IDL.Func([IDL.Opt(IDL.Principal)], [Result_1], []),
    'admin_reconcile_order_refund' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_24],
        [],
      ),
    'admin_refund_order' : IDL.Func([IDL.Nat64], [Result_24], []),
    'admin_remove_deployment_target' : IDL.Func([IDL.Text], [Result_1], []),
    'admin_set_admin' : IDL.Func([IDL.Principal, IDL.Bool], [Result_1], []),
    'admin_set_custom_domains' : IDL.Func([IDL.Vec(IDL.Text)], [Result_25], []),
    'admin_set_drift_bottle_status' : IDL.Func(
        [AdminSetDriftBottleStatusInput],
        [Result_26],
        [],
      ),
    'admin_set_version_published' : IDL.Func(
        [IDL.Nat64, IDL.Bool],
        [Result_4],
        [],
      ),
    'admin_transfer_cycles' : IDL.Func(
        [TransferMarketCyclesInput],
        [Result_27],
        [],
      ),
    'admin_update_config' : IDL.Func([UpdateConfigInput], [Result_1], []),
    'admin_update_drift_bottle_config' : IDL.Func(
        [DriftBottleConfig],
        [Result_28],
        [],
      ),
    'admin_update_referral_config' : IDL.Func(
        [ReferralConfig],
        [Result_29],
        [],
      ),
    'admin_upload_tool_attachment_chunk' : IDL.Func(
        [IDL.Nat64, IDL.Nat32, IDL.Vec(IDL.Nat8)],
        [Result_2],
        [],
      ),
    'admin_upload_wasm_chunk' : IDL.Func(
        [IDL.Nat64, IDL.Nat32, IDL.Vec(IDL.Nat8)],
        [Result_2],
        [],
      ),
    'admin_upsert_deployment_target' : IDL.Func(
        [DeploymentTarget],
        [Result_30],
        [],
      ),
    'admin_upsert_official_tool' : IDL.Func(
        [UpsertOfficialToolInput],
        [Result_3],
        [],
      ),
    'admin_upsert_platform_update' : IDL.Func(
        [UpsertPlatformUpdateInput],
        [Result_31],
        [],
      ),
    'admin_withdraw_icp' : IDL.Func([WithdrawIcpInput], [Result_32], []),
    'block_bottle_participant' : IDL.Func(
        [BlockBottleParticipantInput],
        [Result],
        [],
      ),
    'claim_referral' : IDL.Func([IDL.Text], [Result_33], []),
    'collect_drift_bottle_garbage' : IDL.Func(
        [CollectDriftBottleGarbageInput],
        [Result_34],
        [],
      ),
    'confirm_bottle_message_delivery' : IDL.Func(
        [FinishBottleMessageInput],
        [Result],
        [],
      ),
    'create_deployment_order' : IDL.Func([CreateOrderInput], [Result_24], []),
    'create_drift_bottle' : IDL.Func([CreateDriftBottleInput], [Result_26], []),
    'create_upgrade_order' : IDL.Func([UpgradeOrderInput], [Result_24], []),
    'detach_market_from_my_oss' : IDL.Func([IDL.Nat64], [Result_35], []),
    'ensure_my_referral_account' : IDL.Func([], [Result_33], []),
    'fish_drift_bottle' : IDL.Func([FishDriftBottleInput], [Result_36], []),
    'get_admin_dashboard' : IDL.Func([], [Result_37], ['query']),
    'get_domain_config' : IDL.Func([], [MarketDomainConfig], ['query']),
    'get_drift_bottle_config' : IDL.Func([], [DriftBottleConfig], ['query']),
    'get_market_sales_readiness' : IDL.Func(
        [],
        [MarketSalesReadiness],
        ['query'],
      ),
    'get_my_dashboard' : IDL.Func([], [Result_38], ['query']),
    'get_my_drift_bottle_quota' : IDL.Func([], [Result_39], ['query']),
    'get_my_oss_access' : IDL.Func([IDL.Nat64], [Result_40], []),
    'get_my_referral_summary' : IDL.Func([], [Result_33], ['query']),
    'get_platform_update' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(PlatformUpdate)],
        ['query'],
      ),
    'get_public_config' : IDL.Func([], [PublicConfig], ['query']),
    'get_public_dashboard' : IDL.Func([], [PublicDashboard], ['query']),
    'get_session' : IDL.Func([], [Result_41], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
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
    'list_my_bottle_catches' : IDL.Func(
        [BottlePageRequest],
        [Result_42],
        ['query'],
      ),
    'list_my_deployments' : IDL.Func([], [Result_11], ['query']),
    'list_my_deployments_page' : IDL.Func(
        [PageRequest],
        [Result_12],
        ['query'],
      ),
    'list_my_drift_bottles' : IDL.Func(
        [BottlePageRequest],
        [Result_43],
        ['query'],
      ),
    'list_my_orders' : IDL.Func([], [Result_17], ['query']),
    'list_my_orders_page' : IDL.Func([PageRequest], [Result_18], ['query']),
    'list_my_referral_rewards_page' : IDL.Func(
        [PageRequest],
        [Result_20],
        ['query'],
      ),
    'list_my_referral_withdrawals_page' : IDL.Func(
        [PageRequest],
        [Result_21],
        ['query'],
      ),
    'list_my_upgrades' : IDL.Func([], [Result_44], ['query']),
    'list_my_upgrades_page' : IDL.Func([PageRequest], [Result_45], ['query']),
    'list_official_tools' : IDL.Func([], [IDL.Vec(OfficialTool)], ['query']),
    'list_platform_updates_page' : IDL.Func(
        [PageRequest],
        [Result_19],
        ['query'],
      ),
    'list_versions' : IDL.Func([], [IDL.Vec(WasmVersionSummary)], ['query']),
    'list_versions_page' : IDL.Func([PageRequest], [Result_46], ['query']),
    'pay_order' : IDL.Func([IDL.Nat64], [Result_24], []),
    'reconcile_order_payment' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_24],
        [],
      ),
    'refresh_drift_bottle_share' : IDL.Func(
        [RefreshDriftBottleShareInput],
        [Result_26],
        [],
      ),
    'refresh_my_deployment' : IDL.Func([IDL.Nat64], [Result_35], []),
    'report_drift_bottle' : IDL.Func([ReportBottleInput], [Result], []),
    'reserve_bottle_message_delivery' : IDL.Func(
        [ReserveBottleMessageInput],
        [Result_47],
        [],
      ),
    'retry_order' : IDL.Func([IDL.Nat64], [Result_24], []),
    'set_drift_bottle_messages' : IDL.Func(
        [SetBottleMessagesInput],
        [Result_26],
        [],
      ),
    'set_my_oss_controllers' : IDL.Func(
        [SetOssControllersInput],
        [Result_40],
        [],
      ),
    'set_my_oss_managers' : IDL.Func([SetOssManagersInput], [Result_40], []),
    'update_drift_bottle_introduction' : IDL.Func(
        [UpdateDriftBottleIntroductionInput],
        [Result_26],
        [],
      ),
    'withdraw_drift_bottle' : IDL.Func([BottleMutationInput], [Result_26], []),
    'withdraw_referral_reward' : IDL.Func([WithdrawIcpInput], [Result_48], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'owner' : IDL.Opt(IDL.Principal),
    'create_price_e8s' : IDL.Opt(IDL.Nat64),
    'deployment_cycles' : IDL.Opt(IDL.Nat),
    'upgrade_price_e8s' : IDL.Opt(IDL.Nat64),
    'sales_enabled' : IDL.Opt(IDL.Bool),
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  return [InitArgs];
};

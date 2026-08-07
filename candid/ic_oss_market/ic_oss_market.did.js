export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    'owner' : IDL.Opt(IDL.Principal),
    'create_price_e8s' : IDL.Opt(IDL.Nat64),
    'deployment_cycles' : IDL.Opt(IDL.Nat),
    'upgrade_price_e8s' : IDL.Opt(IDL.Nat64),
    'sales_enabled' : IDL.Opt(IDL.Bool),
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
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
  const MarketConfig = IDL.Record({
    'deployment_targets' : IDL.Vec(IDL.Tuple(IDL.Text, DeploymentTarget)),
    'custom_domains' : IDL.Opt(IDL.Vec(IDL.Text)),
    'owner' : IDL.Principal,
    'create_price_e8s' : IDL.Nat64,
    'deployment_cycles' : IDL.Nat,
    'admins' : IDL.Vec(IDL.Principal),
    'upgrade_price_e8s' : IDL.Nat64,
    'sales_enabled' : IDL.Bool,
    'pending_owner' : IDL.Opt(IDL.Principal),
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const Result = IDL.Variant({ 'Ok' : MarketConfig, 'Err' : IDL.Text });
  const BeginWasmUploadInput = IDL.Record({
    'expected_size' : IDL.Nat64,
    'version' : IDL.Text,
    'expected_sha256' : IDL.Vec(IDL.Nat8),
    'release_notes' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
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
  const Result_2 = IDL.Variant({ 'Ok' : WasmVersionSummary, 'Err' : IDL.Text });
  const MarketCyclesStatus = IDL.Record({
    'balance' : IDL.Nat,
    'reserved_deployment_cycles' : IDL.Nat,
    'available_deployment_slots' : IDL.Nat64,
    'deployment_cycles' : IDL.Nat,
    'transferable_cycles' : IDL.Nat,
    'reserve_cycles' : IDL.Nat,
  });
  const Result_3 = IDL.Variant({ 'Ok' : MarketCyclesStatus, 'Err' : IDL.Text });
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
    'market_account' : Account,
    'recorded_revenue_e8s' : IDL.Nat64,
  });
  const Result_4 = IDL.Variant({ 'Ok' : MarketIcpRevenue, 'Err' : IDL.Text });
  const MarketStorageStatus = IDL.Record({
    'previous_snapshot_bytes' : IDL.Nat64,
    'wasm_versions' : IDL.Nat64,
    'active_generation' : IDL.Nat8,
    'pending_upload_bytes' : IDL.Nat64,
    'wasm_bytes' : IDL.Nat64,
    'active_snapshot_bytes' : IDL.Nat64,
    'layout_version' : IDL.Nat16,
  });
  const Result_5 = IDL.Variant({
    'Ok' : MarketStorageStatus,
    'Err' : IDL.Text,
  });
  const MarketUpgradeReadiness = IDL.Record({
    'processing_orders' : IDL.Nat64,
    'provisioning_orders' : IDL.Nat64,
    'pending_withdrawals' : IDL.Nat64,
    'refunding_orders' : IDL.Nat64,
    'paid_orders' : IDL.Nat64,
    'ready' : IDL.Bool,
  });
  const Result_6 = IDL.Variant({
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
  const Result_7 = IDL.Variant({
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
  const Result_8 = IDL.Variant({ 'Ok' : DeploymentPage, 'Err' : IDL.Text });
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
  const Result_9 = IDL.Variant({ 'Ok' : IcpWithdrawalPage, 'Err' : IDL.Text });
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
    'refunded_at_ms' : IDL.Opt(IDL.Nat64),
    'kind' : OperationKind,
    'ledger_block' : IDL.Opt(IDL.Nat64),
    'target_subnet_id' : IDL.Opt(IDL.Principal),
    'created_at_ms' : IDL.Nat64,
    'amount_e8s' : IDL.Nat64,
    'deployment_cycles' : IDL.Opt(IDL.Nat),
    'transfer_created_at_time' : IDL.Nat64,
    'provisioning_started_at_ms' : IDL.Opt(IDL.Nat64),
    'refund_block' : IDL.Opt(IDL.Nat64),
    'refund_transfer_created_at_time' : IDL.Opt(IDL.Nat64),
    'buyer' : IDL.Principal,
    'target_version_id' : IDL.Nat64,
    'deployment_target_id' : IDL.Text,
    'expires_at_ms' : IDL.Nat64,
    'deployment_id' : IDL.Opt(IDL.Nat64),
    'idempotency_key' : IDL.Text,
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const Result_10 = IDL.Variant({ 'Ok' : IDL.Vec(Order), 'Err' : IDL.Text });
  const OrderPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(Order),
  });
  const Result_11 = IDL.Variant({ 'Ok' : OrderPage, 'Err' : IDL.Text });
  const UserSummary = IDL.Record({
    'last_active_at_ms' : IDL.Nat64,
    'total_paid_e8s' : IDL.Nat64,
    'principal' : IDL.Principal,
    'order_count' : IDL.Nat64,
    'deployment_count' : IDL.Nat64,
  });
  const Result_12 = IDL.Variant({
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
  const Result_13 = IDL.Variant({ 'Ok' : UserSummaryPage, 'Err' : IDL.Text });
  const Result_14 = IDL.Variant({ 'Ok' : Order, 'Err' : IDL.Text });
  const MarketDomainConfig = IDL.Record({
    'derivation_origin' : IDL.Text,
    'custom_domains' : IDL.Vec(IDL.Text),
    'canister_id' : IDL.Principal,
  });
  const Result_15 = IDL.Variant({
    'Ok' : MarketDomainConfig,
    'Err' : IDL.Text,
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
  const Result_16 = IDL.Variant({
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
  const Result_17 = IDL.Variant({ 'Ok' : DeploymentTarget, 'Err' : IDL.Text });
  const WithdrawIcpInput = IDL.Record({
    'to' : Account,
    'amount_e8s' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_18 = IDL.Variant({ 'Ok' : IcpWithdrawal, 'Err' : IDL.Text });
  const CreateOrderInput = IDL.Record({
    'name' : IDL.Text,
    'deployment_target_id' : IDL.Opt(IDL.Text),
    'idempotency_key' : IDL.Text,
  });
  const UpgradeOrderInput = IDL.Record({
    'deployment_id' : IDL.Nat64,
    'idempotency_key' : IDL.Text,
  });
  const Result_19 = IDL.Variant({ 'Ok' : Deployment, 'Err' : IDL.Text });
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
  const OssAccess = IDL.Record({
    'market_controller' : IDL.Principal,
    'controllers' : IDL.Vec(IDL.Principal),
    'managers' : IDL.Vec(IDL.Principal),
    'canister' : IDL.Principal,
    'deployment_id' : IDL.Nat64,
  });
  const Result_20 = IDL.Variant({ 'Ok' : OssAccess, 'Err' : IDL.Text });
  const PublicConfig = IDL.Record({
    'deployment_targets' : IDL.Vec(DeploymentTarget),
    'available_deployment_slots' : IDL.Nat64,
    'create_price_e8s' : IDL.Nat64,
    'upgrade_price_e8s' : IDL.Nat64,
    'latest_version' : IDL.Opt(WasmVersionSummary),
    'sales_enabled' : IDL.Bool,
    'payment_ledger' : IDL.Opt(IDL.Principal),
  });
  const Result_21 = IDL.Variant({
    'Ok' : IDL.Tuple(IDL.Principal, IDL.Bool),
    'Err' : IDL.Text,
  });
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
    'upgrade' : IDL.Opt(IDL.Bool),
    'status_code' : IDL.Nat16,
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
  const Result_22 = IDL.Variant({
    'Ok' : IDL.Vec(UpgradeRecord),
    'Err' : IDL.Text,
  });
  const UpgradePage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(UpgradeRecord),
  });
  const Result_23 = IDL.Variant({ 'Ok' : UpgradePage, 'Err' : IDL.Text });
  const WasmVersionPage = IDL.Record({
    'total' : IDL.Nat64,
    'next_cursor' : IDL.Opt(IDL.Nat64),
    'items' : IDL.Vec(WasmVersionSummary),
  });
  const Result_24 = IDL.Variant({ 'Ok' : WasmVersionPage, 'Err' : IDL.Text });
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
  return IDL.Service({
    'accept_market_ownership' : IDL.Func([], [Result], []),
    'admin_begin_wasm_upload' : IDL.Func(
        [BeginWasmUploadInput],
        [Result_1],
        [],
      ),
    'admin_cleanup_expired_orders' : IDL.Func([], [Result_1], []),
    'admin_commit_wasm_upload' : IDL.Func(
        [IDL.Nat64, IDL.Bool],
        [Result_2],
        [],
      ),
    'admin_get_config' : IDL.Func([], [Result], ['query']),
    'admin_get_cycles_status' : IDL.Func([], [Result_3], ['query']),
    'admin_get_icp_revenue' : IDL.Func([], [Result_4], []),
    'admin_get_storage_status' : IDL.Func([], [Result_5], ['query']),
    'admin_get_upgrade_readiness' : IDL.Func([], [Result_6], ['query']),
    'admin_list_deployments' : IDL.Func([], [Result_7], ['query']),
    'admin_list_deployments_page' : IDL.Func(
        [PageRequest],
        [Result_8],
        ['query'],
      ),
    'admin_list_icp_withdrawals_page' : IDL.Func(
        [PageRequest],
        [Result_9],
        ['query'],
      ),
    'admin_list_orders' : IDL.Func([], [Result_10], ['query']),
    'admin_list_orders_page' : IDL.Func([PageRequest], [Result_11], ['query']),
    'admin_list_users' : IDL.Func([], [Result_12], ['query']),
    'admin_list_users_page' : IDL.Func(
        [UserPageRequest],
        [Result_13],
        ['query'],
      ),
    'admin_propose_owner' : IDL.Func([IDL.Opt(IDL.Principal)], [Result], []),
    'admin_reconcile_order_refund' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_14],
        [],
      ),
    'admin_refund_order' : IDL.Func([IDL.Nat64], [Result_14], []),
    'admin_remove_deployment_target' : IDL.Func([IDL.Text], [Result], []),
    'admin_set_admin' : IDL.Func([IDL.Principal, IDL.Bool], [Result], []),
    'admin_set_custom_domains' : IDL.Func([IDL.Vec(IDL.Text)], [Result_15], []),
    'admin_set_version_published' : IDL.Func(
        [IDL.Nat64, IDL.Bool],
        [Result_2],
        [],
      ),
    'admin_transfer_cycles' : IDL.Func(
        [TransferMarketCyclesInput],
        [Result_16],
        [],
      ),
    'admin_update_config' : IDL.Func([UpdateConfigInput], [Result], []),
    'admin_upload_wasm_chunk' : IDL.Func(
        [IDL.Nat64, IDL.Nat32, IDL.Vec(IDL.Nat8)],
        [Result_1],
        [],
      ),
    'admin_upsert_deployment_target' : IDL.Func(
        [DeploymentTarget],
        [Result_17],
        [],
      ),
    'admin_withdraw_icp' : IDL.Func([WithdrawIcpInput], [Result_18], []),
    'create_deployment_order' : IDL.Func([CreateOrderInput], [Result_14], []),
    'create_upgrade_order' : IDL.Func([UpgradeOrderInput], [Result_14], []),
    'detach_market_from_my_oss' : IDL.Func([IDL.Nat64], [Result_19], []),
    'get_domain_config' : IDL.Func([], [MarketDomainConfig], ['query']),
    'get_market_sales_readiness' : IDL.Func(
        [],
        [MarketSalesReadiness],
        ['query'],
      ),
    'get_my_oss_access' : IDL.Func([IDL.Nat64], [Result_20], []),
    'get_public_config' : IDL.Func([], [PublicConfig], ['query']),
    'get_session' : IDL.Func([], [Result_21], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'list_my_deployments' : IDL.Func([], [Result_7], ['query']),
    'list_my_deployments_page' : IDL.Func([PageRequest], [Result_8], ['query']),
    'list_my_orders' : IDL.Func([], [Result_10], ['query']),
    'list_my_orders_page' : IDL.Func([PageRequest], [Result_11], ['query']),
    'list_my_upgrades' : IDL.Func([], [Result_22], ['query']),
    'list_my_upgrades_page' : IDL.Func([PageRequest], [Result_23], ['query']),
    'list_versions' : IDL.Func([], [IDL.Vec(WasmVersionSummary)], ['query']),
    'list_versions_page' : IDL.Func([PageRequest], [Result_24], ['query']),
    'pay_order' : IDL.Func([IDL.Nat64], [Result_14], []),
    'reconcile_order_payment' : IDL.Func(
        [IDL.Nat64, IDL.Nat64],
        [Result_14],
        [],
      ),
    'refresh_my_deployment' : IDL.Func([IDL.Nat64], [Result_19], []),
    'retry_order' : IDL.Func([IDL.Nat64], [Result_14], []),
    'set_my_oss_controllers' : IDL.Func(
        [SetOssControllersInput],
        [Result_20],
        [],
      ),
    'set_my_oss_managers' : IDL.Func([SetOssManagersInput], [Result_20], []),
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

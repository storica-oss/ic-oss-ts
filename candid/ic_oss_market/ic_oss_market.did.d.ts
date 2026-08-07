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
export interface BeginWasmUploadInput {
  'expected_size' : bigint,
  'version' : string,
  'expected_sha256' : Uint8Array | number[],
  'release_notes' : string,
}
export interface CreateOrderInput {
  'name' : string,
  'deployment_target_id' : [] | [string],
  'idempotency_key' : string,
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
  'market_account' : Account,
  'recorded_revenue_e8s' : bigint,
}
export interface MarketSalesReadiness {
  'blockers' : Array<SalesReadinessBlocker>,
  'available_deployment_slots' : bigint,
  'ready' : boolean,
}
export interface MarketStorageStatus {
  'previous_snapshot_bytes' : bigint,
  'wasm_versions' : bigint,
  'active_generation' : number,
  'pending_upload_bytes' : bigint,
  'wasm_bytes' : bigint,
  'active_snapshot_bytes' : bigint,
  'layout_version' : number,
}
export interface MarketUpgradeReadiness {
  'processing_orders' : bigint,
  'provisioning_orders' : bigint,
  'pending_withdrawals' : bigint,
  'refunding_orders' : bigint,
  'paid_orders' : bigint,
  'ready' : boolean,
}
export type OperationKind = { 'Upgrade' : null } |
  { 'Create' : null };
export interface Order {
  'id' : bigint,
  'last_error' : [] | [string],
  'status' : OrderStatus,
  'requested_name' : [] | [string],
  'refunded_at_ms' : [] | [bigint],
  'kind' : OperationKind,
  'ledger_block' : [] | [bigint],
  'target_subnet_id' : [] | [Principal],
  'created_at_ms' : bigint,
  'amount_e8s' : bigint,
  'deployment_cycles' : [] | [bigint],
  'transfer_created_at_time' : bigint,
  'provisioning_started_at_ms' : [] | [bigint],
  'refund_block' : [] | [bigint],
  'refund_transfer_created_at_time' : [] | [bigint],
  'buyer' : Principal,
  'target_version_id' : bigint,
  'deployment_target_id' : string,
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
export interface PublicConfig {
  'deployment_targets' : Array<DeploymentTarget>,
  'available_deployment_slots' : bigint,
  'create_price_e8s' : bigint,
  'upgrade_price_e8s' : bigint,
  'latest_version' : [] | [WasmVersionSummary],
  'sales_enabled' : boolean,
  'payment_ledger' : [] | [Principal],
}
export type Result = { 'Ok' : MarketConfig } |
  { 'Err' : string };
export type Result_1 = { 'Ok' : bigint } |
  { 'Err' : string };
export type Result_10 = { 'Ok' : Array<Order> } |
  { 'Err' : string };
export type Result_11 = { 'Ok' : OrderPage } |
  { 'Err' : string };
export type Result_12 = { 'Ok' : Array<UserSummary> } |
  { 'Err' : string };
export type Result_13 = { 'Ok' : UserSummaryPage } |
  { 'Err' : string };
export type Result_14 = { 'Ok' : Order } |
  { 'Err' : string };
export type Result_15 = { 'Ok' : MarketDomainConfig } |
  { 'Err' : string };
export type Result_16 = { 'Ok' : TransferMarketCyclesOutput } |
  { 'Err' : string };
export type Result_17 = { 'Ok' : DeploymentTarget } |
  { 'Err' : string };
export type Result_18 = { 'Ok' : IcpWithdrawal } |
  { 'Err' : string };
export type Result_19 = { 'Ok' : Deployment } |
  { 'Err' : string };
export type Result_2 = { 'Ok' : WasmVersionSummary } |
  { 'Err' : string };
export type Result_20 = { 'Ok' : OssAccess } |
  { 'Err' : string };
export type Result_21 = { 'Ok' : [Principal, boolean] } |
  { 'Err' : string };
export type Result_22 = { 'Ok' : Array<UpgradeRecord> } |
  { 'Err' : string };
export type Result_23 = { 'Ok' : UpgradePage } |
  { 'Err' : string };
export type Result_24 = { 'Ok' : WasmVersionPage } |
  { 'Err' : string };
export type Result_3 = { 'Ok' : MarketCyclesStatus } |
  { 'Err' : string };
export type Result_4 = { 'Ok' : MarketIcpRevenue } |
  { 'Err' : string };
export type Result_5 = { 'Ok' : MarketStorageStatus } |
  { 'Err' : string };
export type Result_6 = { 'Ok' : MarketUpgradeReadiness } |
  { 'Err' : string };
export type Result_7 = { 'Ok' : Array<Deployment> } |
  { 'Err' : string };
export type Result_8 = { 'Ok' : DeploymentPage } |
  { 'Err' : string };
export type Result_9 = { 'Ok' : IcpWithdrawalPage } |
  { 'Err' : string };
export type SalesReadinessBlocker = { 'DeploymentTargetMissing' : null } |
  { 'PaymentLedgerMissing' : null } |
  { 'UpgradePriceZero' : null } |
  { 'PublishedWasmMissing' : null } |
  { 'InsufficientCycles' : null } |
  { 'CreatePriceZero' : null } |
  { 'DeploymentCyclesZero' : null };
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
export interface UserPageRequest {
  'cursor' : [] | [Principal],
  'limit' : number,
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
  'accept_market_ownership' : ActorMethod<[], Result>,
  'admin_begin_wasm_upload' : ActorMethod<[BeginWasmUploadInput], Result_1>,
  'admin_cleanup_expired_orders' : ActorMethod<[], Result_1>,
  'admin_commit_wasm_upload' : ActorMethod<[bigint, boolean], Result_2>,
  'admin_get_config' : ActorMethod<[], Result>,
  'admin_get_cycles_status' : ActorMethod<[], Result_3>,
  'admin_get_icp_revenue' : ActorMethod<[], Result_4>,
  'admin_get_storage_status' : ActorMethod<[], Result_5>,
  'admin_get_upgrade_readiness' : ActorMethod<[], Result_6>,
  'admin_list_deployments' : ActorMethod<[], Result_7>,
  'admin_list_deployments_page' : ActorMethod<[PageRequest], Result_8>,
  'admin_list_icp_withdrawals_page' : ActorMethod<[PageRequest], Result_9>,
  'admin_list_orders' : ActorMethod<[], Result_10>,
  'admin_list_orders_page' : ActorMethod<[PageRequest], Result_11>,
  'admin_list_users' : ActorMethod<[], Result_12>,
  'admin_list_users_page' : ActorMethod<[UserPageRequest], Result_13>,
  'admin_propose_owner' : ActorMethod<[[] | [Principal]], Result>,
  'admin_reconcile_order_refund' : ActorMethod<[bigint, bigint], Result_14>,
  'admin_refund_order' : ActorMethod<[bigint], Result_14>,
  'admin_remove_deployment_target' : ActorMethod<[string], Result>,
  'admin_set_admin' : ActorMethod<[Principal, boolean], Result>,
  'admin_set_custom_domains' : ActorMethod<[Array<string>], Result_15>,
  'admin_set_version_published' : ActorMethod<[bigint, boolean], Result_2>,
  'admin_transfer_cycles' : ActorMethod<[TransferMarketCyclesInput], Result_16>,
  'admin_update_config' : ActorMethod<[UpdateConfigInput], Result>,
  'admin_upload_wasm_chunk' : ActorMethod<
    [bigint, number, Uint8Array | number[]],
    Result_1
  >,
  'admin_upsert_deployment_target' : ActorMethod<[DeploymentTarget], Result_17>,
  'admin_withdraw_icp' : ActorMethod<[WithdrawIcpInput], Result_18>,
  'create_deployment_order' : ActorMethod<[CreateOrderInput], Result_14>,
  'create_upgrade_order' : ActorMethod<[UpgradeOrderInput], Result_14>,
  'detach_market_from_my_oss' : ActorMethod<[bigint], Result_19>,
  'get_domain_config' : ActorMethod<[], MarketDomainConfig>,
  'get_market_sales_readiness' : ActorMethod<[], MarketSalesReadiness>,
  'get_my_oss_access' : ActorMethod<[bigint], Result_20>,
  'get_public_config' : ActorMethod<[], PublicConfig>,
  'get_session' : ActorMethod<[], Result_21>,
  'http_request' : ActorMethod<[HttpRequest], HttpResponse>,
  'list_my_deployments' : ActorMethod<[], Result_7>,
  'list_my_deployments_page' : ActorMethod<[PageRequest], Result_8>,
  'list_my_orders' : ActorMethod<[], Result_10>,
  'list_my_orders_page' : ActorMethod<[PageRequest], Result_11>,
  'list_my_upgrades' : ActorMethod<[], Result_22>,
  'list_my_upgrades_page' : ActorMethod<[PageRequest], Result_23>,
  'list_versions' : ActorMethod<[], Array<WasmVersionSummary>>,
  'list_versions_page' : ActorMethod<[PageRequest], Result_24>,
  'pay_order' : ActorMethod<[bigint], Result_14>,
  'reconcile_order_payment' : ActorMethod<[bigint, bigint], Result_14>,
  'refresh_my_deployment' : ActorMethod<[bigint], Result_19>,
  'retry_order' : ActorMethod<[bigint], Result_14>,
  'set_my_oss_controllers' : ActorMethod<[SetOssControllersInput], Result_20>,
  'set_my_oss_managers' : ActorMethod<[SetOssManagersInput], Result_20>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

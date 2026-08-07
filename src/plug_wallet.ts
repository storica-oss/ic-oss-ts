import {
  Actor,
  HttpAgent,
  type ActorSubclass,
  type DerEncodedPublicKey,
  type Identity,
  type Signature
} from '@dfinity/agent'
import type { IDL } from '@dfinity/candid'
import {
  Delegation,
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity
} from '@dfinity/identity'
import { Principal } from '@dfinity/principal'
import type {
  WalletAdapter,
  WalletConnectRequest,
  WalletConnection
} from './wallet_adapter'

export interface PlugConnectOptions {
  whitelist: string[]
  host: string
  timeout?: number
  onConnectionUpdate?: () => void | Promise<void>
}

const PLUG_REQUEST_TIMEOUT_MS = 65_000
const PLUG_DISCONNECT_TIMEOUT_MS = 2_000
export const PLUG_STALE_LOCAL_SESSION_MESSAGE =
  'Plug 的旧本地授权已失效，已自动清理。请再次点击 Plug Wallet 并批准连接'
export const PLUG_REQUEST_TIMEOUT_MESSAGE =
  '等待 Plug 授权超时。请解锁 Plug，并重新点击钱包登录'

export class StalePlugSessionError extends Error {
  constructor() {
    super(PLUG_STALE_LOCAL_SESSION_MESSAGE)
    this.name = 'StalePlugSessionError'
  }
}

export interface PlugActorOptions {
  canisterId: string
  interfaceFactory: IDL.InterfaceFactory
}

interface PlugRequestOptions {
  id: string
  method: string
  params?: Record<string, unknown>
  jsonrpc: '2.0'
}

interface PlugDelegationResult {
  publicKey: string
  signerDelegation: Array<{
    delegation: {
      pubkey: string
      expiration: string
      targets?: string[]
    }
    signature: string
  }>
}

type PlugAgent = HttpAgent & {
  /**
   * Plug 2.17+ exposes an ICRC-34 backed, target-restricted delegation here.
   * It lets localhost use the application's Agent without exposing wallet keys.
   */
  getDelegationIdentity?: () => Promise<Identity | undefined>
}

export interface PlugProvider {
  agent?: PlugAgent
  principalId?: string
  requestConnect: (options: PlugConnectOptions) => Promise<unknown>
  isConnected: () => Promise<boolean>
  disconnect: () => Promise<void>
  createActor: <T>(options: PlugActorOptions) => Promise<ActorSubclass<T>>
  request?: (options: PlugRequestOptions) => Promise<{
    result?: PlugDelegationResult
    error?: { message?: string } | string
  }>
  onExternalDisconnect?: (callback: () => void) => void
}

declare global {
  interface Window {
    ic?: {
      plug?: PlugProvider
    }
  }
}

export function browserPlugProvider() {
  return typeof window === 'undefined' ? undefined : window.ic?.plug
}

export function uniqueCanisters(canisters: string[]) {
  return Array.from(new Set(canisters.filter(Boolean))).sort()
}

export function requirePlugAgent(provider: PlugProvider) {
  if (!provider.agent)
    throw new Error('Plug 已连接，但没有提供可用的 IC Agent，请解锁钱包后重试')
  return provider.agent
}

export function isLocalWalletHost(host: string) {
  try {
    const hostname = new URL(host).hostname
    return (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]'
    )
  } catch {
    return false
  }
}

export type LocalPlugAgentFactory = (
  identity: Identity,
  host: string
) => Promise<HttpAgent>

async function createLocalPlugAgent(identity: Identity, host: string) {
  const agent = HttpAgent.createSync({
    identity,
    host,
    // PocketIC does not attach replica node signatures to query responses.
    // This exception is deliberately restricted to a loopback host.
    verifyQuerySignatures: false
  })
  await agent.fetchRootKey()
  return agent
}

async function createPlugSessionAgent(
  provider: PlugProvider,
  host: string,
  canisters: string[],
  createLocalAgent: LocalPlugAgentFactory,
  existingAgent?: HttpAgent
) {
  const plugAgent = requirePlugAgent(provider)
  if (!isLocalWalletHost(host)) return plugAgent

  const identity = provider.request
    ? await requestPlugDelegationIdentity(provider, canisters)
    : await plugAgent.getDelegationIdentity?.()
  if (!identity && !plugAgent.getDelegationIdentity && !provider.request) {
    throw new Error(
      '当前 Plug 版本不支持本地安全委托，请升级到 Plug 2.17 或更高版本后重试'
    )
  }
  if (!identity) {
    throw new Error('Plug 未能生成本地委托身份，请断开当前站点授权后重新连接')
  }
  const [walletPrincipal, delegatedPrincipal] = await Promise.all([
    plugAgent.getPrincipal(),
    Promise.resolve(identity.getPrincipal())
  ])
  if (walletPrincipal.toText() !== delegatedPrincipal.toText()) {
    throw new Error('Plug 委托身份与当前钱包账户不一致，已拒绝建立会话')
  }
  if (existingAgent && typeof existingAgent.replaceIdentity === 'function') {
    existingAgent.replaceIdentity(identity)
    return existingAgent
  }
  return createLocalAgent(identity, host)
}

async function requestPlugDelegationIdentity(
  provider: PlugProvider,
  canisters: string[]
) {
  if (!provider.request) return undefined
  const sessionKey = Ed25519KeyIdentity.generate()
  const response = await provider.request({
    id: `ic-oss-wallet-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    method: 'icrc34_delegation',
    params: {
      publicKey: encodeBase64(sessionKey.getPublicKey().toDer()),
      targets: canisters
    },
    jsonrpc: '2.0'
  })
  if (response.error) {
    const message =
      typeof response.error === 'string'
        ? response.error
        : response.error.message || 'Plug 拒绝签发委托'
    throw new Error(message)
  }
  const result = response.result
  if (!result?.publicKey || !Array.isArray(result.signerDelegation)) {
    throw new Error('Plug 返回了无效的 ICRC-34 委托')
  }
  const finalDelegation = result.signerDelegation.at(-1)?.delegation
  const sessionPublicKey = sessionKey.getPublicKey().toDer()
  if (
    !finalDelegation ||
    !sameBytes(decodeBase64(finalDelegation.pubkey), sessionPublicKey) ||
    !finalDelegation.targets ||
    canisters.some((canister) => !finalDelegation.targets?.includes(canister))
  ) {
    throw new Error('Plug 返回的委托未正确限制到当前 Canister')
  }
  const delegations = result.signerDelegation.map((item) => ({
    delegation: new Delegation(
      decodeBase64(item.delegation.pubkey),
      BigInt(item.delegation.expiration),
      item.delegation.targets?.map((target) => Principal.fromText(target))
    ),
    signature: decodeBase64(item.signature) as Signature
  }))
  const chain = DelegationChain.fromDelegations(
    delegations,
    decodeBase64(result.publicKey) as DerEncodedPublicKey
  )
  return DelegationIdentity.fromDelegation(sessionKey, chain)
}

function encodeBase64(value: Uint8Array) {
  let binary = ''
  for (const byte of value) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function decodeBase64(value: string) {
  const binary = atob(value)
  return Uint8Array.from(binary, (character) => character.charCodeAt(0))
}

function sameBytes(left: Uint8Array, right: Uint8Array) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  )
}

export function plugNotInstalledMessage() {
  return '未检测到 Plug 钱包扩展。请安装并启用 Plug，刷新页面后重试'
}

class PlugWalletConnection implements WalletConnection {
  readonly id = 'plug'
  readonly name = 'Plug Wallet'
  private canisters: string[] = []
  private sessionAgent: HttpAgent | undefined

  constructor(
    private readonly provider: PlugProvider,
    private readonly request: WalletConnectRequest,
    private readonly createLocalAgent: LocalPlugAgentFactory
  ) {
    provider.onExternalDisconnect?.(request.events.disconnected)
  }

  async initialize() {
    await this.ensureCanisters(this.request.canisters)
    return this
  }

  principal() {
    return this.agent().getPrincipal()
  }

  agent() {
    if (!this.sessionAgent)
      throw new Error('Plug 已连接，但本地委托 Agent 尚未初始化')
    return this.sessionAgent
  }

  async ensureCanisters(canisters: string[]) {
    const whitelist = uniqueCanisters([...this.canisters, ...canisters])
    if (
      this.provider.agent &&
      whitelist.length === this.canisters.length &&
      whitelist.every((value, index) => value === this.canisters[index])
    )
      return
    await this.connectSession(whitelist)
  }

  refreshSession() {
    return this.connectSession(this.canisters)
  }

  private async connectSession(whitelist: string[]) {
    await withTimeout(
      this.provider.requestConnect({
        whitelist,
        host: this.request.host,
        timeout: 60_000,
        onConnectionUpdate: this.request.events.accountChanged
      }),
      PLUG_REQUEST_TIMEOUT_MS,
      PLUG_REQUEST_TIMEOUT_MESSAGE
    )
    this.sessionAgent = await createPlugSessionAgent(
      this.provider,
      this.request.agentHost || this.request.host,
      whitelist,
      this.createLocalAgent,
      isLocalWalletHost(this.request.agentHost || this.request.host)
        ? this.sessionAgent
        : undefined
    )
    this.canisters = whitelist
  }

  async createActor<T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) {
    await this.ensureCanisters([canisterId])
    if (!isLocalWalletHost(this.request.agentHost || this.request.host)) {
      return this.provider.createActor<T>({ canisterId, interfaceFactory })
    }
    return Actor.createActor<T>(interfaceFactory, {
      agent: this.agent(),
      canisterId
    })
  }

  disconnect() {
    return this.provider.disconnect()
  }
}

export function isStalePlugSessionError(error: unknown) {
  return (
    error instanceof StalePlugSessionError ||
    /canister_not_found|canister not found|certificate verification|invalid certificate|invalid delegation expiry|sender delegation has expired|delegation (?:has )?expired/i.test(
      plugErrorMessage(error)
    )
  )
}

async function initializePlugConnection(
  provider: PlugProvider,
  request: WalletConnectRequest,
  createLocalAgent: LocalPlugAgentFactory
) {
  try {
    return await new PlugWalletConnection(
      provider,
      request,
      createLocalAgent
    ).initialize()
  } catch (error) {
    await disconnectPlugSafely(provider)
    if (isStalePlugSessionError(error)) throw new StalePlugSessionError()
    throw error
  }
}

async function disconnectPlugSafely(provider: PlugProvider) {
  try {
    await withTimeout(
      provider.disconnect(),
      PLUG_DISCONNECT_TIMEOUT_MS,
      'Plug disconnect timeout'
    )
  } catch {
    // The caller still discards its in-page Agent when the extension is closing.
  }
}

async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  message: string
) {
  let timeout: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_resolve, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), timeoutMs)
      })
    ])
  } finally {
    if (timeout) clearTimeout(timeout)
  }
}

function plugErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  if (!error || typeof error !== 'object') return String(error)
  for (const key of ['message', 'error', 'details', 'reason']) {
    const value = (error as Record<string, unknown>)[key]
    if (typeof value === 'string') return value
    if (value && typeof value === 'object') {
      const nested: string = plugErrorMessage(value)
      if (nested && nested !== '[object Object]') return nested
    }
  }
  return String(error)
}

export function createPlugWalletAdapter(
  provider: () => PlugProvider | undefined = browserPlugProvider,
  createLocalAgent: LocalPlugAgentFactory = createLocalPlugAgent
): WalletAdapter {
  return {
    id: 'plug',
    name: 'Plug Wallet',
    isAvailable: () => !!provider(),
    async connect(request) {
      const current = provider()
      if (!current) throw new Error(plugNotInstalledMessage())
      return initializePlugConnection(current, request, createLocalAgent)
    },
    async restore(request) {
      const current = provider()
      if (!current) return undefined
      try {
        if (!(await current.isConnected())) return undefined
      } catch {
        return undefined
      }
      return initializePlugConnection(current, request, createLocalAgent)
    }
  }
}

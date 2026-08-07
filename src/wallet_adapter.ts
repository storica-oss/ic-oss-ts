import type { ActorSubclass, HttpAgent } from '@dfinity/agent'
import type { IDL } from '@dfinity/candid'
import type { Principal } from '@dfinity/principal'

export interface WalletOption {
  id: string
  name: string
  installed: boolean
}

export interface WalletConnectionEvents {
  accountChanged: () => void
  disconnected: () => void
}

export interface WalletConnectRequest {
  canisters: string[]
  /** Network host passed to the wallet extension. */
  host: string
  /** Same-origin host used by an application-owned delegated Agent. */
  agentHost?: string
  events: WalletConnectionEvents
}

export interface WalletConnection {
  readonly id: string
  readonly name: string
  principal: () => Promise<Principal>
  agent: () => HttpAgent
  ensureCanisters: (canisters: string[]) => Promise<void>
  refreshSession?: () => Promise<void>
  createActor: <T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) => Promise<ActorSubclass<T>>
  disconnect: () => Promise<void>
}

export interface WalletAdapter {
  readonly id: string
  readonly name: string
  isAvailable: () => boolean
  connect: (request: WalletConnectRequest) => Promise<WalletConnection>
  restore: (
    request: WalletConnectRequest
  ) => Promise<WalletConnection | undefined>
}

export function walletOptions(adapters: WalletAdapter[]): WalletOption[] {
  return adapters.map((adapter) => ({
    id: adapter.id,
    name: adapter.name,
    installed: adapter.isAvailable()
  }))
}

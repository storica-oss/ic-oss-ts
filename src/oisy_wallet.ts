import { Actor, type ActorSubclass, type HttpAgent } from '@dfinity/agent'
import type { IDL } from '@dfinity/candid'
import { Principal } from '@dfinity/principal'
import { Signer } from '@slide-computer/signer'
import { SignerAgent } from '@slide-computer/signer-agent'
import { PostMessageTransport } from '@slide-computer/signer-web'

import type {
  WalletAdapter,
  WalletConnectRequest,
  WalletConnection
} from './wallet_adapter.js'

export const OISY_SIGN_URL = 'https://oisy.com/sign'

export interface OisyRuntimeConnection {
  principal: Principal
  agent: HttpAgent
  disconnect: () => Promise<void>
}

export type OisyRuntimeFactory = (
  request: WalletConnectRequest
) => Promise<OisyRuntimeConnection>

async function connectOisyRuntime(
  request: WalletConnectRequest
): Promise<OisyRuntimeConnection> {
  const host = new URL(request.host).hostname
  if (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '::1' ||
    host.endsWith('.localhost')
  ) {
    throw new Error('OISY Wallet can only sign calls on the IC mainnet')
  }
  const transport = new PostMessageTransport({
    url: OISY_SIGN_URL,
    windowOpenerFeatures:
      'toolbar=0,location=0,menubar=0,width=520,height=720,left=100,top=80'
  })
  const signer = new Signer({ transport })
  const accounts = await signer.accounts()
  const account = accounts[0]
  if (!account) {
    await signer.closeChannel().catch(() => undefined)
    throw new Error('OISY did not authorize an ICP account')
  }

  const principal = Principal.fromText(account.owner.toText())
  const signerAgent = await SignerAgent.create({
    signer,
    account: account.owner
  })

  return {
    principal,
    // signer-js has moved to @icp-sdk/core while the SDK still exposes the
    // legacy @dfinity/agent types. Both implement the same Agent protocol.
    agent: signerAgent as unknown as HttpAgent,
    disconnect: () => signer.closeChannel().catch(() => undefined)
  }
}

class OisyWalletConnection implements WalletConnection {
  readonly id = 'oisy'
  readonly name = 'OISY Wallet'

  constructor(private readonly runtime: OisyRuntimeConnection) {}

  async principal() {
    return this.runtime.principal
  }

  agent() {
    return this.runtime.agent
  }

  async ensureCanisters(_canisters: string[]) {
    // OISY authorizes ICRC-49 calls explicitly instead of issuing a canister
    // whitelist delegation. Each protected call remains user-approved.
  }

  async createActor<T>(
    canisterId: string,
    interfaceFactory: IDL.InterfaceFactory
  ) {
    return Actor.createActor<T>(interfaceFactory, {
      agent: this.agent(),
      canisterId
    }) as ActorSubclass<T>
  }

  disconnect() {
    return this.runtime.disconnect()
  }
}

export function createOisyWalletAdapter(
  runtimeFactory: OisyRuntimeFactory = connectOisyRuntime
): WalletAdapter {
  return {
    id: 'oisy',
    name: 'OISY Wallet',
    // OISY is a web signer and does not require a browser extension.
    isAvailable: () => true,
    async connect(request) {
      return new OisyWalletConnection(await runtimeFactory(request))
    },
    async restore(_request) {
      // OISY currently has no delegated background session. Reopening its
      // signer automatically during page load would trigger an unwanted popup.
      return undefined
    }
  }
}

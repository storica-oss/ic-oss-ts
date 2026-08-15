import type { HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { describe, expect, test, vi } from 'vitest'

import { createOisyWalletAdapter } from './oisy_wallet.js'

describe('OISY wallet adapter', () => {
  test('connects a web signer without requiring an extension', async () => {
    const principal = Principal.fromText(
      '5yp6l-5wfip-nwka2-mk43b-uiodc-6bl2t-zhtet-k6wpu-ss5a7-aifd5-vae'
    )
    const disconnect = vi.fn(async () => undefined)
    const agent = {
      getPrincipal: async () => principal
    } as unknown as HttpAgent
    const runtimeFactory = vi.fn(async () => ({
      principal,
      agent,
      disconnect
    }))
    const adapter = createOisyWalletAdapter(runtimeFactory)
    const request = {
      canisters: ['aaaaa-aa'],
      host: 'https://icp-api.io',
      events: {
        accountChanged: vi.fn(),
        disconnected: vi.fn()
      }
    }

    expect(adapter.isAvailable()).toBe(true)
    expect(await adapter.restore(request)).toBeUndefined()

    const connection = await adapter.connect(request)
    expect(connection.id).toBe('oisy')
    expect(connection.name).toBe('OISY Wallet')
    expect((await connection.principal()).toText()).toBe(principal.toText())
    expect(connection.agent()).toBe(agent)
    expect(runtimeFactory).toHaveBeenCalledWith(request)

    await connection.disconnect()
    expect(disconnect).toHaveBeenCalledOnce()
  })

  test('rejects local replicas before opening the production signer', async () => {
    const adapter = createOisyWalletAdapter()
    await expect(
      adapter.connect({
        canisters: ['aaaaa-aa'],
        host: 'http://127.0.0.1:4943',
        events: {
          accountChanged: vi.fn(),
          disconnected: vi.fn()
        }
      })
    ).rejects.toThrow('IC mainnet')
  })
})

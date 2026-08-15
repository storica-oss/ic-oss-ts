import { describe, expect, it } from 'vitest'
import {
  assertSplitWorkerIdentities,
  createQueryOnlyDelegationIdentity,
  inspectQueryOnlyDelegation
} from './query_only_delegation.js'
import { Ed25519KeyIdentity } from '@icp-sdk/core/identity'
import { Principal } from '@icp-sdk/core/principal'

function identity(permissions?: string) {
  return {
    getDelegation: () => ({
      delegations: [{ delegation: { expiration: 1n, permissions } }]
    })
  }
}

describe('query-only delegation capability gate', () => {
  it('fails closed for an unconstrained delegation shape', () => {
    expect(inspectQueryOnlyDelegation(identity()).supported).toBe(false)
  })

  it('recognizes an upstream query-only delegation link', () => {
    expect(inspectQueryOnlyDelegation(identity('queries'))).toMatchObject({
      supported: true,
      constrainedLinks: 1
    })
  })

  it('requires separate reader and writer identity objects', () => {
    const reader = identity('queries')
    expect(() => assertSplitWorkerIdentities(reader, reader)).toThrow(
      /separate objects/
    )
    expect(() => assertSplitWorkerIdentities(reader, identity())).not.toThrow()
  })

  it('creates a real protocol-level query-only delegation', async () => {
    const root = Ed25519KeyIdentity.generate()
    const delegated = await createQueryOnlyDelegationIdentity(root, {
      targets: [Principal.fromText('aaaaa-aa')]
    })

    expect(inspectQueryOnlyDelegation(delegated)).toMatchObject({
      supported: true,
      constrainedLinks: 1,
      chainLength: 1
    })
    const link = delegated.getDelegation().delegations[0]?.delegation
    expect(link).toMatchObject({
      permissions: 'queries'
    })
    expect(link?.targets?.map((target) => target.toText())).toEqual([
      'aaaaa-aa'
    ])
    expect(link!.expiration).toBeGreaterThan(BigInt(Date.now()) * 1_000_000n)
  })

  it('inherits an existing chain when creating a reader sub-session', async () => {
    const root = Ed25519KeyIdentity.generate()
    const target = Principal.fromText('aaaaa-aa')
    const first = await createQueryOnlyDelegationIdentity(root, {
      targets: [target]
    })
    const second = await createQueryOnlyDelegationIdentity(first, {
      targets: [target]
    })

    expect(inspectQueryOnlyDelegation(second)).toMatchObject({
      supported: true,
      constrainedLinks: 2,
      chainLength: 2
    })
  })
})

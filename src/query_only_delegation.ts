/** Structural shape shared by current and future ICP delegation SDKs. */
export interface DelegationIdentityLike {
  getDelegation(): {
    delegations: ReadonlyArray<{
      delegation: Record<string, unknown>
    }>
  }
}

export interface QueryOnlyDelegationInspection {
  supported: boolean
  constrainedLinks: number
  chainLength: number
  reason?: string
}

export const QUERY_ONLY_PERMISSION = 'queries' as const
export const QUERY_ONLY_DELEGATION_TTL_MS = 15 * 60 * 1000

export interface CreateQueryOnlyDelegationOptions {
  targets: Principal[]
  expiration?: Date
}

/**
 * Creates a protocol-enforced query-only child session with the official SDK.
 * When the authenticated identity is already delegated, its existing chain is
 * retained so the new constrained link remains valid back to the root identity.
 */
export async function createQueryOnlyDelegationIdentity(
  identity: unknown,
  options: CreateQueryOnlyDelegationOptions
): Promise<DelegationIdentity> {
  if (!isSignIdentity(identity)) {
    throw new Error('authenticated identity cannot sign a child delegation')
  }
  if (options.targets.length === 0) {
    throw new Error(
      'query-only delegation requires at least one target canister'
    )
  }
  const session = Ed25519KeyIdentity.generate()
  const previous = existingDelegationChain(identity)
  const chain = await DelegationChain.create(
    identity,
    session.getPublicKey(),
    options.expiration ?? new Date(Date.now() + QUERY_ONLY_DELEGATION_TTL_MS),
    {
      ...(previous ? { previous } : {}),
      targets: options.targets,
      permissions: QUERY_ONLY_PERMISSION
    }
  )
  const delegated = DelegationIdentity.fromDelegation(session, chain)
  assertQueryOnlyDelegation(delegated)
  return delegated
}

/**
 * Detects protocol-level query-only delegation without encoding the new field.
 * This intentionally fails closed until the installed SDK exposes and preserves
 * `permissions: "queries"` on at least one signed delegation link.
 */
export function inspectQueryOnlyDelegation(
  identity: unknown
): QueryOnlyDelegationInspection {
  if (!identity || typeof identity !== 'object') {
    return unsupported('identity is not a delegation identity')
  }
  const getDelegation = Reflect.get(identity, 'getDelegation')
  if (typeof getDelegation !== 'function') {
    return unsupported('identity does not expose a delegation chain')
  }
  let chain: unknown
  try {
    chain = getDelegation.call(identity)
  } catch {
    return unsupported('delegation chain cannot be inspected')
  }
  const delegations =
    chain && typeof chain === 'object'
      ? Reflect.get(chain, 'delegations')
      : undefined
  if (!Array.isArray(delegations) || delegations.length === 0) {
    return unsupported('delegation chain is empty')
  }
  const constrainedLinks = delegations.filter((signed) => {
    if (!signed || typeof signed !== 'object') return false
    const delegation = Reflect.get(signed, 'delegation')
    return (
      delegation !== null &&
      typeof delegation === 'object' &&
      Reflect.get(delegation, 'permissions') === QUERY_ONLY_PERMISSION
    )
  }).length
  return constrainedLinks > 0
    ? { supported: true, constrainedLinks, chainLength: delegations.length }
    : {
        supported: false,
        constrainedLinks: 0,
        chainLength: delegations.length,
        reason: 'installed delegation SDK does not expose permissions="queries"'
      }
}

export function assertQueryOnlyDelegation(identity: unknown): void {
  const inspection = inspectQueryOnlyDelegation(identity)
  if (!inspection.supported) {
    throw new Error(
      `Protocol-level query-only delegation is unavailable: ${inspection.reason}`
    )
  }
}

/** Keeps AI/read workers from accidentally reusing the write identity object. */
export function assertSplitWorkerIdentities(
  readerIdentity: unknown,
  writerIdentity: unknown
): void {
  if (readerIdentity === writerIdentity) {
    throw new Error('reader and writer identities must be separate objects')
  }
  assertQueryOnlyDelegation(readerIdentity)
}

function unsupported(reason: string): QueryOnlyDelegationInspection {
  return { supported: false, constrainedLinks: 0, chainLength: 0, reason }
}

function isSignIdentity(value: unknown): value is SignIdentity {
  if (!value || typeof value !== 'object') return false
  return (
    typeof Reflect.get(value, 'sign') === 'function' &&
    typeof Reflect.get(value, 'getPublicKey') === 'function'
  )
}

function existingDelegationChain(
  identity: SignIdentity
): DelegationChain | undefined {
  const getDelegation = Reflect.get(identity, 'getDelegation')
  if (typeof getDelegation !== 'function') return undefined
  const value = getDelegation.call(identity)
  return value && typeof value === 'object'
    ? (value as DelegationChain)
    : undefined
}
import type { Principal } from '@icp-sdk/core/principal'
import type { SignIdentity } from '@icp-sdk/core/agent'
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity
} from '@icp-sdk/core/identity'

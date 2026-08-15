export const DEFAULT_CONTENT_SAFETY_ENDPOINT =
  'https://moderation.storica.my/v1/attest'
export const MAX_CONTENT_SAFETY_ATTESTATION_BYTES = 2_048

export type ContentSafetyRequest = {
  principal: string
  contentKind: 'BottleIntroduction' | 'ShareMessage'
  context:
    | { kind: 'BottleIntroduction'; requestId: Uint8Array }
    | {
        kind: 'DirectShare'
        bucket: string
        shareId: Uint8Array
        sender: string
      }
    | {
        kind: 'DriftBottle'
        market: string
        catchId: bigint
        sender: string
      }
  body: string
  endpoint?: string
  signal?: AbortSignal
}

/** Requests a short-lived Candid-encoded proof without sending share secrets. */
export async function requestContentSafetyAttestation(
  input: ContentSafetyRequest
): Promise<Uint8Array> {
  const endpoint = new URL(input.endpoint ?? DEFAULT_CONTENT_SAFETY_ENDPOINT)
  if (
    endpoint.protocol !== 'https:' &&
    endpoint.hostname !== 'localhost' &&
    endpoint.hostname !== '127.0.0.1'
  ) {
    throw new Error('content-safety endpoint must use HTTPS')
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    credentials: 'omit',
    cache: 'no-store',
    redirect: 'error',
    headers: { 'content-type': 'application/json' },
    signal: input.signal ?? AbortSignal.timeout(8_000),
    body: JSON.stringify({
      version: 1,
      principal: input.principal,
      content_kind: input.contentKind,
      context: jsonContext(input.context),
      body: input.body
    })
  })
  if (!response.ok) {
    throw new Error(
      response.status === 422
        ? 'content was rejected by the safety policy'
        : 'content safety verification is temporarily unavailable'
    )
  }
  const payload = (await response.json()) as { attestation?: unknown }
  if (typeof payload.attestation !== 'string') {
    throw new Error('content safety service returned an invalid response')
  }
  const result = fromBase64Url(payload.attestation)
  if (
    result.length === 0 ||
    result.length > MAX_CONTENT_SAFETY_ATTESTATION_BYTES
  ) {
    throw new Error('content safety attestation exceeds protocol bounds')
  }
  return result
}

function jsonContext(context: ContentSafetyRequest['context']) {
  if (context.kind === 'BottleIntroduction') {
    return { kind: context.kind, request_id: toBase64Url(context.requestId) }
  }
  if (context.kind === 'DirectShare') {
    return {
      kind: context.kind,
      bucket: context.bucket,
      share_id: toBase64Url(context.shareId),
      sender: context.sender
    }
  }
  return {
    kind: context.kind,
    market: context.market,
    catch_id: context.catchId.toString(),
    sender: context.sender
  }
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array {
  if (!/^[A-Za-z0-9_-]+$/.test(value))
    throw new Error('invalid attestation encoding')
  const padded =
    value.replaceAll('-', '+').replaceAll('_', '/') +
    '='.repeat((4 - (value.length % 4)) % 4)
  const decoded = atob(padded)
  return Uint8Array.from(decoded, (character) => character.charCodeAt(0))
}

import { sha3_256 } from '@noble/hashes/sha3'
import type {
  ApiBeginImageUploadInput,
  ApiCreateContentInput,
  ApiImageUploadSession,
  ApiUploadImageChunkOutput,
  Asset,
  Content,
  _SERVICE as PersonalHubService
} from '../candid/personal_hub/personal_hub.did.js'
import { resultOk } from './types.js'

export type PersonalHubApiKeyService = Pick<
  PersonalHubService,
  | 'api_abort_image_upload'
  | 'api_abort_media_upload'
  | 'api_begin_image_upload'
  | 'api_begin_media_upload'
  | 'api_create_content'
  | 'api_finish_image_upload'
  | 'api_finish_media_upload'
  | 'api_upload_image_chunk'
  | 'api_upload_media_chunk'
>

export interface ApiKeyMediaSource {
  blob: Blob
  name: string
  contentType?: string
}

export interface ApiKeyUploadProgress {
  phase: 'hashing' | 'uploading' | 'committing'
  completed: number
  total: number
  chunkIndex?: number
  totalChunks?: number
}

export interface PublishApiVideoInput {
  slug: string
  title: string
  body?: string
  summary?: string
  tags?: string[]
  publish?: boolean
  /** One source keeps backwards compatibility; an array creates an ordered video album. */
  video: ApiKeyMediaSource | ApiKeyMediaSource[]
  cover?: ApiKeyMediaSource
  signal?: AbortSignal
  onProgress?: (
    file: 'video' | 'cover',
    progress: ApiKeyUploadProgress,
    videoIndex?: number
  ) => void
}

export interface PublishApiVideoOutput {
  content: Content
  /** First episode, retained for clients that previously uploaded one video. */
  videoAsset: Asset
  /** All uploaded episodes in playback order. */
  videoAssets: Asset[]
  coverAsset?: Asset
}

export interface PersonalHubApiKeyClientOptions {
  requestIdFactory?: () => Uint8Array
  transportRetries?: number
}

export class PersonalHubApiKeyClient {
  readonly #service: PersonalHubApiKeyService
  readonly #token: string
  readonly #requestIdFactory: () => Uint8Array
  readonly #transportRetries: number

  constructor(
    service: PersonalHubApiKeyService,
    token: string,
    options: PersonalHubApiKeyClientOptions = {}
  ) {
    if (!token.trim()) throw new Error('Personal Hub API Key is required')
    this.#service = service
    this.#token = token
    this.#requestIdFactory = options.requestIdFactory ?? defaultApiRequestId
    this.#transportRetries = Math.max(0, options.transportRetries ?? 2)
  }

  async uploadMedia(
    source: ApiKeyMediaSource,
    options: {
      imagesOnly?: boolean
      signal?: AbortSignal
      onProgress?: (progress: ApiKeyUploadProgress) => void
    } = {}
  ): Promise<Asset> {
    if (!source.blob.size) throw new Error('API media file cannot be empty')
    const contentType = (
      source.contentType ||
      source.blob.type ||
      'application/octet-stream'
    )
      .split(';')[0]
      .trim()
      .toLowerCase()
    const name = normalizeApiMediaName(source.name)
    const hash = await hashBlob(source.blob, options.signal, options.onProgress)
    const beginInput: ApiBeginImageUploadInput = {
      request_id: this.#requestId(),
      hash: [hash],
      name,
      size: BigInt(source.blob.size),
      content_type: contentType
    }
    const imagesOnly = options.imagesOnly ?? false
    let session: ApiImageUploadSession | undefined
    let finishStarted = false
    try {
      const begun = await this.#transport(() =>
        imagesOnly
          ? this.#service.api_begin_image_upload(this.#token, beginInput)
          : this.#service.api_begin_media_upload(this.#token, beginInput)
      )
      session = resultOk(begun)
      const expectedChunks = Math.ceil(source.blob.size / session.chunk_size)
      if (!session.chunk_size || expectedChunks !== session.total_chunks)
        throw new Error('Hub returned an invalid media upload session')

      for (
        let chunkIndex = 0;
        chunkIndex < session.total_chunks;
        chunkIndex++
      ) {
        throwIfAborted(options.signal)
        const offset = chunkIndex * session.chunk_size
        const content = new Uint8Array(
          await source.blob
            .slice(offset, offset + session.chunk_size)
            .arrayBuffer()
        )
        const requestId = this.#requestId()
        const uploaded = await this.#transport(() =>
          imagesOnly
            ? this.#service.api_upload_image_chunk(this.#token, {
                request_id: requestId,
                bucket: session!.bucket,
                session_id: session!.session_id,
                chunk_index: chunkIndex,
                content
              })
            : this.#service.api_upload_media_chunk(this.#token, {
                request_id: requestId,
                bucket: session!.bucket,
                session_id: session!.session_id,
                chunk_index: chunkIndex,
                content
              })
        )
        const progress = resultOk<ApiUploadImageChunkOutput, string>(uploaded)
        options.onProgress?.({
          phase: 'uploading',
          completed: Number(progress.filled),
          total: source.blob.size,
          chunkIndex: progress.uploaded_chunks,
          totalChunks: session.total_chunks
        })
      }

      throwIfAborted(options.signal)
      finishStarted = true
      options.onProgress?.({
        phase: 'committing',
        completed: source.blob.size,
        total: source.blob.size,
        totalChunks: session.total_chunks
      })
      const requestId = this.#requestId()
      const finished = await this.#transport(() =>
        imagesOnly
          ? this.#service.api_finish_image_upload(this.#token, {
              request_id: requestId,
              bucket: session!.bucket,
              session_id: session!.session_id
            })
          : this.#service.api_finish_media_upload(this.#token, {
              request_id: requestId,
              bucket: session!.bucket,
              session_id: session!.session_id
            })
      )
      return resultOk(finished)
    } catch (error) {
      if (session && !finishStarted)
        await this.#abort(session, imagesOnly).catch(() => {})
      throw error
    }
  }

  async publishVideo(
    input: PublishApiVideoInput
  ): Promise<PublishApiVideoOutput> {
    const videos = Array.isArray(input.video) ? input.video : [input.video]
    if (!videos.length)
      throw new Error('A video album must contain at least one MP4')
    if (
      videos.some(
        (source) =>
          (source.contentType || source.blob.type)
            .split(';')[0]
            .trim()
            .toLowerCase() !== 'video/mp4'
      )
    )
      throw new Error('Every video album episode must use video/mp4')
    const videoAssets: Asset[] = []
    for (const [index, source] of videos.entries())
      videoAssets.push(
        await this.uploadMedia(source, {
          signal: input.signal,
          onProgress: (progress) => input.onProgress?.('video', progress, index)
        })
      )
    const videoAsset = videoAssets[0]!
    let coverAsset: Asset | undefined
    if (input.cover)
      coverAsset = await this.uploadMedia(input.cover, {
        imagesOnly: true,
        signal: input.signal,
        onProgress: (progress) => input.onProgress?.('cover', progress)
      })
    throwIfAborted(input.signal)
    const assetIds = coverAsset
      ? [...videoAssets.map((asset) => asset.id), coverAsset.id]
      : videoAssets.map((asset) => asset.id)
    const createInput: ApiCreateContentInput = {
      slug: input.slug.trim(),
      title: input.title.trim(),
      body: input.body ?? '',
      summary: input.summary ?? '',
      kind: { Video: null },
      cover_asset_id: coverAsset ? [coverAsset.id] : [],
      tags: input.tags ?? [],
      visibility: { Public: null },
      asset_ids: assetIds,
      publish: input.publish ?? true
    }
    const created = await this.#transport(() =>
      this.#service.api_create_content(this.#token, createInput)
    )
    return {
      content: resultOk(created),
      videoAsset,
      videoAssets,
      coverAsset
    }
  }

  async #abort(session: ApiImageUploadSession, imagesOnly: boolean) {
    const input = {
      request_id: this.#requestId(),
      bucket: session.bucket,
      session_id: session.session_id
    }
    const aborted = await this.#transport(() =>
      imagesOnly
        ? this.#service.api_abort_image_upload(this.#token, input)
        : this.#service.api_abort_media_upload(this.#token, input)
    )
    resultOk(aborted)
  }

  async #transport<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: unknown
    for (let attempt = 0; attempt <= this.#transportRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
      }
    }
    throw lastError
  }

  #requestId() {
    const requestId = this.#requestIdFactory()
    if (requestId.byteLength !== 16)
      throw new Error('API upload request IDs must contain exactly 16 bytes')
    return requestId
  }
}

export function normalizeApiMediaName(name: string) {
  const cleaned =
    name.replace(/[\/\\\u0000-\u001f\u007f]/g, '-').trim() || 'media.bin'
  const dot = cleaned.lastIndexOf('.')
  const suffix = dot > 0 && dot < cleaned.length - 1 ? cleaned.slice(dot) : ''
  const base = suffix ? cleaned.slice(0, dot) : cleaned
  const encoder = new TextEncoder()
  let truncated = ''
  for (const character of base) {
    if (encoder.encode(`${truncated}${character}${suffix}`).byteLength > 96)
      break
    truncated += character
  }
  const result = `${truncated || 'media'}${suffix}`
  if (encoder.encode(result).byteLength > 96)
    throw new Error('API media file extension is too long')
  return result
}

async function hashBlob(
  blob: Blob,
  signal?: AbortSignal,
  onProgress?: (progress: ApiKeyUploadProgress) => void
) {
  const hasher = sha3_256.create()
  const reader = blob.stream().getReader()
  let completed = 0
  try {
    for (;;) {
      throwIfAborted(signal)
      const { done, value } = await reader.read()
      if (done) break
      hasher.update(value)
      completed += value.byteLength
      onProgress?.({
        phase: 'hashing',
        completed,
        total: blob.size
      })
    }
  } finally {
    reader.releaseLock()
  }
  return hasher.digest()
}

function defaultApiRequestId() {
  const requestId = new Uint8Array(16)
  globalThis.crypto.getRandomValues(requestId)
  return requestId
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted)
    throw signal.reason instanceof Error
      ? signal.reason
      : new DOMException('API media upload was aborted', 'AbortError')
}

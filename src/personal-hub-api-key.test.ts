import { Principal } from '@dfinity/principal'
import { sha3_256 } from '@noble/hashes/sha3'
import { describe, expect, test, vi } from 'vitest'
import {
  normalizeApiMediaName,
  PersonalHubApiKeyClient,
  type PersonalHubApiKeyService
} from './personal-hub-api-key'

const asset = (id: bigint, contentType: string) => ({
  id,
  hash: [new Uint8Array(32)] as [Uint8Array],
  class: { Public: null } as const,
  size: 5n,
  generation: 1n,
  content_type: contentType,
  bucket: Principal.anonymous(),
  file_id: Number(id)
})

describe('PersonalHubApiKeyClient', () => {
  test('uploads ordered MP4 episodes and cover before publishing a video album', async () => {
    const begun: Array<Record<string, unknown>> = []
    const chunks: Array<Record<string, unknown>> = []
    let nextAsset = 1n
    const service = {
      api_begin_media_upload: vi.fn(async (_token, input) => {
        begun.push(input)
        return {
          Ok: {
            bucket: Principal.anonymous(),
            file_id: 1,
            session_id: new Uint8Array([1]),
            chunk_size: 3,
            total_chunks: 2,
            expires_at: 1n
          }
        }
      }),
      api_begin_image_upload: vi.fn(async (_token, input) => {
        begun.push(input)
        return {
          Ok: {
            bucket: Principal.anonymous(),
            file_id: 2,
            session_id: new Uint8Array([2]),
            chunk_size: 3,
            total_chunks: 1,
            expires_at: 1n
          }
        }
      }),
      api_upload_media_chunk: vi.fn(async (_token, input) => {
        chunks.push(input)
        const chunkIndex = input.chunk_index as number
        return {
          Ok: {
            uploaded_chunks: chunkIndex + 1,
            filled: BigInt(Math.min(5, (chunkIndex + 1) * 3)),
            expires_at: 1n
          }
        }
      }),
      api_upload_image_chunk: vi.fn(async (_token, input) => {
        chunks.push(input)
        return {
          Ok: {
            uploaded_chunks: 1,
            filled: BigInt((input.content as Uint8Array).byteLength),
            expires_at: 1n
          }
        }
      }),
      api_finish_media_upload: vi.fn(async () => ({
        Ok: asset(nextAsset++, 'video/mp4')
      })),
      api_finish_image_upload: vi.fn(async () => ({
        Ok: asset(nextAsset++, 'image/webp')
      })),
      api_abort_media_upload: vi.fn(async () => ({ Ok: true })),
      api_abort_image_upload: vi.fn(async () => ({ Ok: true })),
      api_create_content: vi.fn(async (_token, input) => ({
        Ok: {
          id: 9n,
          status: { Published: null },
          title: input.title,
          body: input.body,
          kind: input.kind,
          assets: input.asset_ids,
          slug: input.slug,
          tags: input.tags,
          curation_weight: 0,
          updated_at_ms: 1n,
          cover_asset_id: input.cover_asset_id,
          published_at_ms: [1n],
          summary: input.summary,
          visibility: input.visibility,
          contributors: []
        }
      }))
    } as unknown as PersonalHubApiKeyService
    let request = 0
    const client = new PersonalHubApiKeyClient(service, 'phk_test', {
      requestIdFactory: () => new Uint8Array(16).fill(++request)
    })

    const output = await client.publishVideo({
      slug: 'api-video',
      title: 'API Video',
      video: [
        {
          name: 'episode-1.mp4',
          contentType: 'video/mp4',
          blob: new Blob([new Uint8Array([1, 2, 3, 4, 5])])
        },
        {
          name: 'episode-2.mp4',
          contentType: 'video/mp4',
          blob: new Blob([new Uint8Array([9, 8, 7, 6, 5])])
        }
      ],
      cover: {
        name: 'feature-cover.webp',
        contentType: 'image/webp',
        blob: new Blob([new Uint8Array([6, 7, 8])])
      }
    })

    expect(begun[0].hash).toEqual([sha3_256(new Uint8Array([1, 2, 3, 4, 5]))])
    expect(
      chunks.slice(0, 2).map(({ content }) => [...(content as Uint8Array)])
    ).toEqual([
      [1, 2, 3],
      [4, 5]
    ])
    expect(service.api_create_content).toHaveBeenCalledWith(
      'phk_test',
      expect.objectContaining({
        kind: { Video: null },
        asset_ids: [1n, 2n, 3n],
        cover_asset_id: [3n],
        visibility: { Public: null },
        publish: true
      })
    )
    expect(output.videoAsset.id).toBe(1n)
    expect(output.videoAssets.map(({ id }) => id)).toEqual([1n, 2n])
    expect(output.coverAsset?.id).toBe(3n)
    expect(output.content.id).toBe(9n)
  })

  test('normalizes unsafe and oversized UTF-8 media names', () => {
    const name = normalizeApiMediaName(
      `folder/video-${'非常长'.repeat(40)}.mp4`
    )
    expect(name.endsWith('.mp4')).toBe(true)
    expect(name).not.toContain('/')
    expect(new TextEncoder().encode(name).byteLength).toBeLessThanOrEqual(96)
  })

  test('rejects an empty album or a non-MP4 episode before uploading', async () => {
    const service = {
      api_begin_media_upload: vi.fn()
    } as unknown as PersonalHubApiKeyService
    const client = new PersonalHubApiKeyClient(service, 'phk_test')

    await expect(
      client.publishVideo({
        slug: 'empty',
        title: 'Empty',
        video: []
      })
    ).rejects.toThrow('at least one MP4')
    await expect(
      client.publishVideo({
        slug: 'invalid',
        title: 'Invalid',
        video: {
          name: 'episode.mov',
          contentType: 'video/quicktime',
          blob: new Blob([new Uint8Array([1])])
        }
      })
    ).rejects.toThrow('video/mp4')
    expect(service.api_begin_media_upload).not.toHaveBeenCalled()
  })
})

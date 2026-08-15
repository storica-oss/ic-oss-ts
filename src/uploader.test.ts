import { describe, expect, test, vi } from 'vitest'
import type { BucketCanister, OpenedEncryptionZone } from './bucket.canister.js'
import { Uploader } from './uploader.js'

describe('Uploader encrypted session cleanup', () => {
  test('aborts the upload session when a ciphertext chunk cannot be stored', async () => {
    const sessionId = new Uint8Array(16).fill(7)
    const abortUpload = vi.fn().mockResolvedValue(true)
    const client = {
      getFolderInfo: vi.fn().mockResolvedValue({ revision: 3n }),
      beginUpload: vi.fn().mockResolvedValue({
        session_id: sessionId,
        file_id: 42,
        total_chunks: 1
      }),
      uploadChunk: vi.fn().mockRejectedValue(new Error('upload failed')),
      abortUpload
    } as unknown as BucketCanister
    const opened = {
      zone: { zone_id: new Uint8Array(32).fill(5) },
      zoneWrappingKey: new Uint8Array(32).fill(9)
    } as unknown as OpenedEncryptionZone

    await expect(
      new Uploader(client).uploadEncrypted(
        {
          content: new TextEncoder().encode('secret payload'),
          contentType: 'text/plain',
          name: 'secret.txt',
          size: 14,
          parent: 12
        },
        opened
      )
    ).rejects.toThrow('upload failed')

    expect(abortUpload).toHaveBeenCalledTimes(1)
    expect(abortUpload).toHaveBeenCalledWith(
      expect.objectContaining({ session_id: sessionId })
    )
  })
})

import { sha3_256 } from '@noble/hashes/sha3.js'
import { randomBytes } from '@noble/ciphers/utils.js'
import { type ReadableStream } from 'web-streams-polyfill'
import { BucketCanister, type OpenedEncryptionZone } from './bucket.canister.js'
import {
  ciphertextSize,
  encryptFileChunk,
  prepareFileEncryption,
  XCHACHA_TAG_SIZE
} from './encryption.js'
import { ConcurrencyQueue } from './queue.js'
import {
  CHUNK_SIZE,
  readableStreamAsyncIterator,
  readAll,
  toFixedChunkSizeReadable
} from './stream.js'
import { FileConfig, Progress, UploadFileChunksResult } from './types.js'

export const MAX_FILE_SIZE_PER_CALL = 1024 * 2048

export class Uploader {
  readonly #cli: BucketCanister
  readonly concurrency: number
  readonly setReadonly: boolean

  constructor(
    client: BucketCanister,
    concurrency: number = 16,
    setReadonly = false
  ) {
    this.#cli = client
    this.concurrency = concurrency
    this.setReadonly = setReadonly
  }

  async upload(
    file: FileConfig,
    onProgress: (progress: Progress) => void = () => {}
  ): Promise<UploadFileChunksResult> {
    const stream = await toFixedChunkSizeReadable(file)
    const size = file.size || 0
    if (size > 0 && size <= MAX_FILE_SIZE_PER_CALL) {
      const content = await readAll(stream, size)
      const hash = file.hash || sha3_256(content)
      let res = await this.#cli.createFile({
        status: this.setReadonly ? [1] : [],
        content: [content],
        custom: [],
        hash: [hash],
        name: file.name,
        size: [BigInt(size)],
        content_type: file.contentType,
        parent: file.parent || 0,
        dek: [],
        encryption: []
      })

      onProgress({
        filled: size,
        size,
        chunkIndex: 0,
        concurrency: 1
      })

      return {
        id: res.id,
        filled: size,
        uploadedChunks: [],
        hash
      }
    }

    let res = await this.#cli.createFile({
      status: [],
      content: [],
      custom: [],
      hash: [],
      name: file.name,
      size: size > 0 ? [BigInt(size)] : [],
      content_type: file.contentType,
      parent: file.parent || 0,
      dek: [],
      encryption: []
    })

    return await this.upload_chunks(
      stream,
      res.id,
      size,
      file.hash || null,
      [],
      onProgress
    )
  }

  /**
   * Streams plaintext through XChaCha20-Poly1305 and writes only ciphertext
   * plus the public encryption descriptor to the Bucket.
   *
   * The Zone Wrapping Key must have been opened through
   * `BucketCanister.openEncryptionZone` in the current trusted client.
   */
  async uploadEncrypted(
    file: FileConfig,
    zone: OpenedEncryptionZone,
    onProgress: (progress: Progress) => void = () => {}
  ): Promise<UploadFileChunksResult> {
    const plaintextChunkSize = CHUNK_SIZE - XCHACHA_TAG_SIZE
    const stream = await toFixedChunkSizeReadable(file, plaintextChunkSize)
    if (file.size === undefined) {
      throw new Error('encrypted uploads require a known plaintext size')
    }
    if (!Number.isSafeInteger(file.size) || file.size < 0) {
      throw new Error(
        'encrypted upload size must be a safe non-negative integer'
      )
    }
    const plaintextSize = BigInt(file.size)
    const prepared = prepareFileEncryption(
      new Uint8Array(zone.zone.zone_id),
      zone.zoneWrappingKey,
      plaintextSize,
      plaintextChunkSize
    )
    try {
      const encryptedSizeBigInt = ciphertextSize(
        plaintextSize,
        plaintextChunkSize
      )
      if (encryptedSizeBigInt > BigInt(Number.MAX_SAFE_INTEGER)) {
        throw new Error(
          'encrypted file size exceeds JavaScript safe integer range'
        )
      }
      const encryptedSize = Number(encryptedSizeBigInt)
      const parent = file.parent || 0
      const parentRevision = (await this.#cli.getFolderInfo(parent)).revision
      const session = await this.#cli.beginUpload({
        request_id: randomBytes(16),
        parent,
        name: file.name,
        content_type: file.contentType,
        size: encryptedSizeBigInt,
        status: 0,
        hash: [],
        dek: [],
        encryption: [prepared.info],
        custom: [],
        expected_parent_revision: parentRevision,
        replace: []
      })
      try {
        const hasher = sha3_256.create()
        const uploadedChunks: number[] = []
        let plaintextFilled = 0
        let chunkIndex = 0
        for await (const value of readableStreamAsyncIterator(stream)) {
          const plaintext = new Uint8Array(value)
          try {
            const ciphertext = encryptFileChunk(
              prepared.info,
              prepared.fileDek,
              chunkIndex,
              plaintext
            )
            hasher.update(ciphertext)
            await this.#cli.uploadChunk({
              request_id: randomBytes(16),
              session_id: session.session_id,
              chunk_index: chunkIndex,
              content: ciphertext
            })
            plaintextFilled += plaintext.byteLength
            uploadedChunks.push(chunkIndex)
            onProgress({
              filled: plaintextFilled,
              size: file.size,
              chunkIndex,
              concurrency: 1
            })
            chunkIndex += 1
          } finally {
            plaintext.fill(0)
          }
        }
        if (plaintextFilled !== file.size) {
          throw new Error(
            `encrypted upload input size mismatch: expected ${file.size}, read ${plaintextFilled}`
          )
        }
        const hash = hasher.digest()
        await this.#cli.commitUpload({
          request_id: randomBytes(16),
          session_id: session.session_id
        })
        await this.#cli.updateFileInfo({
          id: session.file_id,
          status: this.setReadonly ? [1] : [],
          hash: [hash],
          custom: [],
          name: [],
          size: [encryptedSizeBigInt],
          content_type: []
        })
        return {
          id: session.file_id,
          filled: plaintextFilled,
          uploadedChunks,
          hash
        }
      } catch (error) {
        try {
          await this.#cli.abortUpload({
            request_id: randomBytes(16),
            session_id: session.session_id
          })
        } catch {
          // The Bucket timer eventually reaps a session that cannot be aborted.
        }
        throw error
      }
    } finally {
      prepared.fileDek.fill(0)
    }
  }

  async upload_chunks(
    stream: ReadableStream<Uint8Array>,
    id: number,
    size: number,
    hash: Uint8Array | null = null,
    excludeChunks: number[] = [],
    onProgress: (progress: Progress) => void = () => {}
  ): Promise<UploadFileChunksResult> {
    const queue = new ConcurrencyQueue(this.concurrency)

    let chunkIndex = 0
    let prevChunkSize = CHUNK_SIZE
    const hasher = sha3_256.create()
    const rt: UploadFileChunksResult = {
      id,
      filled: 0,
      uploadedChunks: [],
      hash
    }

    try {
      for await (const value of readableStreamAsyncIterator(stream)) {
        if (prevChunkSize !== CHUNK_SIZE) {
          throw new Error(
            `Prev chunk size mismatch, expected ${CHUNK_SIZE} but got ${prevChunkSize}`
          )
        }
        const chunk = new Uint8Array(value)
        prevChunkSize = chunk.byteLength
        const index = chunkIndex
        chunkIndex += 1

        if (excludeChunks.includes(index)) {
          rt.filled += chunk.byteLength
          onProgress({
            filled: rt.filled,
            size,
            chunkIndex: index,
            concurrency: 0
          })
          continue
        }

        await queue.push(async (_aborter, concurrency) => {
          !hash && hasher.update(chunk)
          const res = await this.#cli.updateFileChunk({
            id,
            chunk_index: index,
            content: chunk
          })

          rt.filled += chunk.byteLength
          rt.uploadedChunks.push(index)
          onProgress({
            filled: Number(res.filled),
            size,
            chunkIndex: index,
            concurrency
          })
        })
      }

      await queue.wait()
      if (!rt.hash) {
        rt.hash = hasher.digest()
      }
      await this.#cli.updateFileInfo({
        id,
        status: this.setReadonly ? [1] : [],
        hash: [rt.hash],
        custom: [],
        name: [],
        size: [BigInt(size)],
        content_type: []
      })
    } catch (err) {
      ;(err as any).data = rt
      throw err
    }

    return rt
  }
}

# `@ldclabs/ic_oss_ts`

![License](https://img.shields.io/crates/l/ic-oss.svg)
[![Test](https://github.com/storica-oss/ic-oss-ts/actions/workflows/test.yml/badge.svg)](https://github.com/storica-oss/ic-oss-ts/actions/workflows/test.yml)
[![NPM version](http://img.shields.io/npm/v/@ldclabs/ic_oss_ts.svg)](https://www.npmjs.com/package/@ldclabs/ic_oss_ts)

[IC OSS](https://github.com/storica-oss) is canister-native object storage on the Internet Computer.

`@ldclabs/ic_oss_ts` is the TypeScript SDK for IC OSS Bucket and Cluster canisters. It supports browsers and Node.js, authenticated identities, delegated access tokens, Plug wallet sessions, streaming uploads, bounded reads, directory APIs, and operational health calls.

The npm package keeps its existing name for compatibility. Official source, issues, and releases live in the [`storica-oss`](https://github.com/storica-oss) organization.

[Complete tool guide](docs/usage.md) · [中文使用指南](docs/usage.zh-CN.md) · [CLI](https://github.com/storica-oss/ic-oss-cli) · [Official GitHub](https://github.com/storica-oss)

## Installation

```bash
npm install @ldclabs/ic_oss_ts @dfinity/agent @dfinity/principal
```

## Quick start

The identity passed to the agent must be authorized by the OSS as a Manager or Reader. Anonymous access only works for data exposed by the Bucket's public policy.

```ts
import { HttpAgent, type Identity } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { BucketCanister, Uploader } from '@ldclabs/ic_oss_ts'

const canisterId = Principal.fromText('aaaaa-aa')

export async function uploadFile(identity: Identity, file: File) {
  const agent = await HttpAgent.create({
    host: 'https://icp-api.io',
    identity
  })
  const bucket = BucketCanister.create({ canisterId, agent })

  const page = await bucket.listEntries({
    parent: 0,
    cursor: [],
    take: [100]
  })
  console.log(page.entries)

  const uploader = new Uploader(bucket, 8)
  return uploader.upload({
    parent: 0,
    content: file,
    name: file.name,
    contentType: file.type || 'application/octet-stream'
  })
}
```

For a Market-created OSS, copy the Bucket Canister ID from **Account** and add the application's exact Principal as an OSS administrator. Internet Identity Principals can differ between frontend origins, so compare the complete Principal before granting access.

## Read a file safely

```ts
async function readFile(bucket: BucketCanister, fileId: number) {
  const descriptor = await bucket.getFileDescriptor(fileId)
  return bucket.readFileRange({
    file_id: descriptor.id,
    generation: descriptor.generation,
    offset: 0n,
    length: descriptor.size
  })
}
```

Use bounded ranges for large files. Passing the descriptor's `generation` prevents bytes from different file versions being mixed during a replacement.

## Authentication options

- **IC Identity**: create an `HttpAgent` with an Internet Identity, Ed25519, or other authorized `Identity`.
- **Plug Wallet**: use the exported `createPlugWalletAdapter` and whitelist only the Bucket canisters the app needs.
- **Delegated token**: pass `accessToken` to `BucketCanister.create`, then rotate it with `setAccessToken`.

Keep tokens in memory where possible. Never embed a Manager private key or unrestricted long-lived token in a public frontend bundle.

## Directory Synchronization APIs

`BucketCanister` exposes the v2 primitives used to build directory synchronization and publishing
clients:

- `getCapabilities`, `getEntry`, `listEntries`, and `getSubtreeManifest`
- `ensureFolder`, `batchEnsureFolders`, and `batchCreateSmallFiles`
- `beginUpload`, `uploadChunk`, `getUploadStatus`, `renewUpload`, `commitUpload`, and `abortUpload`
- `deleteEntryIf`, `getDirectoryStorageHealth`, `getUploadHealth`, and `getGcHealth`
- `collectGarbage`, `adminMigrateDirectoryStorage`, and `adminRetryDirectoryMigration`

Set an access token at construction time or with `setAccessToken`. Admin migration calls still
require a canister controller identity; manual garbage collection requires Manager permission.

## Personal Hub API Key Video Publishing

`PersonalHubApiKeyClient` publishes public MP4 content through the Hub without granting the external
application direct Bucket permission. It computes SHA3-256 as a streaming first pass, uploads one or
more ordered videos and an optional image cover with resumable request IDs, registers the Assets, and
finally creates the `Video` album:

```ts
import { PersonalHubApiKeyClient } from '@ldclabs/ic_oss_ts'

const publisher = new PersonalHubApiKeyClient(hubActor, apiKey)
await publisher.publishVideo({
  slug: 'launch-film',
  title: 'Launch film',
  video: episodeFiles.map((file) => ({
    blob: file,
    name: file.name,
    contentType: 'video/mp4'
  })),
  cover: coverFile
    ? { blob: coverFile, name: coverFile.name, contentType: coverFile.type }
    : undefined
})
```

`video` accepts either one source for backwards compatibility or an ordered source array. The result
contains all episodes in `videoAssets` and keeps the first one in `videoAsset`.

Keep the API Key in a server-side secret store. Browser extensions must use protected extension
storage and must never embed the token in a publicly served frontend bundle.

## License

Copyright © 2024-2025 [LDC Labs](https://github.com/ldclabs).

Licensed under the MIT License. See [LICENSE](LICENSE) for details.

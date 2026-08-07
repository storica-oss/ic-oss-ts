# Example: TypeScript SDK upload from Node.js

[IC OSS](https://github.com/storica-oss) is canister-native object storage on the Internet Computer. This example uploads one or more local files with `BucketCanister` and `Uploader` from `@ldclabs/ic_oss_ts`.

For the complete CLI and TypeScript workflow, see the [tool guide](../../docs/usage.md) or [中文指南](../../docs/usage.zh-CN.md).

## Install

```bash
cd examples/upload
npm install
```

## Create a local example identity

```bash
npm run identity -- ./storica-example-identity.json
```

The command creates the file with mode `0600` and refuses to overwrite an existing file. Add the printed Principal as an OSS Manager in Market Account or OSS Admin. Never commit the identity file.

## Upload to IC mainnet

```bash
export IC_OSS_NETWORK=ic
export IC_OSS_BUCKET='aaaaa-aa'
export IC_OSS_IDENTITY_FILE='./storica-example-identity.json'

npm run upload -- ./README.md ./package.json
```

## Upload to a local replica

```bash
export IC_OSS_BUCKET='aaaaa-aa'
export IC_OSS_IDENTITY_FILE='./storica-example-identity.json'
export IC_OSS_HOST='http://127.0.0.1:4943'

npm run upload -- ./README.md
```

`IC_OSS_BUCKET` and `IC_OSS_IDENTITY_FILE` are required. `IC_OSS_NETWORK=ic` selects `https://icp-api.io`; `IC_OSS_HOST` overrides the Agent endpoint.

## License

Copyright © 2024-2025 [LDC Labs](https://github.com/ldclabs).

Licensed under the MIT License. See [LICENSE](../../LICENSE) for details.

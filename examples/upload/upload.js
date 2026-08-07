import { Ed25519KeyIdentity } from '@dfinity/identity'
import { createAgent } from '@dfinity/utils'
import { BucketCanister, Uploader } from '@ldclabs/ic_oss_ts'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const isMainnet = process.env.IC_OSS_NETWORK === 'ic'
const apiHost =
  process.env.IC_OSS_HOST ||
  (isMainnet ? 'https://icp-api.io' : 'http://127.0.0.1:4943')
const bucketCanister = requiredEnv('IC_OSS_BUCKET')
const identityFile = requiredEnv('IC_OSS_IDENTITY_FILE')
const paths = process.argv.slice(2)

if (!paths.length) {
  throw new Error('Pass at least one local file path to upload')
}

async function main() {
  const identityJson = await readFile(identityFile, 'utf8')
  const identity = Ed25519KeyIdentity.fromJSON(identityJson)
  const files = paths.map((filePath) => ({
    parent: 0,
    content: filePath,
    name: path.basename(filePath),
    contentType: ''
  }))

  console.log('Principal:', identity.getPrincipal().toText())
  await uploadFiles(files, identity)
}

async function uploadFiles(files, identity) {
  const agent = await createAgent({
    identity,
    fetchRootKey: !isMainnet,
    host: apiHost,
    verifyQuerySignatures: true
  })
  const bucketClient = BucketCanister.create({
    agent,
    canisterId: bucketCanister
  })
  console.log('Bucket info:\n', await bucketClient.getBucketInfo())
  console.log('Bucket files in root folder:\n', await bucketClient.listFiles(0))

  const uploader = new Uploader(bucketClient)

  for (const file of files) {
    const result = await uploader.upload(file, (progress) => {
      console.log(`Upload ${file.name}:`, progress)
    })

    console.log(`Uploaded ${file.name}:`, result)
  }

  console.log('Bucket files in root folder:\n', await bucketClient.listFiles(0))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

function requiredEnv(name) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is required`)
  return value
}

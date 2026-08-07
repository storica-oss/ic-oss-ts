import { Ed25519KeyIdentity } from '@dfinity/identity'
import { writeFile } from 'node:fs/promises'

const output = process.argv[2] || 'storica-example-identity.json'
const identity = Ed25519KeyIdentity.generate()

await writeFile(output, JSON.stringify(identity.toJSON()), {
  encoding: 'utf8',
  flag: 'wx',
  mode: 0o600
})

console.log('Principal:', identity.getPrincipal().toText())
console.log('Identity file:', output)
console.log('Add this Principal as an OSS Manager and never commit the file.')

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFileSync } from 'node:fs'

import a from '../a.json' with { type: 'json' }
import b from '../b.json' with { type: 'json' }

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

const cnPath = resolve(__dirname, '..', 'cn.json')
const enPath = resolve(__dirname, '..', 'en.json')

const cnJson = {}
const enJson = {}

b.forEach((key, index) => {
	cnJson[key] = a[index]
	enJson[key] = key
})

writeFileSync(cnPath, JSON.stringify(cnJson, null, 4))
writeFileSync(enPath, JSON.stringify(enJson, null, 4))

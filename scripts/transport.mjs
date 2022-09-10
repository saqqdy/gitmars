import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

import a from '../a.json' assert { type: 'json' }
import b from '../b.json' assert { type: 'json' }

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

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

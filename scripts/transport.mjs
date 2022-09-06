import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { writeFileSync } from 'fs'

import a from '../a.json' assert { type: 'json' }
import b from '../b.json' assert { type: 'json' }

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = dirname(__filename)

const aPath = resolve(__dirname, '..', 'a.json')
const cPath = resolve(__dirname, '..', 'c.json')
const arrA = Object.entries(a)
const arrB = Object.entries(b)

arrB.forEach((item, index) => {
    item[0] = arrA[index][0]
})

writeFileSync(aPath, JSON.stringify(Object.fromEntries(arrA)))
writeFileSync(cPath, JSON.stringify(Object.fromEntries(arrB)))

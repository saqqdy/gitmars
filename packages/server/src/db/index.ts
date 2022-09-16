// import { dirname, resolve } from 'path'
// import { fileURLToPath } from 'url'
import { createRequire } from 'node:module'
import path from 'path'
import fs from 'fs'
import sh from 'shelljs'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync.js'
import home from '#lib/utils/home'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
const require = createRequire(import.meta.url)
const dbTmp = require('#lib/db/db.json')
const dbPath = path.join(home(), '.gitmarsdb')

if (!sh.test('-f', dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(dbTmp, null, 4), 'utf-8')
    fs.chmodSync(dbPath, 0o0755)
}
// const adapter = new FileSync(path.join(__dirname, 'db.json'))
const adapter = new FileSync(dbPath)
const db = low(adapter)

export default db

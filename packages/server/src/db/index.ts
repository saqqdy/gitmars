// import { dirname, resolve } from 'path'
// import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import sh from 'shelljs'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import home from '#lib/utils/home'
import dbTmp from '#lib/db/db.json'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
const dbPath = path.join(home(), '.gitmarsdb')

if (!sh.test('-f', dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(dbTmp, null, 4), 'utf-8')
    fs.chmodSync(dbPath, 0o0755)
}
// const adapter = new FileSync(path.join(__dirname, 'db.json'))
const adapter = new FileSync(dbPath)
const db = low(adapter)

export default db

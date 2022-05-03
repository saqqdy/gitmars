import path from 'path'
import fs from 'fs'
import sh from 'shelljs'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import home from '../utils/home'
import dbTmp from './db.json'

const dbPath = path.join(home(), '.gitmarsdb')

if (!sh.test('-f', dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(dbTmp, null, 4), 'utf-8')
    fs.chmodSync(dbPath, 0o0755)
}
// const adapter = new FileSync(path.join(__dirname, 'db.json'))
const adapter = new FileSync(dbPath)
const db = low(adapter)

export default db

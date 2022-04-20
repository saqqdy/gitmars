const path = require('path')
const fs = require('fs')
const sh = require('shelljs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const home = require('../lib/home')()
const dbTmp = require('./db.json')
const dbPath = path.join(home, '.gitmarsdb')
if (!sh.test('-f', dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(dbTmp, null, 4), 'utf-8')
    fs.chmodSync(dbPath, 0o0755)
}
// const adapter = new FileSync(path.join(__dirname, 'db.json'))
const adapter = new FileSync(dbPath)
const db = low(adapter)

module.exports = db

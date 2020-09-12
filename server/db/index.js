
const path = require('path')
const cwd = process.cwd()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(path.join(cwd, 'db/db.json'))
const db = low(adapter)

module.exports = db

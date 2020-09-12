const path = require('path')
const cwd = process.cwd()
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
// console.log(__dirname, process.cwd())
const adapter = new FileSync(path.join(__dirname, 'db.json'))
const db = low(adapter)

module.exports = db

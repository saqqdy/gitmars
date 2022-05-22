const { join } = require('path')
const express = require('express')
const router = express.Router()

const { index } = require('../controller')
const [, uiBin] = process.argv
const distPath = join(uiBin, '../../lib/node_modules/@gitmars/ui/dist')

console.log(100, __dirname, process.argv, uiBin, distPath)
router.use('/', index(distPath))

module.exports = router

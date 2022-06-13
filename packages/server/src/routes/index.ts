const { join } = require('path')
const express = require('express')
const router = express.Router()

const { index } = require('../controller')
const [, uiBin] = process.argv
const distPath = join(uiBin, '../../lib/node_modules/@gitmars/ui/dist')

router.use('/', index(distPath))

module.exports = router

const express = require('express')
const router = express.Router()

const { index } = require('../controller')

console.log(100, __dirname, process.argv)
router.use('/', index())

module.exports = router

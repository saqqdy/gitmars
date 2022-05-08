const express = require('express')
const router = express.Router()

const { index } = require('../controller')

router.use('/', index())

module.exports = router

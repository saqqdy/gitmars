const { join } = require('path')
const express = require('express')
const config = require('../../config')
const router = express.Router()

const fallbackController = require(join(config.path.controller, 'fallback'))

router.use('/', fallbackController())

module.exports = router

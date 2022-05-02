const { join } = require('path')
const express = require('express')
const config = require('../../config')
const router = express.Router()

const staticController = require(join(config.path.controller, 'static'))

router.use('/', staticController())

module.exports = router

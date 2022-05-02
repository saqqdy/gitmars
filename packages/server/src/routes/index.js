const { join } = require('path')
const express = require('express')
const config = require('../../config')
const router = express.Router()

const { index, mobile } = require(join(config.path.controller, 'index'))

router.use('/mobile', mobile())
router.use('/', index())

module.exports = router

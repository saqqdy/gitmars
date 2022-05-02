const { join } = require('path')
const express = require('express')
const router = express.Router()
const config = require('../../config')

const { login, open } = require(join(config.path.controller, 'api'))

router.use('/thirdUser/login', login)
router.use('/thirdUser/open', open)

module.exports = router

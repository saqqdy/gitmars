const { join } = require('path')
const express = require('express')
const config = require('../../config')
const router = express.Router()

const { fallback, api } = require(join(config.path.controller, 'proxy'))

router.use(['/java', '/h5', '/ios', '/android'], fallback())
router.use(['/api'], api())

module.exports = router

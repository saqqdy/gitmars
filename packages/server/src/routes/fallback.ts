const express = require('express')
const fallbackController = require('../controller/fallback')

const router = express.Router()

router.use('/', fallbackController())

module.exports = router
export {}

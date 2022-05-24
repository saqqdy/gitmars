const express = require('express')
const router = express.Router()
const { getCwd, getUpdate } = require('../controller/system')

router.get('/cwd', getCwd)
// 接收git钩子发来的状态变化
router.get('/update', getUpdate)

module.exports = router
export {}

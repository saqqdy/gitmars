import express from 'express'
import { getCwd, getUpdate } from '#lib/controller/system'
const router = express.Router()

router.get('/cwd', getCwd)
// 接收git钩子发来的状态变化
router.get('/update', getUpdate)

export default router

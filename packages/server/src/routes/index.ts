import { join } from 'path'
import express from 'express'
import config from '../config'
const router = express.Router()

const { index } = require(join(config.path.controller, 'index'))

router.use('/', index())

export default router

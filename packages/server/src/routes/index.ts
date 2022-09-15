import { join } from 'path'
import express from 'express'
import { index } from '#lib/controller/index'
const router = express.Router()

const [, uiBin] = process.argv
const distPath = join(uiBin, '../../lib/node_modules/@gitmars/ui/dist')

router.use('/', index(distPath))

export default router

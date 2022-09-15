import express from 'express'
import fallbackController from '#lib/controller/fallback'

const router = express.Router()

router.use('/', fallbackController())

export default router

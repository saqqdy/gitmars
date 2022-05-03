import express from 'express'
import fallbackController from '../controller/fallback'

const router = express.Router()

router.use('/', fallbackController())

export default router

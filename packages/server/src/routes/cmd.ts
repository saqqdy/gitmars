import type { NextFunction, Request, Response } from 'express'
import express from 'express'
import { enterDir, getBranchList, getCurrent, getStatus, readFile } from '#lib/controller/cmd'

const router = express.Router()

// 开启跨域访问
router.all('*', (req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Content-Length, Authorization, Accept, Cache-Control'
	)
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

router.get('/cd', enterDir)

// router.get('/result', function (req: Request, res: Response) {
// 	let out = sh.exec(decodeURIComponent(req.query.cmd) + '&& pwd', { silent: true }).stdout.replace(/\s+$/g, '')
// 	res.status(200).send({ data: out, success: true, code: 1, msg: 'success' })
// })

// 获取当前状态
router.get('/status', getStatus)
// 获取项目列表
router.get('/branch/list', getBranchList)
// 获取项目列表
router.get('/branch/current', getCurrent)
// 读取文件
router.get('/fs/read', readFile)

export default router

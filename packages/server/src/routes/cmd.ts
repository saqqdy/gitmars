import type { NextFunction, Request, Response } from 'express'
import express from 'express'
const router = express.Router()
// import fs from 'fs'
import {
    enterDir,
    getBranchList,
    getCurrent,
    getStatus,
    readFile
} from '../controller/cmd'
// import sh from 'shelljs'
// import glob from '@gitmars/core/es/global'
// import getCurrentBranch from '@gitmars/core/es/git/getCurrentBranch'
// import searchBranches from '@gitmars/core/es/git/searchBranches'

// const error503 = (res: Response) => {
// 	res.status(503).send({ data: null, success: false, code: 0, msg: 'fail' })
// }
// const success = (res: Response, { data, msg = 'success' }: any) => {
//     res.status(200).send({ data, success: true, code: 1, msg })
// }

// 开启跨域访问
router.all('*', (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Content-Length, Authorization, Accept, Cache-Control'
    )
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, GET, DELETE, OPTIONS'
    )
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})

// router.get('/cd', function (req: Request, res: Response) {
//     process.chdir(decodeURIComponent(req.query.dir as string))
//     success(res, { data: true })
// })
router.get('/cd', enterDir)

// router.get('/result', function (req: Request, res: Response) {
// 	let out = sh.exec(decodeURIComponent(req.query.cmd) + '&& pwd', { silent: true }).stdout.replace(/\s+$/g, '')
// 	res.status(200).send({ data: out, success: true, code: 1, msg: 'success' })
// })

// 获取当前状态
// router.get('/status', function (req: Request, res: Response) {
//     res.status(200).send({ data: glob, success: true, code: 1, msg: 'success' })
// })
router.get('/status', getStatus)

// 获取项目列表
// router.get('/branch/list', (req: Request, res: Response) => {
//     const { path, key, type, remote } = req.query
//     // process.chdir('/Users/saqqdy/www/wojiayun/wyweb/webapp/app')
//     const data = searchBranches({ path, key, type, remote })
//     success(res, { data })
// })
router.get('/branch/list', getBranchList)

// 获取项目列表
// router.get('/branch/current', (req: Request, res: Response) => {
//     const data = getCurrentBranch()
//     success(res, { data })
// })
router.get('/branch/current', getCurrent)

// 读取文件
// router.get('/fs/read', (req: Request, res: Response) => {
//     const {
//         query: { path: dir }
//     } = req
//     const type = (dir as string).replace(/[\s\S]*\.([a-z]+)$/, '$1')
//     let data = fs.readFileSync(dir).toString()
//     if (type === 'json') data = JSON.parse(data)
//     success(res, { data })
// })
router.get('/fs/read', readFile)

export default router

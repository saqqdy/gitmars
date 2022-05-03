import type { Request, Response } from 'express'
import express from 'express'
const router = express.Router()
import { getCwd, getUpdate } from '../controller/system'
// import { exec } from 'child_process'
// import { promisify } from 'util'

// const promiseExec = promisify(exec)

// router.get('/cwd', function (req: Request, res: Response) {
//     const { pid } = req.query
//     promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(
//         (newCwd: any) => {
//             const cwd =
//                 typeof newCwd === 'string'
//                     ? newCwd.trim()
//                     : newCwd.stdout.trim()
//             res.status(200).json({ data: cwd })
//         }
//     )
// })
router.get('/cwd', getCwd)

// 接收git钩子发来的状态变化
// router.get('/update', function (req: Request, res: Response) {
//     const { pid } = req.query
//     promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(
//         (newCwd: any) => {
//             const cwd =
//                 typeof newCwd === 'string'
//                     ? newCwd.trim()
//                     : newCwd.stdout.trim()
//             res.status(200).json({ data: cwd })
//         }
//     )
// })
router.get('/update', getUpdate)

export default router

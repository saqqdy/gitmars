import type { Request, Response } from 'express'
const express = require('express')
const router = express.Router()
const { getCwd, getUpdate } = require('../controller/system')
// const { exec } = require('child_process')
// const { promisify } = require('util')

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

module.exports = router
export {}

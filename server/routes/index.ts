import express, { Request, Response } from 'express'
const router = express.Router()
const { exec } = require('child_process')
const { promisify } = require('util')

const promiseExec = promisify(exec)

router.get('/cwd', function (req: Request, res: Response) {
	const { pid } = req.query
	promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd: any) => {
		const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
		res.status(200).json({ data: cwd })
	})
})

// 接收git钩子发来的状态变化
router.get('/update', function (req: Request, res: Response) {
	const { pid } = req.query
	promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then((newCwd: any) => {
		// console.log(newCwd, newCwd.stdout)
		const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
		res.status(200).json({ data: cwd })
	})
})

module.exports = router
export {}

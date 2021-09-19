// var express = require('express'),
// 	router = express.Router()

// /* GET home page. */
// router.get('/', function (req: Request, res: Response, next: NextFunction) {
// 	res.render('index', { title: 'Express' })
// })

// module.exports = router
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const router = express.Router()
const { exec } = require('child_process')
const { promisify } = require('util')

const promiseExec = promisify(exec)

router.get('/cwd', function (req: Request, res: Response) {
	const { pid } = req.query
	promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
		// console.log(newCwd, newCwd.stdout)
		const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
		res.success(cwd)
	})
})

// 接收git钩子发来的状态变化
router.get('/update', function (req: Request, res: Response) {
	const { project } = req.query
	promiseExec(`lsof -a -p ${pid} -d cwd -Fn | tail -1 | sed 's/.//'`).then(newCwd => {
		// console.log(newCwd, newCwd.stdout)
		const cwd = typeof newCwd === 'string' ? newCwd.trim() : newCwd.stdout.trim()
		res.success(cwd)
	})
})

module.exports = router
export {}

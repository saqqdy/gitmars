var express = require('express'),
	router = express.Router()
const fs = require('fs')
// const sh = require('shelljs')
const glob = require('../../bin/js/global')
const { getCurrent, searchBranchs } = require('../../bin/js/index')

const error503 = res => {
	res.status(503).send({ data: null, success: false, code: 0, msg: 'fail' })
}
const success = (res, { data, msg = 'success' }) => {
	res.status(200).send({ data, success: true, code: 1, msg })
}

// 开启跨域访问
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, Cache-Control')
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Credentials', true)
	next()
})

router.get('/cd', function (req, res, next) {
	process.chdir(decodeURIComponent(req.query.dir))
	success(res, { data: true })
})

// router.get('/result', function (req, res, next) {
// 	let out = sh.exec(decodeURIComponent(req.query.cmd) + '&& pwd', { silent: true }).stdout.replace(/[\s]*$/g, '')
// 	res.status(200).send({ data: out, success: true, code: 1, msg: 'success' })
// })

// 获取当前状态
router.get('/status', function (req, res, next) {
	res.status(200).send({ data: glob, success: true, code: 1, msg: 'success' })
})

// 获取项目列表
router.get('/branch/list', (req, res, next) => {
	const { path, key, type, remote } = req.query
	// process.chdir('/Users/saqqdy/www/wojiayun/wyweb/webapp/app')
	let data = searchBranchs({ path, key, type, remote })
	success(res, { data })
})

// 获取项目列表
router.get('/branch/current', (req, res, next) => {
	let data = getCurrent()
	success(res, { data })
})

// 读取文件
router.get('/fs/read', (req, res, next) => {
	const {
		query: { path: dir }
	} = req
	const type = dir.replace(/[\s\S]*\.([a-z]+)$/, '$1')
	console.log(type)
	let data = fs.readFileSync(dir).toString()
	if (type === 'json') data = JSON.parse(data)
	success(res, { data })
})

module.exports = router

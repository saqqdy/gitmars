var express = require('express'),
	router = express.Router()
const sh = require('shelljs')
const global = require('../../bin/js/global')
const { getCurrent, searchBranch } = require('../../bin/js/index')

const error503 = res => {
	res.status(503).send({ data: null, success: false, code: 0, msg: 'fail' })
}
const success = (res, { data, msg = 'success' }) => {
	res.status(200).send({ data: data, success: true, code: 1, msg: msg })
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
	sh.cd(decodeURIComponent(req.query.dir), { silent: true })
	success(res, { data: true })
})

router.get('/result', function (req, res, next) {
	let out = sh.exec(decodeURIComponent(req.query.cmd) + '&& pwd', { silent: true }).stdout.replace(/[\n\s]*$/g, '')
	res.status(200).send({ data: out, success: true, code: 1, msg: 'success' })
})

// 获取当前状态
router.get('/status', function (req, res, next) {
	res.status(200).send({ data: global, success: true, code: 1, msg: 'success' })
})

// 添加项目
router.get('/branch/list', async (req, res, next) => {
	const { key, type, remote } = req.query
	let data = await searchBranch(key, type, remote)
	success(res, { data: data })
})

module.exports = router

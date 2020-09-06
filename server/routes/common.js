var express = require('express'),
	router = express.Router()
const sh = require('shelljs')
const db = require('../db/index')
const { v4: uuidv4 } = require('../node_modules/uuid')

// 开启跨域访问
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, Cache-Control')
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
	res.header('Access-Control-Allow-Credentials', true)
	next()
})

const error503 = res => {
	res.status(503).send({ data: null, success: false, code: 0, msg: 'fail' })
}
const success = (res, { data, msg = 'success' }) => {
	res.status(200).send({ data: data, success: true, code: 1, msg: msg })
}

// 获取项目列表
router.get('/project/list', (req, res, next) => {
	let list = []
	if (req.query.id) {
		list = db.get('projects').find({ id: req.query.id }).value() || null
		if (list.length > 0) list = list[0]
	} else {
		list = db.get('projects').value() || []
	}
	success(res, { data: list })
})

// 添加项目
router.post('/project/add', (req, res, next) => {
	if (!req.body.path) error503(res)
	let id = uuidv4(),
		url = sh.exec(`cd ${req.body.path} && git config --local --get remote.origin.url`, { silent: true }).stdout.replace(/[\n\s]*$/g, ''),
		name = url.replace(/^[\s\S]+\/([a-z0-9A-Z-_]+)\.git$/, '$1')
	db.get('projects').push({ id: id, name: name, path: req.body.path }).write()
	success(res, { data: true })
})

// 删除项目
router.post('/project/del', (req, res, next) => {
	if (!req.body.id) error503(res)
	db.get('projects').remove({ id: req.body.id }).write()
	success(res, { data: true })
})

// 更新项目
router.post('/project/update', (req, res, next) => {
	if (!req.body.id) error503(res)
	db.get('projects').find({ id: req.body.id }).assign({ name: req.body.name, path: req.body.path }).write()
	success(res, { data: true })
})

// 检测项目
router.get('/project/check', (req, res, next) => {
	if (!req.query.path) error503(res)
	let code = sh.cd(`${req.query.path}/.git`).code,
		msg
	if (code === 0 && db.get('projects').find({ path: req.query.path }).value()) code = 2
	switch (code) {
		case 0:
			msg = '路径合法'
			break
		case 1:
			msg = '路径不是正确对的git项目路径'
			break
		case 2:
			msg = '项目路径已存在'
			break
		default:
			break
	}
	success(res, {
		data: {
			code: code,
			message: msg
		}
	})
})

module.exports = router

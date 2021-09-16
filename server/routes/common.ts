var express = require('express'),
	router = express.Router()
const path = require('path')
const sh = require('shelljs')
const db = require('../db/index')
const { v4: uuidv4 } = require('uuid')

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
	res.status(200).send({ data, success: true, code: 1, msg })
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
	const cwd = process.cwd()
	let { path: dir = null } = req.body,
		id,
		url,
		name
	if (!dir) error503(res)
	dir = dir.split(path.sep).join('/')
	id = uuidv4()
	process.chdir(dir)
	url = sh.exec(`git config --local --get remote.origin.url`, { silent: true }).stdout.replace(/\s+$/g, '')
	name = url ? url.replace(/^[\s\S]+\/([\w-]+)\.git$/, '$1') : dir.replace(/^[\s\S]+\/([\w-]+)$/, '$1')
	process.chdir(cwd)
	db.get('projects').push({ id, name, path: dir }).write()
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
	let code = sh.test('-e', `${req.query.path}/.git`) ? 0 : 1,
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
			code,
			message: msg
		}
	})
})

module.exports = router
export {}

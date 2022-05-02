const { join } = require('path')
const config = require('../../config')
const staticAssets = require('../helper/static-assets')

function index(path = '/client/dist') {
	return [
		staticAssets(join(config.path.webapp, path)),
		(req, res) => {
			res.setHeader('Cache-Control', 'no-cache')
			res.render(join(config.path.webapp, path, 'index.html'))
		}
	]
}

function mobile(path = '/mobile/dist') {
	return [
		staticAssets(join(config.path.webapp, path)),
		(req, res) => {
			res.setHeader('Cache-Control', 'no-cache')
			res.render(join(config.path.webapp, path, 'index.html'))
		}
	]
}

module.exports = {
	mobile,
	index
}

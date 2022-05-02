const { join } = require('path')
const co = require('co')
const config = require('../../config')
// const logger = require(config.path.logger).getLogger('website')
const apiService = require(join(config.path.service, 'api'))

// 云之家配置/thirdUser/login接口，默认追加ticket，然后拿ticket去找后端接口/api/users/login换access_token
function login(req, res) {
	co(function* () {
		const ticket = req.query.ticket
		const head = req.query.head
		const sessionID = req.session.id
		const result = yield apiService.getTokenByTicket(ticket, sessionID)
		const params = []
		if (head) {
			params.push('head=' + head)
		}
		if (result.data.access_token) {
			params.push('access_token=' + result.data.access_token)
			params.push('userRole=' + result.data.userRole)
			req.session.access_token = result.data.access_token
		} else {
			req.session.access_token = ''
		}
		res.redirect('/mobile/index.html?' + params.join('&'))
	})
}

// 消息中心直接打开消息， 后端接口/thirdUser/auth换access_token
function open(req, res) {
	co(function* () {
		const openId = req.query.openId
		const auth = req.query.auth
		const moduleType = req.query.moduleType
		const result = yield apiService.getTokenByOpenId(openId, auth)
		const params = []
		if (result.data.access_token) {
			params.push('access_token=' + result.data.access_token)
			params.push('userRole=' + result.data.userRole)
			req.session.access_token = result.data.access_token
		} else {
			req.session.access_token = ''
		}
		res.redirect(
			'/mobile/index.html?' + params.join('&') + '#' + moduleType
		)
	})
}

module.exports = {
	login,
	open
}

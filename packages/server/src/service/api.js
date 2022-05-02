const request = require('request')
const config = require('../../config')
// const logger = require(config.path.logger).getLogger('website')

module.exports = {
	// 根据云之家ticket查询token
	getTokenByTicket(ticket, sessionId) {
		return new Promise((resolve, reject) => {
			request.get(
				{
					url: `${config.api}/api/users/login?ticket=${ticket}&sessionId=${sessionId}`
				},
				function (err, res, body) {
					if (err) {
						reject(err)
						return
					}
					const result = JSON.parse(body)
					resolve(result)
				}
			)
		})
	},
	// 根据openId激活token
	getTokenByOpenId(openId, auth) {
		return new Promise((resolve, reject) => {
			request.get(
				{
					url: `${config.api}/api/users/open?openId=${openId}&auth=${auth}`
				},
				function (err, res, body) {
					if (err) {
						reject(err)
						return
					}
					const result = JSON.parse(body)
					resolve(result)
				}
			)
		})
	}
}

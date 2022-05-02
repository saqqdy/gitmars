const config = require('../../config')
const staticNoHash = require('../helper/static-no-hash')

module.exports = function (path) {
	if (!path) path = config.path.webapp + '/static'
	return staticNoHash(path)
}

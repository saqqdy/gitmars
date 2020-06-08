const sh = require('shelljs')
const { pwd } = require('./global')
/**
 * getConfigFrom
 * @description 读取配置来源
 * @returns {Number} 返回来源0，1，2
 */
const getConfigFrom = () => {
	if (sh.test('-f', pwd + '/.gitmarsrc')) {
		return 1
	} else if (sh.test('-f', pwd + '/gitmarsconfig.json')) {
		return 2
	}
	return 0
}
module.exports = getConfigFrom()

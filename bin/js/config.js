const sh = require('shelljs')
const { defaults } = require('./global')
const { root } = require('./gitRevParse')()
const configFrom = require('./configFrom')

/**
 * getConfig
 * @description 读取配置
 * @returns {Object} arr 返回配置对象
 */
const getConfig = () => {
	let config = {}
	if (configFrom === 1) {
		let str = sh
				.cat(root + '/.gitmarsrc')
				.stdout.replace(/(^\n*)|(\n*$)/g, '')
				.replace(/\n{2,}/g, '\n')
				.replace(/\r/g, '')
				.replace(/[^\S\x0a\x0d]/g, ''),
			arr = []
		if (str) arr = str.split('\n')
		arr.forEach(el => {
			el.replace(/^([a-zA-Z0-9]+)\=([\s\S]+)$/, (a, b, c) => {
				config[b] = c || null
			})
		})
	} else if (configFrom === 2) {
		config = require(root + '/gitmarsconfig.json')
	}
	return { ...defaults, ...config }
}
module.exports = getConfig()

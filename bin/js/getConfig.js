const fs = require('fs')
const gitRevParse = require('./gitRevParse')
const { cosmiconfigSync } = require('cosmiconfig')

/**
 * getConfig
 * @description 读取配置
 * @param {String} pathName 可传入目录或者文件，传入文件时，直接读取文件
 * @returns {Object} arr 返回配置对象
 */
const getConfig = (pathName, moduleName = 'gitmars') => {
	if (!pathName) {
		let { absUrl } = gitRevParse()
		pathName = absUrl
	}
	const defaults = {
		skipCI: true
	}
	const explorer = cosmiconfigSync(moduleName)
	const info = fs.statSync(pathName)
	if (info.isDirectory()) {
		// 传入目录
		const { config = {} } = explorer.search(pathName) || {}
		return Object.assign({}, defaults, config)
	} else {
		// 传入文件
		const { config = {} } = explorer.load(pathName) || {}
		return Object.assign({}, defaults, config)
	}
}
module.exports = getConfig

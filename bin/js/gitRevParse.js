const sh = require('shelljs')
const slash = require('slash')

/**
 * gitRevParse
 * @description 获取git路径
 * @returns {Object} arr 返回对象
 */
function gitRevParse(cwd = process.cwd()) {
	const absUrl = slash(sh.exec('git rev-parse --show-toplevel', { silent: true }).stdout.replace(/[\s]*$/g, ''))
	const result = sh.exec('git rev-parse --show-prefix --git-common-dir', { silent: true }).stdout.replace(/[\s]*$/g, '')
	const [prefix, gitCommonDir] = result
		.split('\n')
		.map(s => s.trim())
		.map(slash)
	return { prefix: prefix || '.', gitCommonDir, absUrl }
}

module.exports = gitRevParse

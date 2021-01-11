const sh = require('shelljs')
const slash = require('slash')

/**
 * getGitConfig
 * @description 获取git配置
 * @returns {Object} arr 返回对象
 */
function getGitConfig(cwd = process.cwd()) {
	const result = sh.exec('git config --local --get remote.origin.url', { silent: true }).stdout.replace(/[\s]*$/g, '')
	const [gitUrl] = result
		.split('\n')
		.map(s => s.trim())
		.map(slash)
	return { gitUrl, appName: gitUrl.replace(/^[\s\S]+\/([a-z0-9A-Z-_]+)\.git$/, '$1') }
}

module.exports = getGitConfig

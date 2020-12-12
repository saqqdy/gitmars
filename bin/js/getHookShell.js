const fs = require('fs')
const path = require('path')
const readPkg = require('./readPkg')
const getHookComment = require('./getHookComment')

/**
 * getHookShell
 * @description 生成hook主程序
 * @returns {Object} arr 返回对象
 */
function getHookShell() {
	const pkg = readPkg(path.join(__dirname, '../..'))
	const hookShell = fs.readFileSync(path.join(__dirname, '../sh/gitmars.sh'), 'utf-8').replace('gitmarsVersion="0.0.0"', `gitmarsVersion="${pkg.version}"`)
	return [getHookComment(), '', hookShell].join('\n')
}
module.exports = getHookShell

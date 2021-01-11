const fs = require('fs')
const path = require('path')
const { hookList } = require('./global')
const { gitHookDir } = require('./gitRevParse')()
const getHookComment = require('./hook/getHookComment')
const getHookType = require('./hook/getHookType')
const getHookShell = require('./hook/getHookShell')
const getLocalShell = require('./hook/getLocalShell')

/**
 * createHooks
 * @description 创建git钩子
 * @param {String} dir default=gitHookDir
 */
function createHooks(dir = gitHookDir) {
	// 创建hook文件方法
	const writeHook = (filename, shell) => {
		fs.writeFileSync(filename, shell, 'utf-8')
		fs.chmodSync(filename, 0o0755)
	}
	const hooks = hookList.map(hookName => path.join(dir, hookName))
	hooks.forEach((filename, i) => {
		const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`
		const name = path.basename(filename)
		// 检查hook文件是否已存在
		if (fs.existsSync(filename)) {
			const hook = fs.readFileSync(filename, 'utf-8')
			// 合并
			if (getHookType.isGhooks(hook)) {
				console.info(`合并已存在的ghooks钩子: ${name}`)
				return writeHook(filename, hookShell)
			}
			// 合并
			if (getHookType.isPreCommit(hook)) {
				console.info(`合并已存在的pre-commit钩子: ${name}`)
				return writeHook(filename, hookShell)
			}
			// 更新
			if (getHookType.isGitmars(hook) || getHookType.isHusky(hook) || getHookType.isYorkie(hook)) {
				return writeHook(filename, hookShell)
			}
			// 跳过
			console.info(`跳过已存在的用户git钩子: ${name}`)
			return
		}
		// 如果不存在钩子，创建
		writeHook(filename, hookShell)
	})
}

/**
 * removeHooks
 * @description 创建git钩子
 * @param {String} dir default=gitHookDir
 */
function removeHooks(dir = gitHookDir) {
	const hooks = hookList.map(hookName => path.join(dir, hookName))
	hooks
		.filter(filename => {
			if (fs.existsSync(filename)) {
				const hook = fs.readFileSync(filename, 'utf-8')
				return getHookType.isGitmars(hook)
			}
			return false
		})
		.forEach(filename => {
			fs.unlinkSync(filename)
		})
}

/**
 * createHookShell
 * @description 创建主程序
 */
function createHookShell(dir = gitHookDir) {
	fs.writeFileSync(path.join(dir, 'gitmars.sh'), getHookShell(), 'utf-8')
}

/**
 * removeHookShell
 * @description 移除主程序
 */
function removeHookShell(dir = gitHookDir) {
	const filename = path.join(dir, 'gitmars.sh')
	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * createLocalShell
 * @description 创建本地脚本
 */
function createLocalShell(dir = gitHookDir, pmName, relativeUserPkgDir) {
	fs.writeFileSync(path.join(dir, 'gitmars.local.sh'), getLocalShell(pmName, relativeUserPkgDir), 'utf-8')
}

/**
 * removeLocalShell
 * @description 移除本地脚本
 */
function removeLocalShell(dir = gitHookDir) {
	const filename = path.join(dir, 'gitmars.local.sh')
	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

module.exports = {
	createHooks,
	removeHooks,
	createHookShell,
	removeHookShell,
	createLocalShell,
	removeLocalShell
}

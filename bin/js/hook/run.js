const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')
const readPkg = require('../readPkg')
const getHookComment = require('./getHookComment')
const config = require('./getConfig')()

function getCommand(cwd, hookName) {
	return config && config.hooks && config.hooks[hookName]
}
function runCommand(cwd, hookName, cmd, env) {
	console.log(`gitmars > ${hookName} (node ${process.version})`)
	const { status } = spawnSync('sh', ['-c', cmd], {
		cwd,
		env: Object.assign(Object.assign({}, process.env), env),
		stdio: 'inherit'
	})
	if (status !== 0) {
		const noVerifyMessage = ['commit-msg', 'pre-commit', 'pre-rebase', 'pre-push'].includes(hookName) ? '(add --no-verify to bypass)' : '(cannot be bypassed with --no-verify due to Git specs)'
		console.log(`gitmars > ${hookName} hook failed ${noVerifyMessage}`)
	}
	// If shell exits with 127 it means that some command was not found.
	// However, if gitmars has been deleted from node_modules, it'll be a 127 too.
	// To be able to distinguish between both cases, 127 is changed to 1.
	if (status === 127) {
		return 1
	}
	return status || 0
}
/**
 * @param {array} argv process.argv
 * @param {string} options.cwd cwd
 * @param {promise} options.getStdinFn - used for mocking only
 */
/**
 * run
 * @description 运行程序
 * @returns {Object} arr 返回对象
 */
function run([, , hookName = '', ...GITMARS_GIT_PARAMS], { cwd = process.cwd() } = {}) {
	const command = getCommand(cwd, hookName)
	// Add GITMARS_GIT_PARAMS to env
	const env = {}
	if (GITMARS_GIT_PARAMS === null || GITMARS_GIT_PARAMS === void 0 ? void 0 : GITMARS_GIT_PARAMS.length) {
		env.GITMARS_GIT_PARAMS = GITMARS_GIT_PARAMS.join(' ')
	}
	if (command) {
		return runCommand(cwd, hookName, command, env)
	}
	return 0
}
module.exports = run

const sh = require('shelljs')
let pwd = sh.exec('git rev-parse --show-toplevel', { silent: true }).stdout.replace(/[\n\s]*$/g, ''),
	// gitDir = sh.exec('git rev-parse --git-dir', { silent: true }).stdout.replace(/[\n\s]*$/g, ''),
	gitDir = pwd + '/.git',
	gitHookDir = pwd + '/.git/hooks',
	gitUrl = sh.exec('git config --local --get remote.origin.url', { silent: true }).stdout.replace(/[\n\s]*$/g, ''),
	appName = gitUrl.replace(/^[\s\S]+\/([a-z0-9A-Z-_]+)\.git$/, '$1'),
	system = sh.exec('uname -s', { silent: true }).stdout || 'MINGW64_NT',
	hookList = ['applypatch-msg', 'pre-applypatch', 'post-applypatch', 'pre-commit', 'pre-merge-commit', 'prepare-commit-msg', 'commit-msg', 'post-commit', 'pre-rebase', 'post-checkout', 'post-merge', 'pre-push', 'post-update', 'push-to-checkout', 'pre-auto-gc', 'post-rewrite', 'sendemail-validate']
const defaults = {
	master: 'master',
	develop: 'dev',
	release: 'release',
	bugfix: 'bug',
	support: 'support',
	user: '',
	email: '',
	msgTemplate: '${message}；项目：${project}；路径：${pwd}',
	msgUrl: '',
	apolloConfig: '',
	hooks: ''
}

module.exports = { pwd, gitDir, gitHookDir, gitUrl, appName, system, hookList, defaults }

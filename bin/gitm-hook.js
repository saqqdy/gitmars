#!/usr/bin/env node
const program = require('commander')
const sh = require('shelljs')
const { options, args } = require('./conf/hook')
const { error, warning, getCurrent, createArgs } = require('./js/index')
const { init, remove, getIsMergedBranch, getIsUpdatedInTime, getIsMergeAction, getBehandLogs, getAheadLogs } = require('./js/hook')
const config = require('./js/getConfig')()

/**
 * gitm hook
 * gitm hook init
 * gitm hook remove
 * gitm hook config
 */
program.name('gitm hook').usage('[command]').description('git hook钩子')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach(o => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .arguments('[command] [args...]')
// .option('--no-verify', '是否需要跳过校验权限', false)
// .option('--latest [latest]', '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y', '7d')
// .option('--limit [limit]', '最多查询的日志条数')
// .option('-t, --type <type>', '检测类型')
// .option('--branch [branch]', '要查询的分支')
program.action(async (command, args, opt) => {
	console.log('gitmars hooks is running')
	// 不检测直接返回
	if (opt.noVerify) {
		sh.exit(0)
		return
	}

	if (command === 'init') {
		init()
	} else if (command === 'remove') {
		remove()
	} else {
		opt.type = opt.type ? opt.type.split(',') : []
		const mainBranchs = [config.master, config.develop, config.release, config.support, config.bugfix]
		const current = getCurrent()
		const currentPrefix = current.split('/')[0]
		// [1,2]
		// env
		// {
		//   NVM_INC: '/Users/saqqdy/.nvm/versions/node/v12.18.4/include/node',
		//   TERM_PROGRAM: 'vscode',
		//   GITHEAD_acc96d08801012ad966d6e6290d6e300ac7e515f: 'feature/hooks',
		//   NVM_CD_FLAGS: '-q',
		//   SHELL: '/bin/zsh',
		//   TERM: 'xterm-256color',
		//   HOMEBREW_BOTTLE_DOMAIN: 'https://mirrors.ustc.edu.cn/homebrew-bottles',
		//   TMPDIR: '/var/folders/g_/l7kkw491041c0j788971x61h0000gn/T/',
		//   TERM_PROGRAM_VERSION: '1.52.1',
		//   ORIGINAL_XDG_CURRENT_DESKTOP: 'undefined',
		//   GIT_REFLOG_ACTION: 'merge feature/hooks',
		//   ZSH: '/Users/saqqdy/.oh-my-zsh',
		//   NVM_DIR: '/Users/saqqdy/.nvm',
		//   USER: 'saqqdy',
		//   COMMAND_MODE: 'unix2003',
		//   GIT_INDEX_FILE: '.git/index',
		//   SSH_AUTH_SOCK: '/private/tmp/com.apple.launchd.AWN6MRz7nq/Listeners',
		//   __CF_USER_TEXT_ENCODING: '0x1F5:0x19:0x34',
		//   PAGER: 'less',
		//   GIT_PREFIX: '',
		//   LSCOLORS: 'Gxfxcxdxbxegedabagacad',
		//   PATH: '/usr/local/Cellar/git/2.30.0/libexec/git-core:/usr/local/Cellar/git/2.30.0/libexec/git-core:/Users/saqqdy/.nvm/versions/node/v12.18.4/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Applications/VMware Fusion.app/Contents/Public:/Library/Apple/usr/bin:/Users/saqqdy/.nvm/versions/node/v12.18.4/bin',
		//   _: '/Users/saqqdy/.nvm/versions/node/v12.18.4/bin/gitm',
		//   LaunchInstanceID: '8EF81FC6-B59A-459E-8571-F561E68E8C5C',
		//   __CFBundleIdentifier: 'com.microsoft.VSCode',
		//   PWD: '/Users/saqqdy/www/wojiayun/wyweb',
		//   LANG: 'zh_CN.UTF-8',
		//   GITMARS_GIT_PARAMS: '',
		//   XPC_FLAGS: '0x0',
		//   XPC_SERVICE_NAME: '0',
		//   HOME: '/Users/saqqdy',
		//   NVM_LOCAL: '/usr/local/opt/nvm',
		//   SHLVL: '3',
		//   VSCODE_GIT_ASKPASS_MAIN: '/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js',
		//   LESS: '-R',
		//   LOGNAME: 'saqqdy',
		//   VSCODE_GIT_IPC_HANDLE: '/var/folders/g_/l7kkw491041c0j788971x61h0000gn/T/vscode-git-ccf0d34b37.sock',
		//   NVM_BIN: '/Users/saqqdy/.nvm/versions/node/v12.18.4/bin',
		//   GIT_ASKPASS: '/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh',
		//   VSCODE_GIT_ASKPASS_NODE: '/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Renderer).app/Contents/MacOS/Code Helper (Renderer)',
		//   SECURITYSESSIONID: '186a9',
		//   GIT_EXEC_PATH: '/usr/local/Cellar/git/2.30.0/libexec/git-core',
		//   COLORTERM: 'truecolor'
		// }

		// argv
		// [
		// 	'/Users/saqqdy/.nvm/versions/node/v12.18.4/bin/node',
		// 	'/Users/saqqdy/www/saqqdy/gitmars/bin/gitm-hook.js',
		// 	'--type',
		// 	'1,2',
		// 	'--latest',
		// 	'7d'
		// ]
		console.log(opt.type, process.env, process.argv)
		// 检测权限 command = hookName
		// 检测类型对应上面的检测方法
		if (mainBranchs.includes(current) && current !== config.develop && opt.type.includes('1')) {
			// 分支合并主干分支之后，检测该分支是否合并过dev，没有合并过的，不允许继续执行commit
			const [command, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(' ') : []
			if (command === 'merge') {
				const isMergedBranch = getIsMergedBranch(branch, 'dev')
				if (!isMergedBranch) {
					console.info('检测到你的分支没有合并过dev')
					sh.exit(0)
				}
			}
		}
		if (mainBranchs.includes(current) && opt.type.includes('2')) {
			// 分支合并主干分支之后，检测该分支是否同步过上游分支的代码，没有同步过的，不允许继续执行commit
			const [command, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(' ') : []
			// const branchPrefix = branch.split('/')[0]
			// ['bugfix', 'feature', 'support'].includes(branchPrefix)
			if (command === 'merge') {
				const isUpdatedInTime = getIsUpdatedInTime({ latest: opt.latest, branch })
				if (!isUpdatedInTime) {
					console.info('检测到你1周内没有同步过主干分支代码')
					sh.exit(0)
				}
			}
		}
		if (mainBranchs.includes(current) && opt.type.includes('3')) {
			// 在主干分支执行push推送时，检测最后一次提交是否为merge记录，如果不是，提示不允许直接在主干分支做修改
			const isMergeAction = getIsMergeAction()
			!isMergeAction && console.info('检测到你直接在主干分支修改代码')
			// const behandLogs = getBehandLogs()
			// const aheadLogs = getAheadLogs()
			// let isMerge = true
			// aheadLog: for (let logStr of aheadLogs) {
			// 	let logs = logStr.split(' ')
			// 	if (logs.length < 2) {
			// 		console.info(warning('检测到你直接在主干分支修改代码'))
			// 		isMerge = false
			// 		break aheadLog
			// 	}
			// }
			// console.info('本地领先的记录', aheadLogs)
			// console.info('本地落后的记录', behandLogs)
			// if (isMerge) {
			// 	sh.exit(0)
			// } else {
			// 	sh.echo(error('不允许在主干分支直接更改代码提交，请联系管理员'))
			// 	sh.exit(1)
			// }
		}
		if (mainBranchs.includes(current) && opt.type.includes('4')) {
			// 在主干分支执行push推送时，检测是否需要先执行pull
			const behandLogs = getBehandLogs()
			behandLogs.length && console.info('你本地分支版本落后于远程分支，请先执行pull')
		}
	}
	sh.exit(0)
})
program.parse(process.argv)

const sh = require('shelljs')
const colors = require('colors')
let pwd = sh.pwd() + '/',
	configFrom = 0,
	config = {}
const warning = txt => {
	return colors.red(txt)
}
const success = txt => {
	return colors.green(txt)
}
const defaults = {
	master: 'master',
	develop: 'dev',
	release: 'release',
	bugfix: 'bug',
	support: 'support',
	user: '',
	email: ''
}
const getConfigFrom = () => {
	if (sh.test('-f', pwd + '.gitmarsrc')) {
		return 1
	} else if (sh.test('-f', 'gitmarsconfig.json')) {
		return 2
	}
	return 0
}
configFrom = getConfigFrom()

/**
 * getConfig
 * @description 读取配置
 * @returns {Object} arr 返回配置对象
 */
function getConfig() {
	if (configFrom === 1) {
		let str = (sh.cat('.gitmarsrc') + '')
				.replace(/(^\n*)|(\n*$)/g, '')
				.replace(/\n{2,}/g, '\n')
				.replace(/[^\S\x0a\x0d]/g, ''),
			arr = []
		if (str) arr = str.split('\n')
		arr.forEach(el => {
			let o = el.split('=')
			config[o[0]] = o[1] || null
		})
		return config
	} else if (configFrom === 2) {
		return require(pwd + 'gitmarsconfig.json')
	}
	return defaults
}
config = getConfig()

/**
 * wait
 * @description 递归执行程序
 */
const wait = (list, fun) => {
	// 最后一条指令，执行完成之后退出递归
	if (list.length === 0) {
		fun()
		return
	} else {
		fun(list[0], (kill = false) => {
			// 强制中断
			if (kill) return
			list.shift()
			wait(list, fun)
		})
	}
}

/**
 * queue
 * @description 脚本执行主程序
 * @param {Array} list 脚本序列
 */
const queue = list => {
	return new Promise((resolve, reject) => {
		let returns = []
		if (list.length === 0) reject('指令名称不能为空')
		list = JSON.parse(JSON.stringify(list))
		wait(list, (command, cb) => {
			let config = {
					silent: true,
					kill: true,
					again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
				},
				cmd = command
			// 传入对象形式：{ cmd: '', config: {} }
			if (command instanceof Object) {
				config = Object.assign(config, command.config || {})
				cmd = command.cmd
			}
			// console.log(4000000, cmd)
			if (!cmd) {
				// 只有一条指令，不需返回数组形式
				// resolve(returns.length === 1 ? returns[0] : returns)
				resolve(returns)
			} else {
				sh.exec(cmd, config, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err, config, cmd })
					// console.log('log: ', { code, out, err })
					if (code !== 0) setLog({ command, code, out, err })
					if (code !== 0 && config.kill) {
						// 当前指令执行错误且设置该条指令需要中断，则中断递归
						let rest = JSON.parse(JSON.stringify(list))
						if (!config.again) rest.shift()
						cb(true) // 回调并中断执行
						setCache(rest)
						// 只有silent模式才需要输出信息
						config.silent && sh.echo(warning(err))
						sh.echo(warning('指令 ' + cmd + ' 执行失败，中断了进程'))
						rest.length > 0 && sh.echo(warning('请处理相关问题之后输入gitm continue继续'))
						sh.exit(1)
						// 抛出异常
						// reject({
						// 	// result: returns.length === 1 ? returns[0] : returns,
						// 	result: returns, // 执行完的指令序列返回值
						// 	cmd: cmd, // 最后一次执行的指令
						// 	msg: { code, out, err }, // 最后一条消息
						// 	config: config, // 指令配置
						// 	rest: rest // 剩余未执行的指令
						// })
					} else {
						cb() // 回调，继续执行吓一条
					}
				})
			}
		})
	})
}

/**
 * getCache
 * @description 获取未执行脚本列表
 * @returns {Array} arr 返回数组
 */
const getCache = () => {
	let arr = []
	if (sh.test('-f', pwd + '.git/.gitmarscommands')) {
		arr = (sh.cat('.git/.gitmarscommands') + '').replace(/(^\n*)|(\n*$)/g, '').replace(/\n{2,}/g, '\n')
		arr = JSON.parse(arr)
	}
	return arr
}

/**
 * setCache
 * @description 存储未执行脚本列表
 */
const setCache = rest => {
	sh.exec(`echo '${JSON.stringify(rest)}' >.git/.gitmarscommands`)
}

/**
 * setLog
 * @description 存储错误日志
 */
const setLog = log => {
	sh.exec(`echo '${JSON.stringify(log)}' >>.git/.gitmarslog`)
}

/**
 * getStatus
 * @description 获取是否有未提交的文件
 * @returns {Boolean} true 返回true/false
 */
const getStatus = async () => {
	const data = await queue(['gitm status'])
	if (data[0].out.indexOf('Changes to be committed') > -1 || data[0].out.indexOf('Changes not staged for commit') > -1) {
		sh.echo(warning('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get')
		sh.exit(1)
		return false
	} else if (data[0].out.indexOf('Untracked files') > -1) {
		sh.echo(warning('您还有未加入版本的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get')
		sh.exit(1)
		return false
	} else {
		return true
	}
}

/**
 * getCurrent
 * @description 获取当前分支
 * @returns {String} 返回名称
 */
const getCurrent = async () => {
	const data = await queue(['gitm branch -k \\*'])
	return data[0].out.replace(/^\*\s+/, '')
}

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}

module.exports = { pwd, warning, success, defaults, config, configFrom, wait, queue, getCache, setCache, getStatus, getCurrent, handleConfigOutput }

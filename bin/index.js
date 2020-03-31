const sh = require('shelljs')
const colors = require('colors')
let pwd = sh.pwd() + '/',
	configFrom = 0,
	config = {}
const warning = txt => {
	return colors.yellow(txt)
}
const error = txt => {
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
	email: '',
	msgTemplate: '${message}；项目：${project}；路径：${pwd}',
	msgUrl: 'http://crp.kingdee.com/cd/metroOperateOutside/startMetroByMetroId?metroId=305648017963220992&describe=1235&isCurlAnother=false'
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
				.replace(/\r/g, '')
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
	return {}
}
config = { ...defaults, ...getConfig() }

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
					postmsg: false,
					kill: true,
					again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
				},
				cmd = command
			// 传入对象形式：{ cmd: '', config: {} }
			if (command instanceof Object) {
				config = Object.assign(config, command.config || {})
				cmd = command.cmd
			}
			if (!cmd) {
				// 只有一条指令，不需返回数组形式
				resolve(returns)
			} else {
				sh.exec(cmd, config, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err, config, cmd })
					if (code !== 0) setLog({ command, code, out, err })
					if (code !== 0 && config.kill) {
						// 当前指令执行错误且设置该条指令需要中断，则中断递归
						let rest = JSON.parse(JSON.stringify(list))
						if (!config.again) rest.shift()
						cb(true) // 回调并中断执行
						setCache(rest)
						// 只有silent模式才需要输出信息
						config.silent && sh.echo(error(err))
						sh.echo(error('指令 ' + cmd + ' 执行失败，中断了进程'))
						config.postmsg && postMessage('出错了！指令 ' + cmd + ' 执行失败，中断了进程')
						rest.length > 0 && sh.echo(error('请处理相关问题之后输入gitm continue继续'))
						sh.exit(1)
					} else {
						if (code === 0) {
							sh.echo(success(config.success || '指令 ' + cmd + ' 执行成功'))
							config.postmsg && postMessage(config.success || '指令 ' + cmd + ' 执行成功')
						} else {
							sh.echo(warning(config.fail || '指令 ' + cmd + ' 执行失败'))
						}
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
		arr = (sh.cat('.git/.gitmarscommands') + '')
			.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/\r/g, '')
		arr = JSON.parse(decodeURIComponent(arr))
	}
	return arr
}

/**
 * setCache
 * @description 存储未执行脚本列表
 */
const setCache = rest => {
	sh.echo(encodeURIComponent(JSON.stringify(rest))).to('.git/.gitmarscommands')
	// sh.exec(`echo ${JSON.stringify(rest)}>.git/.gitmarscommands`)
}

/**
 * setLog
 * @description 存储错误日志
 */
const setLog = log => {
	sh.echo(encodeURIComponent(JSON.stringify(log))).to('.git/.gitmarslog')
	// sh.exec(`echo ${JSON.stringify(log)}>>.git/.gitmarslog`)
}

/**
 * getStatus
 * @description 获取是否有未提交的文件
 * @returns {Boolean} true 返回true/false
 */
const getStatus = async () => {
	const data = await queue(['gitm status'])
	if (data[0].out.indexOf('Changes to be committed') > -1 || data[0].out.indexOf('Changes not staged for commit') > -1) {
		sh.echo(error('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get')
		sh.exit(1)
		return false
	} else if (data[0].out.indexOf('Untracked files') > -1) {
		sh.echo(warning('您有未加入版本的文件,') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get')
		return true
	} else {
		return true
	}
}

/**
 * checkBranch
 * @description 获取是否有某个分支
 * @returns {Boolean} true 返回true/false
 */
const checkBranch = async name => {
	const data = await queue([`gitm branch -k ${name}`])
	return data[0].out.replace(/^\s+/, '')
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

/**
 * postMessage
 * @description 发送消息
 */
const postMessage = msg => {
	if (!config.msgTemplate) return
	let message = config.msgTemplate.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, (a, b) => {
		if (b === 'message') return msg
		return getMessage(b)
	})
	message = message.replace(/\s/g, '')
	config.msgUrl && sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`, { silent: true })
}

/**
 * getMessage
 * @description 解析模板数据
 */
const getMessage = type => {
	let str = '',
		d = new Date(),
		name = pwd.match(/\/([a-zA-Z0-9-_]+)\/?$/)
	switch (type) {
		case 'time':
			str = d
			break
		case 'timeNum':
			str = d.getTime()
			break
		case 'pwd':
			str = pwd
			break
		case 'project':
			str = name ? name[1] : ''
			break
		case 'user':
			str = config.user
			break

		default:
			break
	}
	return str
}

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	} else if (name === 'msgUrl') {
		return '请输入云之家消息推送地址，默认：' + defaults.msgUrl
	} else if (name === 'msgTemplate') {
		return '请输入消息模板，默认：' + defaults.msgTemplate
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}

module.exports = { pwd, warning, error, success, defaults, config, configFrom, wait, queue, getCache, setCache, getStatus, checkBranch, getCurrent, postMessage, handleConfigOutput }

const fs = require('fs')
const sh = require('shelljs')
const colors = require('colors')
const { pwd, gitDir, appName, defaults } = require('./global')
const config = require('./config')

const warning = txt => {
	return colors.yellow(txt)
}
const error = txt => {
	return colors.red(txt)
}
const success = txt => {
	return colors.green(txt)
}

/**
 * writeFile
 * @description 写文件
 */
const writeFile = (url, data) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(url, data, err => {
			if (err) {
				reject(new Error('文件写入错误'))
			} else {
				resolve()
			}
		})
	})
}

/**
 * mapTemplate
 * @description 获取模板数据
 */
const mapTemplate = (tmp, data) => {
	if (!tmp || !data) return null
	let str =
		'' +
		tmp.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, (a, b) => {
			if (typeof data === 'function') {
				return data(b)
			}
			for (let k in data) {
				if (b === k) {
					return data[k]
				}
			}
		})
	return str
}

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
			let cfg = {
					silent: true,
					postmsg: false,
					kill: true,
					again: false // 指令执行中断之后是否需要重新执行，类似冲突解决之后的指令，不再需要重复执行
				},
				cmd = command
			// 传入对象形式：{ cmd: '', config: {} }
			if (command instanceof Object) {
				cfg = Object.assign(cfg, command.config || {})
				cmd = command.cmd
			}
			if (!cmd) {
				// 只有一条指令，不需返回数组形式
				resolve(returns)
			} else {
				sh.exec(cmd, cfg, (code, out, err) => {
					let msg = getCommandMessage(cmd)
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err, cfg, cmd })
					if (code !== 0) setLog({ command, code, out, err })
					if (code !== 0 && cfg.kill) {
						// 当前指令执行错误且设置该条指令需要中断，则中断递归
						let rest = JSON.parse(JSON.stringify(list))
						if (!cfg.again) {
							rest.shift()
						} else if (cfg.again !== true) {
							rest.splice(0, 1, cfg.again)
						}
						cb(true) // 回调并中断执行
						setCache(rest)
						// 只有silent模式才需要输出信息
						cfg.silent && sh.echo(error(err))
						sh.echo(error(cfg.fail || msg.fail || '出错了！指令 ' + cmd + ' 执行失败，中断了进程'))
						cfg.postmsg && postMessage('出错了！指令 ' + cmd + ' 执行失败，中断了进程')
						rest.length > 0 && sh.echo(error('请处理相关问题之后输入gitm continue继续'))
						sh.exit(1)
					} else {
						if (code === 0) {
							let m = cfg.success || msg.success
							if (m) {
								sh.echo(success(m))
								cfg.postmsg && postMessage(m)
							}
						} else {
							let m = config.fail || msg.fail || '指令 ' + cmd + ' 执行失败'
							m && sh.echo(warning(m))
						}
						cb() // 回调，继续执行下一条
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
	if (sh.test('-f', gitDir + '/.gitmarscommands')) {
		arr = sh
			.cat(gitDir + '/.gitmarscommands')
			.stdout.split('\n')[0]
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
	sh.touch(gitDir + '/.gitmarscommands')
	sh.sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(rest)), gitDir + '/.gitmarscommands')
}

/**
 * setLog
 * @description 存储错误日志
 */
const setLog = log => {
	sh.touch(gitDir + '/.gitmarslog')
	sh.sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(log)), gitDir + '/.gitmarslog')
}

/**
 * getStatus
 * @description 获取是否有未提交的文件
 * @returns {Boolean} true 返回true/false
 */
const getStatus = () => {
	const out = sh.exec('git status -s --no-column', { silent: false }).stdout.replace(/(^\s+|\n*$)/g, '') // 去除首尾
	let list = out ? out.replace(/\n(\s+)/g, '\n').split('\n') : [],
		sum = {
			A: [],
			D: [],
			M: [],
			'??': []
		}
	if (list.length === 0) return true
	list.forEach(str => {
		let arr = str.trim().replace(/\s+/g, ' ').split(' '),
			type = arr.splice(0, 1)
		if (!sum[type]) sum[type] = []
		sum[type].push(arr.join(' '))
	})
	if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
		sh.echo(error('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get')
		sh.exit(1)
		return false
	} else if (sum['??'].length > 0) {
		sh.echo(warning('您有未加入版本的文件,') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get')
	}
	return true
}

/**
 * checkBranch
 * @description 获取是否有某个分支
 * @returns {Boolean} true 返回true/false
 */
const checkBranch = name => {
	return searchBranchs().findIndex(bh => bh === name) > -1 ? true : false
}

/**
 * getCurrent
 * @description 获取当前分支
 * @returns {String} 返回名称
 */
const getCurrent = () => {
	// return sh.exec('git symbolic-ref --short -q HEAD', { silent: true }).stdout.replace(/[\s]*$/g, '')
	return sh.exec('git br --show-current', { silent: true }).stdout.replace(/[\s]*$/g, '')
}

/**
 * searchBranch
 * @description 获取当前分支
 * @returns {Array} 返回列表数组
 */
const searchBranch = async (opt = {}) => {
	const { key = null, type = null, remote = false } = opt
	const data = (await queue([`gitm branch${key ? ' -k ' + key : ''}${type ? ' -t ' + type : ''}${remote ? ' -r' : ''}`]))[0].out.replace(/\*\s+/g, '')
	let arr = data ? data.split('\n') : []
	arr = arr.map(el => el.trim())
	return arr
}

/**
 * searchBranchs
 * @description 获取当前分支
 * @returns {Array} 返回列表数组
 */
const searchBranchs = (opt = {}) => {
	const { path = pwd, key = null, type = null, remote = false } = opt
	const data = sh.exec(`git ls-remote${remote ? ' --refs' : ' --heads'} --quiet --sort="version:refname" ${path}`, { silent: true }).stdout.replace(/\n*$/g, '')
	let arr = data ? data.split('\n') : [],
		map = {
			heads: [],
			tags: [],
			others: []
		}
	for (let el of arr) {
		let match = el.match(/^\w+[\s]+refs\/(heads|remotes|tags)\/([\w-\/]+)$/)
		if (!match) continue
		switch (match[1]) {
			case 'heads':
				map.heads.push(match[2])
				break
			case 'remotes':
				map.heads.push(match[2])
				break
			case 'tags':
				map.tags.push(match[2])
				break
			default:
				map.others.push(match[2])
				break
		}
	}
	if (type && ['bugfix', 'feature', 'support'].includes(type)) {
		map.heads = map.heads.filter(el => el.indexOf('/' + type + '/') > -1)
	}
	if (key) {
		map.heads = map.heads.filter(el => el.indexOf(key) > -1)
	}

	return map.heads
}

/**
 * getStashList
 * @description 获取暂存区列表
 * @returns {String} 返回名称
 */
const getStashList = async key => {
	const data = (await queue(['git stash list']))[0].out.replace(/^\*\s+/, '')
	let list = (data && data.split('\n')) || [],
		arr = []
	if (list.length > 10) sh.echo(warning(`该项目下一共有${list.length}条暂存记录，建议定期清理！`))
	try {
		list.forEach(item => {
			let msgArr = item.split(':'),
				first = msgArr.shift()
			if (!key || (key && key === msgArr[msgArr.length - 1].trim())) {
				let m = first.match(/^stash@\{(\d+)\}$/)
				// 去除不必要的消息
				if (msgArr.length > 1) msgArr.shift()
				arr.push({
					key: first,
					index: +m[1],
					msg: msgArr.join(':').trim()
				})
			}
		})
	} catch (e) {}
	return arr
}

/**
 * getMessage
 * @description 解析模板数据
 */
const getMessage = type => {
	let str = '',
		d = new Date()
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
			str = appName
			break
		case 'user':
			str = config.user
			break

		default:
			break
	}
	return str
}

/**
 * postMessage
 * @description 发送消息
 */
const postMessage = msg => {
	if (!config.msgTemplate) {
		sh.echo(error('请配置消息发送api地址'))
		return
	}
	let message = mapTemplate(config.msgTemplate, key => {
		if (key === 'message') return msg
		return getMessage(key)
	})
	message = message.replace(/\s/g, '')
	config.msgUrl && sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`, { silent: true })
}

/**
 * getCommandMessage
 * @description 获取通用的指令提示信息
 */
const getCommandMessage = cmd => {
	let msg = {},
		arr = cmd.replace(/[\s]+/g, ' ').split(' ')
	if (arr.length < 2 || arr[0] !== 'git') return msg
	switch (arr[1]) {
		case 'checkout':
			msg.success = '切换分支成功'
			msg.fail = '切换分支失败'
			break
		case 'pull':
			msg.success = '拉取代码成功'
			msg.fail = '拉取代码失败'
			break
		case 'fetch':
			msg.success = '抓取成功'
			msg.fail = '抓取失败'
			break
		case 'commit':
			msg.success = '提交成功'
			msg.fail = '提交失败'
			break
		case 'push':
			msg.success = '推送成功'
			msg.fail = '推送失败'
			break
		case 'cherry-pick':
			msg.success = '同步提交记录成功'
			msg.fail = '同步提交记录失败'
			break
		case 'merge':
			msg.success = 'merge分支成功'
			msg.fail = 'merge分支失败'
			break
		case 'rebase':
			msg.success = 'rebase分支成功'
			msg.fail = 'rebase分支失败'
			break
		case 'revert':
			msg.success = '撤销成功'
			msg.fail = '撤销失败'
			break
		case 'clean':
			msg.success = '清理成功'
			msg.fail = '清理失败'
			break

		default:
			break
	}
	return msg
}

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	} else if (name === 'msgUrl') {
		return '请输入云之家消息推送地址'
	} else if (name === 'msgTemplate') {
		return '请输入消息模板, 默认为：' + defaults[name]
	} else if (name === 'apolloConfig') {
		return '请配置apollo'
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}

const createArgs = args => {
	let argArr = []
	args.forEach(arg => {
		let str = arg.name
		if (arg.variadic) str += '...'
		if (arg.required) str = '<' + str + '>'
		else str = '[' + str + ']'
		argArr.push(str)
	})
	return argArr.join(' ')
}

module.exports = {
	warning,
	error,
	success,
	writeFile,
	mapTemplate,
	wait,
	queue,
	getCache,
	setCache,
	setLog,
	getStatus,
	checkBranch,
	getCurrent,
	searchBranch,
	searchBranchs,
	getStashList,
	postMessage,
	getCommandMessage,
	handleConfigOutput,
	createArgs
}

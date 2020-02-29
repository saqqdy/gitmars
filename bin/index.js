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
		wait(list, (cmd, cb) => {
			let config = {
				silent: true,
				kill: true
			}
			// 传入对象形式：{ cmd: '', config: {} }
			if (cmd instanceof Object) {
				config = Object.assign(config, cmd.config)
				cmd = cmd.cmd
			}
			if (!cmd) {
				// 只有一条指令，不需返回数组形式
				resolve(returns.length === 1 ? returns[0] : returns)
			} else {
				sh.exec(cmd, config, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err })
					if (code !== 0) sh.exec(`echo '${JSON.stringify({ cmd, code, out, err })}' >>.git/.gitmarslog`)
					// 当前指令执行错误且设置该条指令需要中断，则中断递归
					if (code !== 0 && config.kill) {
						let rest = JSON.parse(JSON.stringify(list))
						rest.shift()
						cb(true) // 回调并中断执行
						sh.exec(`echo '${JSON.stringify(rest)}' >.git/.gitmarscommands`)
						// 抛出异常
						reject({
							result: returns.length === 1 ? returns[0] : returns,
							cmd: cmd,
							rest: rest
						})
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
		arr = (sh.cat('.git/.gitmarscommands') + '')
			.replace(/(^\n*)|(\n*$)/g, '')
			.replace(/\n{2,}/g, '\n')
			.replace(/[^\S\x0a\x0d]/g, '')
		arr = JSON.parse(arr)
	}
	return arr
}

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}

module.exports = { pwd, warning, success, defaults, config, configFrom, wait, queue, getCache, handleConfigOutput }

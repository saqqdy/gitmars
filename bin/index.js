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
	user: 'saqqdy_wu',
	email: 'saqqdy_wu@kingdee.com'
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
	return {}
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
					if (code !== 0 && config.kill) {
						let rest = JSON.parse(JSON.stringify(list))
						rest.shift()
						cb(true)
						reject({ result: returns.length === 1 ? returns[0] : returns, cmd: cmd, rest: rest }) // 抛出异常
					} else {
						cb()
					}
				})
			}
		})
	})
}

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}

module.exports = { pwd, warning, success, defaults, config, configFrom, wait, queue, handleConfigOutput }

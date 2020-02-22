const shell = require('shelljs')
const colors = require('colors')
let pwd = shell.pwd() + '/',
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
	if (shell.test('-f', pwd + '.gitmarsrc')) {
		return 1
	} else if (shell.test('-f', 'gitmarsconfig.json')) {
		return 2
	}
	return 0
}
configFrom = getConfigFrom()
function getConfig() {
	if (configFrom === 1) {
		let str = (shell.cat('.gitmarsrc') + '')
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

const wait = (list, cb) => {
	if (list.length === 0) {
		cb()
		return
	} else {
		cb(list[0], () => {
			list.shift()
			wait(list, cb)
		})
	}
}

const queue = list => {
	return new Promise((resolve, reject) => {
		let returns = []
		if (list.length === 0) reject('指令名称不能为空')
		wait(list, (data, cb) => {
			let defaults = {
				silent: true
			}
			// 传入对象形式：{ cmd: '', config: {} }
			if (data instanceof Object) {
				defaults = Object.assign(defaults, data.config)
				data = data.cmd
			}
			if (!data) {
				// 只有一条指令，不需返回数组形式
				resolve(returns.length === 1 ? returns[0] : returns)
			} else {
				shell.exec(data, defaults, (code, out, err) => {
					try {
						out = JSON.parse(out)
					} catch (err) {
						out = out.replace(/\n*$/g, '')
					}
					returns.push({ code, out, err })
					cb()
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
// class gitmars {
// 	constructor(props) {
// 		// super(props)
// 		this.defaults = {
// 			master: 'master',
// 			develop: 'dev',
// 			release: 'release',
// 			bugfix: 'bug',
// 			support: 'support',
// 			user: 'saqqdy_wu',
// 			email: 'saqqdy_wu@kingdee.com'
// 		}
// 	}
// 	// toggleTheme = a => {
// 	// 	console.log(this.state, a)
// 	// }
// 	handleConfigOutput(a) {
// 		//
// 	}
// }
module.exports = { pwd, warning, success, defaults, config, configFrom, wait, queue, handleConfigOutput }

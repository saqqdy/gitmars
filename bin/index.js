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
	if (shell.test('-f', pwd + '.gitmanrc')) {
		return 1
	} else if (shell.test('-f', 'gitmanconfig.json')) {
		return 2
	}
	return 0
}
configFrom = getConfigFrom()
function getConfig() {
	if (configFrom === 1) {
		let str = (shell.cat('.gitmanrc') + '')
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
		return require(pwd + 'gitmanconfig.json')
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

const handleConfigOutput = name => {
	if (name === 'user') {
		return '请输入Git用户名(必填)'
	} else if (name === 'email') {
		return '请输入Git邮箱'
	}
	return '请输入' + name + '分支名称，默认为：' + defaults[name]
}
class Gitman {
	constructor(props) {
		// super(props)
		this.defaults = {
			master: 'master',
			develop: 'dev',
			release: 'release',
			bugfix: 'bug',
			support: 'support',
			user: 'saqqdy_wu',
			email: 'saqqdy_wu@kingdee.com'
		}
	}
	// toggleTheme = a => {
	// 	console.log(this.state, a)
	// }
	handleConfigOutput(a) {
		console.log(a + '222')
	}
}
module.exports = { pwd, warning, success, defaults, config, configFrom, wait, handleConfigOutput }

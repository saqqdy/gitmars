// const pty = require('node-pty')
const sh = require('shelljs')
const os = require('os')
const cwd = require('../lib/cwd')()
const { getCurrent } = require('../../bin/js/index')
let global = null,
	config = null,
	branch = null,
	timer = null

module.exports = socket => {
	socket.on('create', option => {
		sh.cd(option.cwd || cwd)
		socket.on(option.name + '-exit', size => {
			timer && clearInterval(timer)
		})
		socket.emit(option.name + '-global', global)
		socket.emit(option.name + '-config', config)
		socket.emit(option.name + '-branch', branch)

		// 轮询global配置
		if (!timer)
			timer = setInterval(async () => {
				delete require.cache[require.resolve('../../bin/js/global')]
				delete require.cache[require.resolve('../../bin/js/config')]
				let g = require('../../bin/js/global'),
					c = require('../../bin/js/config'),
					bh = await getCurrent()
				if (!global || JSON.stringify(global) !== JSON.stringify(g)) {
					global = g
					socket.emit(option.name + '-global', g)
				}
				if (!config || JSON.stringify(config) !== JSON.stringify(c)) {
					config = c
					socket.emit(option.name + '-config', c)
				}
				if (!branch || branch !== bh) {
					branch = bh
					socket.emit(option.name + '-branch', bh)
				}
			}, 5000)
	})
	socket.on('remove', name => {
		timer = null
		socket.removeAllListeners(name + '-global')
		socket.removeAllListeners(name + '-config')
		socket.removeAllListeners(name + '-branch')
		socket.removeAllListeners(name + '-exit')
	})
}

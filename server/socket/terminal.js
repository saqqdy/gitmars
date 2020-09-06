const pty = require('node-pty')
const sh = require('shelljs')
const os = require('os')
const cwd = require('../lib/cwd')()
const shell = os.platform() === 'win32' ? 'powershell.exe' : sh.which('zsh') ? 'zsh' : 'bash'
let ptyContainers = {}

module.exports = socket => {
	socket.on('create', option => {
		let ptyProcess = pty.spawn(shell, ['--login'], {
			name: 'xterm-color',
			cols: option.cols || 80,
			rows: option.rows || 24,
			cwd: option.cwd || cwd,
			env: process.env
		})
		ptyProcess.on('data', data => socket.emit(option.name + '-output', data))
		socket.on(option.name + '-input', data => ptyProcess.write(data))
		socket.on(option.name + '-resize', size => {
			ptyProcess.resize(size[0], size[1])
		})
		socket.on(option.name + '-exit', () => {
			ptyProcess.destroy()
		})
		socket.emit(option.name + '-pid', ptyProcess.pid)
		ptyContainers[option.name] = ptyProcess
	})
	socket.on('remove', name => {
		socket.removeAllListeners(name + '-input')
		socket.removeAllListeners(name + '-resize')
		socket.removeAllListeners(name + '-exit')
		if (name && ptyContainers[name] && ptyContainers[name].pid) {
			ptyContainers[name].destroy()
			delete ptyContainers[name]
		}
	})
}

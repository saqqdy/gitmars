import type http from 'http'
import type { IPty } from 'node-pty'
const os = require('os')
const pty = require('node-pty')
const sh = require('shelljs')
const home = require('../utils/home')

const homeDir = home()

const shell =
    os.platform() === 'win32'
        ? 'powershell.exe'
        : sh.which('zsh')
        ? 'zsh'
        : 'bash'
const ptyContainers: Record<string, IPty> = {}

module.exports = (socket: http.Server) => {
    socket.on('create', option => {
        const ptyProcess = pty.spawn(shell, [], {
            name: 'xterm-color',
            cols: option.cols || 80,
            rows: option.rows || 24,
            cwd: option.cwd || homeDir,
            env: process.env
        })
        ptyProcess.onData((data: string) =>
            socket.emit(option.name + '-output', data)
        )
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ptyContainers[name].destroy()
            delete ptyContainers[name]
        }
    })
}
export {}

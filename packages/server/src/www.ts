#!/usr/bin/env node

import { type AddressInfo } from 'net'
import { exec } from 'child_process'
import http from 'http'
import debug from 'debug'
import app from '#lib/app'
import createSocketServer from '#lib/socket/index'

const port = normalizePort(process.env.PORT || '3000') // Get port from environment and store in Express.
const debugHandle = debug('server:server')

app.set('port', port)

// Create HTTP server.
const server = http.createServer(app)
createSocketServer(server)

// Listen on provided port, on all network interfaces.
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string | number): boolean | number | string {
	const port = parseInt(String(val), 10)
	// named pipe
	if (isNaN(port)) return val
	// port number
	if (port >= 0) return port
	return false
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param error - 错误
 */
function onError(error: any): void {
	if (error.syscall !== 'listen') throw error
	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges')
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(bind + ' is already in use')
			process.exit(1)
			break
		default:
			throw error
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	const addr = server.address() as AddressInfo
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
	const url = 'http://127.0.0.1:' + addr.port
	console.info(`server started on ${url}`)
	// win系统使用 一下命令打开url在浏览器
	if (process.platform === 'win32') exec(`start ${url}`)
	// mac系统使用 一下命令打开url在浏览器
	else if (process.platform === 'darwin') exec(`open ${url}`)
	else exec(`open ${url}`)
	debugHandle('Listening on ' + bind)
}

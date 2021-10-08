const SocketIoServer = require('socket.io')
import type { Socket, ServerOptions } from 'socket.io'
import http from 'http'

interface EventsMap {
	[event: string]: any
}
interface ListenEvents extends EventsMap {
	[event: string]: (...args: any[]) => void
}
interface EmitEvents extends EventsMap {}
interface ServerSideEvents extends EventsMap {
	[event: string]: (...args: any[]) => void
}

// interface SocketFn {
// 	fn?: (socket: Socket<ListenEvents, EmitEvents, ServerSideEvents>) => void
// }

class SocketServer {
	io: any
	constructor(server: http.Server, options: Partial<ServerOptions>) {
		this.io = SocketIoServer(server, options)
	}

	use(name: string, fn: (socket: Socket<ListenEvents, EmitEvents, ServerSideEvents>) => void) {
		if (!name) return false
		if (typeof name === 'string') {
			if (!fn) return false
			if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')

			this.io.of(name).on('connection', fn)
		} else if (typeof name === 'function') {
			this.io.on('connection', fn)
		}
	}
}

module.exports = SocketServer

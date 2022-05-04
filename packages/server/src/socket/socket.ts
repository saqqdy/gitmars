import type http from 'http'
import type { ServerOptions, Socket } from 'socket.io'
const SocketIoServer = require('socket.io')

type EventsMap = Record<string, any>
interface ListenEvents
    extends Record<string, (...args: any[]) => void>,
        EventsMap {}

type EmitEvents = EventsMap

interface ServerSideEvents
    extends Record<string, (...args: any[]) => void>,
        EventsMap {}

// interface SocketFn {
// 	fn?: (socket: Socket<ListenEvents, EmitEvents, ServerSideEvents>) => void
// }

class SocketServer {
    io: any
    constructor(server: http.Server, options: Partial<ServerOptions>) {
        this.io = SocketIoServer(server, options)
    }

    use(
        name: string,
        fn: (socket: Socket<ListenEvents, EmitEvents, ServerSideEvents>) => void
    ) {
        if (!name) return false
        if (typeof name === 'string') {
            if (!fn) return false
            if (typeof fn !== 'function') {
                throw new TypeError('middleware must be a function!')
            }

            this.io.of(name).on('connection', fn)
        } else if (typeof name === 'function') {
            this.io.on('connection', fn)
        }
    }
}

export default SocketServer

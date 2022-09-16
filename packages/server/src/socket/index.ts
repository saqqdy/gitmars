import type http from 'http'
import SocketServer from '#lib/socket/socket'
import terminal from '#lib/socket/terminal'
import gitmars from '#lib/socket/gitmars'

export default (server: http.Server) => {
    const socketServer = new SocketServer(server, {
        pingTimeout: 1000 * 60 * 60 * 24,
        cors: {
            origin: ['http://127.0.0.1:8888', 'http://localhost:8888'],
            methods: ['GET', 'POST']
        }
    })

    socketServer.use('terminal', terminal)
    socketServer.use('gitmars', gitmars)
}

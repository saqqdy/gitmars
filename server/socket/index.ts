import http from 'http'
const SocketServer = require('./socket')
const terminal = require('./terminal')
const gitmars = require('./gitmars')

module.exports = (server: http.Server) => {
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
export {}

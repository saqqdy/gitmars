"use strict";
const SocketIoServer = require('socket.io');
class SocketServer {
    constructor(server, options) {
        this.io = SocketIoServer(server, options);
    }
    use(name, fn) {
        if (!name)
            return false;
        if (typeof name === 'string') {
            if (!fn)
                return false;
            if (typeof fn !== 'function')
                throw new TypeError('middleware must be a function!');
            this.io.of(name).on('connection', fn);
        }
        else if (typeof name === 'function') {
            this.io.on('connection', fn);
        }
    }
}
module.exports = SocketServer;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SocketServer = require('./socket');
const terminal = require('./terminal');
const gitmars = require('./gitmars');
module.exports = (server) => {
    const socketServer = new SocketServer(server, {
        pingTimeout: 1000 * 60 * 60 * 24,
        cors: {
            origin: ['http://127.0.0.1:8080', 'http://localhost:8080']
            // methods: ["GET", "POST"]
        }
    });
    socketServer.use('terminal', terminal);
    socketServer.use('gitmars', gitmars);
};

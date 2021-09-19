#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Module dependencies.
const app = require('../app');
const debug = require('debug')('server:server');
const http = require('http');
const port = normalizePort(process.env.PORT || '3000'); // Get port from environment and store in Express.
const createSocketServer = require('../socket/index');
app.set('port', port);
// Create HTTP server.
const server = http.createServer(app);
createSocketServer(server);
// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(String(val), 10);
    // named pipe
    if (isNaN(port))
        return val;
    // port number
    if (port >= 0)
        return port;
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 *
 * @param error - 错误
 */
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    let addr = server.address(), bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    console.info('server started on http://127.0.0.1:3000');
    debug('Listening on ' + bind);
}

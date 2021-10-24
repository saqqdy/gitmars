const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process')
const path = require('path')

let win
// const node = spawn(
//     // './node_modules/node/bin/node',
//     // process.execPath,
//     'node',
//     [path.join(__dirname, `./app/bin/www.js`)],
//     {
//         cwd: process.cwd()
//     }
// )
const express = require('./app/bin/www.js')
// express()
// Stream = require('node-rtsp-stream')
function createWindow() {
    win = new BrowserWindow({
        // autoHideMenuBar: true,
        width: 1600,
        height: 960,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
            // preload: path.join(app.getAppPath(), 'preload.js'),
        }
    })
    // win.loadURL(`file://${__dirname}/server.html`);
    win.loadURL('http://127.0.0.1:3000')
    win.webContents.openDevTools()
    win.on('close', () => {
        win.webContents.send('stop-server')
        // node.kill('SIGINT')
    })
    win.on('closed', () => {
        win = null
    })
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.whenReady().then(createWindow)

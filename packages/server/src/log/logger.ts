const path = require('path')
const log4js = require('log4js')
const config = require('../config')

log4js.configure({
    appenders: {
        system: { type: 'stdout' },
        file: {
            type: 'dateFile',
            filename: path.join(config.path.log, '/data/system.log'),
            pattern: '.yyyy-MM-dd',
            // keepFileExt: true,
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {
            appenders: ['system'],
            level: 'all'
        },
        website: {
            appenders: ['system', 'file'],
            level: 'debug'
        },
        system: {
            appenders: ['system', 'file'],
            level: 'debug'
        },
        mongo: {
            appenders: ['system', 'file'],
            level: 'debug'
        },
        redis: {
            appenders: ['system', 'file'],
            level: 'debug'
        }
    }
    // pm2: true
})

module.exports = log4js
export {}

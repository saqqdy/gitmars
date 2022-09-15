import path from 'path'
import log4js from 'log4js'
import config from '#lib/config'

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

export default log4js

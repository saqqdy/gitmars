import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'install',
        short: 'i',
        args: [
            {
                required: true,
                name: 'pluginName',
                variadic: false,
                description: i18n.__('Plugin Name')
            },
            {
                required: false,
                name: 'version',
                variadic: false,
                validator: (val, opts, cb) => {
                    if (/\s+/.test(val)) {
                        cb(new Error(i18n.__('Please do not enter spaces')))
                        return
                    }
                    cb()
                },
                // transformer: null,
                description: i18n.__('Version number')
            }
        ],
        options: [
            {
                flags: '-m, --mirror',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-m',
                long: '--mirror',
                negate: false,
                description: i18n.__('Whether to use Taobao Mirror'),
                defaultValue: false
            },
            {
                flags: '-c, --client [client]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-c',
                long: '--client',
                negate: false,
                description: i18n.__(
                    'The name of the client used to load the package'
                ),
                defaultValue: 'npm',
                recommend: true,
                value: 'npm'
            },
            {
                flags: '-r, --registry <registry>',
                required: true,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-r',
                long: '--registry',
                negate: false,
                description: i18n.__('Use mirror address'),
                defaultValue: '',
                recommend: true,
                value: 'https://registry.npmmirror.com'
            }
        ],
        // validator opts
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // validator args
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // transform opts
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // transform args
        transformArgs: (val, opts, cb) => {
            cb()
        }
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.install = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

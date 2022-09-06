import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'ui',
        short: null,
        args: [],
        options: [
            {
                flags: '-p, --port [port]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-p',
                long: '--port',
                negate: false,
                description: i18n.__('Specify the port number'),
                defaultValue: 3000,
                recommend: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.ui = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

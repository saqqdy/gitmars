import type { GitmarsOptionType } from '../../typings'
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
                description: '指定端口号',
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
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'continue',
        short: 'ct',
        args: [],
        options: [
            {
                flags: '-l, --list',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-l',
                long: '--list',
                negate: false,
                description: '显示指令队列',
                defaultValue: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.continue = cmdConfig
    }
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

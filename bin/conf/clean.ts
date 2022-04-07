import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'clean',
        short: null,
        args: [],
        options: [
            {
                flags: '-f, --force',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-f',
                long: '--force',
                negate: false,
                description: '强制清理',
                defaultValue: false
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // 校验参数
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // 清洗传值
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // 清洗参数
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
        root.gitmarsCmdConfig.clean = cmdConfig
    }
    // @ts-ignore
})(typeof window !== 'undefined' ? window : global)

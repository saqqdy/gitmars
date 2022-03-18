import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'alias',
        short: null,
        args: [
            {
                required: true,
                name: 'action',
                variadic: false,
                description: '执行方法'
            }
        ],
        options: [],
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
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['alias'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

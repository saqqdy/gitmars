import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'copy',
        short: 'cp',
        args: [
            {
                required: false,
                name: 'commitid',
                variadic: true,
                validator: (val, opts, cb) => {
                    cb()
                },
                // transformer: null,
                description: '提交记录ID'
            }
        ],
        options: [
            {
                flags: '-s, --source [source]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-s',
                long: '--source',
                negate: false,
                description: '拷贝记录的来源分支',
                defaultValue: ''
            },
            {
                flags: '-k, --key [keyword]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--key',
                negate: false,
                description: '模糊搜索commit信息关键词',
                defaultValue: ''
            },
            {
                flags: '-a, --author [author]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-a',
                long: '--author',
                negate: false,
                description: '提交者',
                defaultValue: ''
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
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['copy'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

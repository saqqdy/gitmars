import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'cleanbranch',
        short: 'clb',
        args: [],
        options: [
            {
                flags: '-t, --type [type]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-t',
                long: '--type',
                negate: false,
                description:
                    '分支的类型，共有3种：feature、bugfix、support，不传则默认全部',
                defaultValue: null,
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                flags: '--except [exception]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--except',
                negate: false,
                description: '排除关键词',
                defaultValue: '',
                value: ''
            },
            // {
            //     flags: '--deadline [deadline]',
            //     required: false,
            //     optional: false,
            //     variadic: false,
            //     mandatory: false,
            //     short: '',
            //     long: '--deadline',
            //     negate: false,
            //     description:
            //         '删除固定时长之前的分支，填写格式：10s/2m/2h/3d/4M/5y',
            //     defaultValue: '15d'
            // },
            {
                flags: '-r, --remote',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-r',
                long: '--remote',
                negate: false,
                description: '是否清理远程分支，默认清理本地分支',
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
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['cleanbranch'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

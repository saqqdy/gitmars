import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'branch',
        short: 'bh',
        args: [],
        options: [
            {
                flags: '-k, --key [keyword]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--key',
                negate: false,
                description: '查询分支的关键词',
                defaultValue: null
            },
            {
                flags: '-r, --remote',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-r',
                long: '--remote',
                negate: false,
                description:
                    '是否查询远程分支（deletes模式下改用于删除远程分支）默认只查询本地',
                defaultValue: false
            },
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
                    '查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部',
                defaultValue: null,
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                flags: '-d, --delete [branch]',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-d',
                long: '--delete',
                negate: false,
                description: '删除分支',
                defaultValue: null
            },
            {
                flags: '-D, --forcedelete [branch]',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-D',
                long: '--forcedelete',
                negate: false,
                description: '强行删除分支',
                defaultValue: null
            },
            {
                flags: '-u, --upstream [upstream]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-u',
                long: '--upstream',
                negate: false,
                description: '设置与远程分支关联'
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            if (
                val.includes('--upstream') &&
                (val.includes('--key') ||
                    val.includes('--remote') ||
                    val.includes('--type') ||
                    val.includes('--delete') ||
                    val.includes('--forcedelete'))
            ) {
                cb(
                    new Error(
                        '使用绑定/取消绑定远程分支功能时，不能与其他功能混用'
                    )
                )
                return
            }
            if (
                (val.includes('--delete') || val.includes('--forcedelete')) &&
                (val.includes('--key') || val.includes('--type'))
            ) {
                cb(new Error('使用删除分支功能时，不能与查询分支功能混用'))
                return
            }
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
        root.gitmarsCmdConfig['branch'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

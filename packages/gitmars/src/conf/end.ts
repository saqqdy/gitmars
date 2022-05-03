import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'end',
        short: 'ed',
        args: [
            {
                required: false,
                name: 'type',
                variadic: false,
                description: '分支类型',
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                required: false,
                name: 'name',
                variadic: false,
                description: '分支名称(不带feature/bugfix前缀)'
            }
        ],
        options: [
            {
                flags: '--no-combine',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--no-combine',
                negate: true,
                description: '不合并主干分支（请确保分支已经上线）',
                defaultValue: true,
                recommend: false
            },
            {
                flags: '--as-feature',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--as-feature',
                negate: false,
                description: 'bug分支合并到release',
                recommend: false
            },
            {
                flags: '--description [description]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                long: '--description',
                negate: false,
                description: '本次提交的原因描述',
                defaultValue: '',
                recommend: false
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
        root.gitmarsCmdConfig.end = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

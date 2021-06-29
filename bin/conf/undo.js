;(function (root) {
    const cmdConfig = {
        command: 'undo',
        short: 'ud',
        args: [
            {
                required: false,
                name: 'commitid',
                variadic: true,
                validator: (val, opts, cb) => {
                    cb()
                },
                transformer: null,
                description: '需要撤销的ID'
            }
        ],
        options: [
            {
                flags: '-b, --branch [branch]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-b',
                long: '--branch',
                negate: false,
                description: '需要撤销的分支名',
                defaultValue: ''
            },
            {
                flags: '-m, --mode [mode]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-m',
                long: '--mode',
                negate: false,
                description: '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码',
                defaultValue: 1
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
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)

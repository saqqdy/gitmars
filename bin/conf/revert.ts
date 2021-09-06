import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
    command: 'revert',
    short: 'rt',
    args: [
        {
            required: false,
            name: 'commitid',
            variadic: false,
            validator: (val, opts, cb) => {
                cb()
            },
            // transformer: null,
            description: '需要撤销的ID'
        }
    ],
    options: [
        {
            flags: '-n, --number [number]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-n',
            long: '--number',
            negate: false,
            description: '撤销最后一次提交（或者撤销倒数第n次提交）',
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

export default cmdConfig

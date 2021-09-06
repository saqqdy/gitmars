import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'get',
    short: 'gt',
    args: [
        {
            required: false,
            name: 'message',
            variadic: false,
            validator: (val, opts, cb) => {
                if (/\s+/.test(val)) {
                    cb(new Error('请不要输入空格'))
                    return
                }
                cb()
            },
            // transformer: null,
            description: '存取关键字'
        },
        {
            required: false,
            name: 'index',
            variadic: false,
            // validator: null,
            // transformer: null,
            description: '序号'
        }
    ],
    options: [
        {
            flags: '-k, --keep [keep]',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-k',
            long: '--keep',
            negate: false,
            description: '保留暂存区不删除',
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

export { cmdConfig, cmdConfig as default }

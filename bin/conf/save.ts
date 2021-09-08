import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
    command: 'save',
    short: 'sv',
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
        }
    ],
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
            description: '没有版本的文件也暂存，这会执行git add .',
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

module.exports = cmdConfig

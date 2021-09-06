import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'postmsg',
    short: null,
    args: [
        {
            required: true,
            name: 'message',
            variadic: false
        }
    ],
    options: [
        {
            flags: '-u, --url [url]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-u',
            long: '--url',
            negate: false,
            description: '推送消息的api地址',
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

export { cmdConfig, cmdConfig as default }

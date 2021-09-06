import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
    command: 'copy',
    short: 'cp',
    args: [
        {
            required: true,
            name: 'from',
            variadic: false,
            validator: (val, opts, cb) => {
                if (/\s+/.test(val)) {
                    cb(new Error('请不要输入空格'))
                    return
                }
                cb()
            },
            // transformer: null,
            description: '来源分支'
        },
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

export const args = cmdConfig.args
export const options = cmdConfig.options
export default cmdConfig

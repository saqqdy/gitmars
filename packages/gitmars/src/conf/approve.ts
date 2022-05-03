import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'approve',
        short: 'ap',
        args: [],
        options: [
            {
                flags: '--state [state]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--state',
                negate: false,
                description:
                    '筛选合并请求状态，共有2种：opened、closed，不传则默认全部',
                defaultValue: 'opened',
                options: ['opened', 'closed', 'merged', 'all'],
                value: 'opened'
            },
            {
                flags: '--quiet',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--quiet',
                negate: false,
                description: '不要推送消息',
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
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.approve = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

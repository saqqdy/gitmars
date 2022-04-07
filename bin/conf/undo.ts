import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
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
                // transformer: null,
                description: '需要撤销的ID'
            }
        ],
        options: [
            {
                flags: '--lastet [lastet]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--lastet',
                negate: false,
                description:
                    '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y',
                defaultValue: '7d'
            },
            {
                flags: '--no-merges',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--no-merges',
                negate: true,
                description: '是否排除merge记录',
                defaultValue: true,
                recommend: false
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
                description:
                    '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码',
                defaultValue: null,
                options: [1, 2],
                value: null
            },
            {
                flags: '--limit [limit]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--limit',
                negate: false,
                description: '最多查询的日志条数',
                defaultValue: 20
            },
            {
                flags: '--calc',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--calc',
                negate: false,
                description: '清理当前分支撤销失败的记录',
                recommend: false
            },
            {
                flags: '--calcAll',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--calcAll',
                negate: false,
                description: '清理所有分支撤销失败的记录',
                recommend: false
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            if (
                (val.includes('--calc') || val.includes('--calcAll')) &&
                val.length > 1
            ) {
                cb(new Error('--calc和--calcAll只能单独使用'))
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
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.undo = cmdConfig
    }
    // @ts-ignore
})(typeof window !== 'undefined' ? window : global)

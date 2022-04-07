import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'log',
        short: 'lg',
        args: [
            {
                required: false,
                name: 'branch',
                variadic: false
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
                flags: '--json',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--json',
                negate: false,
                description: '是否以json格式输出日志，默认表格方式',
                defaultValue: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.log = cmdConfig
    }
    // @ts-ignore
})(typeof window !== 'undefined' ? window : global)

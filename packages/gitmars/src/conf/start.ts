import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'start',
        short: 'st',
        args: [
            {
                required: true,
                name: 'type',
                variadic: false,
                description: '分支类型',
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                required: true,
                name: 'name',
                variadic: false,
                description: '分支名称(不带feature/bugfix前缀)'
            }
        ],
        options: [
            {
                flags: '-t, --tag <tag>',
                required: true,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-t',
                long: '--tag',
                negate: false,
                description: '从tag创建分支',
                defaultValue: '',
                recommend: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.start = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

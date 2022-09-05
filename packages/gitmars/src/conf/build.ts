import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'build',
        short: 'bd',
        args: [
            {
                required: true,
                name: 'project',
                variadic: false,
                description: '项目名称'
            }
        ],
        options: [
            {
                flags: '-e, --env [env]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-e',
                long: '--env',
                negate: false,
                description: '构建环境，可选dev、prod、bug、all',
                defaultValue: 'dev',
                recommend: true,
                options: ['dev', 'prod', 'bug', 'all'],
                value: 'dev'
            },
            {
                flags: '-a, --app [app]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-a',
                long: '--app',
                negate: false,
                description: '构建应用',
                defaultValue: 'all',
                recommend: true,
                value: 'all'
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.build = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'start',
        short: 'st',
        args: [
            {
                required: true,
                name: 'type',
                variadic: false,
                description: i18n.__('Branch Type'),
                options: ['feature', 'bugfix', 'support'],
                value: ''
            },
            {
                required: true,
                name: 'name',
                variadic: false,
                description: i18n.__(
                    'Branch name (without feature/bugfix prefix)'
                )
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
                description: i18n.__('Create branch from tag'),
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

import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'review',
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
                description: i18n.__(
                    'Filter merge request status, there are 2 types: opened, closed, not passed then default all'
                ),
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
                description: i18n.__('Do not push the message'),
                defaultValue: false
            }
        ],
        // validator opts
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // validator args
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // transform opts
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // transform args
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
        root.gitmarsCmdConfig.review = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

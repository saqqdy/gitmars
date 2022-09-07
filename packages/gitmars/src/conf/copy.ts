import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'copy',
        short: 'cp',
        args: [
            {
                required: false,
                name: 'commitid',
                variadic: true,
                validator: (val, opts, cb) => {
                    cb()
                },
                // transformer: null,
                description: i18n.__('Commit record ID')
            }
        ],
        options: [
            {
                flags: '-s, --source [source]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-s',
                long: '--source',
                negate: false,
                description: i18n.__('Copy the source branch of the record'),
                defaultValue: ''
            },
            {
                flags: '-k, --key [keyword]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--key',
                negate: false,
                description: i18n.__(
                    'Fuzzy search for commit message keywords'
                ),
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
                description: i18n.__('Submitter'),
                defaultValue: ''
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
        root.gitmarsCmdConfig.copy = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

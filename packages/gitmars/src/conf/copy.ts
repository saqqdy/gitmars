import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

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
            description: i18n.__('Fuzzy search for commit message keywords'),
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

export default cmdConfig

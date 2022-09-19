import type { GitmarsOptionType } from '../../typings'
// import i18n from '#lib/locales/index'
const i18n = { __: (txt: string) => txt }

export const cmdConfig: GitmarsOptionType = {
    command: 'cleanbranch',
    short: 'clb',
    args: [
        {
            required: false,
            name: 'branches',
            variadic: true,
            validator: (val, opts, cb) => {
                cb()
            },
            description: i18n.__('Specify the branch to clean up')
        }
    ],
    options: [
        {
            flags: '-l, --list',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-l',
            long: '--list',
            negate: false,
            description: i18n.__(
                'Show a list of branches that match the criteria'
            ),
            defaultValue: false,
            value: true
        },
        {
            flags: '-t, --type [type]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-t',
            long: '--type',
            negate: false,
            description: i18n.__(
                'The type of branch, there are 3 types: feature, bugfix, support, default all if not passed'
            ),
            defaultValue: null,
            options: ['feature', 'bugfix', 'support'],
            value: ''
        },
        {
            flags: '--target [target]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--target',
            negate: false,
            description: i18n.__(
                'The name of the target branch that needs to be tested for merging, default is develop and release if not passed'
            ),
            defaultValue: null,
            value: 'dev,release'
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
            description: i18n.__('Query branch for keywords'),
            defaultValue: null
        },
        {
            flags: '--exclude [exclude]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--exclude',
            negate: false,
            description: i18n.__('Exclude keywords'),
            defaultValue: '',
            value: ''
        },
        {
            flags: '--include [include]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--include',
            negate: false,
            description: i18n.__('Include keywords'),
            defaultValue: '',
            value: ''
        },
        // {
        //     flags: '--deadline [deadline]',
        //     required: false,
        //     optional: false,
        //     variadic: false,
        //     mandatory: false,
        //     short: '',
        //     long: '--deadline',
        //     negate: false,
        //     description:
        //         i18n.__('Delete branch before fixed duration, fill in format: 10s/2m/2h/3d/4M/5y'),
        //     defaultValue: '15d'
        // },
        {
            flags: '-r, --remote',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-r',
            long: '--remote',
            negate: false,
            description: i18n.__(
                'Whether to clean up remote branches, default is clean up local branches'
            ),
            defaultValue: false
        },
        {
            flags: '-c, --confirm',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-c',
            long: '--confirm',
            negate: false,
            description: i18n.__(
                'Confirm start, do not show confirmation box when true'
            ),
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

export { cmdConfig as default }

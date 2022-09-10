import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

const cmdConfig: GitmarsOptionType = {
    command: 'combine',
    short: 'cb',
    args: [
        {
            required: false,
            name: 'type',
            variadic: false,
            description: i18n.__('Branch Type'),
            options: ['feature', 'bugfix', 'support'],
            value: ''
        },
        {
            required: false,
            name: 'name',
            variadic: false,
            description: i18n.__('Branch name (without feature/bugfix prefix)')
        }
    ],
    options: [
        {
            flags: '-d, --dev',
            required: false, // 必填<>
            optional: false, // 不必填[]
            variadic: false, // 有...
            mandatory: false,
            short: '-d',
            long: '--dev',
            negate: false,
            description: i18n.__('Sync to dev environment'),
            defaultValue: false,
            value: true,
            recommend: true // 自定义值：是否默认选中
        },
        {
            flags: '-p, --prod',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-p',
            long: '--prod',
            negate: false,
            description: i18n.__('Sync to prod environment'),
            defaultValue: false,
            value: false,
            recommend: false
        },
        {
            flags: '-b, --build [build]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-b',
            long: '--build',
            negate: false,
            description: i18n.__('Build application'),
            value: 'all',
            recommend: true
        },
        {
            flags: '-m, --commit <commit>',
            required: true,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-m',
            long: '--commit',
            negate: false,
            description: i18n.__('Execute commit, information required'),
            defaultValue: '',
            recommend: false
        },
        {
            flags: '--description [description]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            long: '--description',
            negate: false,
            description: i18n.__('Description of the reason for this commit'),
            defaultValue: '',
            recommend: false
        },
        {
            flags: '-a, --add',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-a',
            long: '--add',
            negate: false,
            description: i18n.__('Execute add'),
            defaultValue: false,
            recommend: false
        },
        {
            flags: '--no-bugfix',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--no-bugfix',
            negate: true,
            description: i18n.__(
                'bug branch merge to release without merging to bug branch'
            ),
            defaultValue: true,
            recommend: false
        },
        {
            flags: '--as-feature',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--as-feature',
            negate: false,
            description: i18n.__('bug branch merge to release'),
            recommend: false
        },
        {
            flags: '-f, --force',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-f',
            long: '--force',
            negate: false,
            description: i18n.__('Whether to force a merge request'),
            recommend: false
        }
    ],
    // validator opts
    validatorOpts: (val, opts, cb) => {
        if (!val.includes('--dev') && !val.includes('--prod')) {
            cb(new Error(i18n.__('Merge dev or prod must choose at least one')))
            return
        }
        if (
            (val.includes('--add') && !val.includes('--commit')) ||
            (!val.includes('--add') && val.includes('--commit'))
        ) {
            cb(
                new Error(
                    i18n.__(
                        'add and commit need to be selected at the same time'
                    )
                )
            )
            return
        }
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

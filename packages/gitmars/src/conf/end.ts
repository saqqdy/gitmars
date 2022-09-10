import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

export const cmdConfig: GitmarsOptionType = {
    command: 'end',
    short: 'ed',
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
            flags: '--no-combine',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--no-combine',
            negate: true,
            description: i18n.__(
                'Do not merge trunk branches (make sure the branch is live)'
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

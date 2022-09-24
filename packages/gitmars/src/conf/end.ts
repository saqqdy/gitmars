import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
    command: 'end',
    short: 'ed',
    args: [
        {
            required: false,
            name: 'type',
            variadic: false,
            description: t('Branch Type'),
            options: ['feature', 'bugfix', 'support'],
            value: ''
        },
        {
            required: false,
            name: 'name',
            variadic: false,
            description: t('Branch name (without feature/bugfix prefix)')
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
            description: t(
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
            description: t('bug branch merge to release'),
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
            description: t('Description of the reason for this commit'),
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

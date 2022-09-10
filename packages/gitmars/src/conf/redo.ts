import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

const cmdConfig: GitmarsOptionType = {
    command: 'redo',
    short: 'rd',
    args: [
        {
            required: false,
            name: 'commitid',
            variadic: true,
            validator: (val, opts, cb) => {
                cb()
            },
            // transformer: null,
            description: i18n.__('The undo log to be restored')
        }
    ],
    options: [
        {
            flags: '-m, --mode [mode]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-m',
            long: '--mode',
            negate: false,
            description: i18n.__(
                'For undoing a merge record, the type to be passed in: 1 = keep current branch code, 2 = keep incoming code'
            ),
            defaultValue: null,
            options: [1, 2],
            value: null
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

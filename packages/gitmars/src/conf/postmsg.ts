import type { GitmarsOptionType } from '../../typings'
// import i18n from '#lib/locales/index'
const i18n = { __: (txt: string) => txt }

export const cmdConfig: GitmarsOptionType = {
    command: 'postmsg',
    short: null,
    args: [
        {
            required: true,
            name: 'message',
            variadic: false
        }
    ],
    options: [
        {
            flags: '-u, --url [url]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-u',
            long: '--url',
            negate: false,
            description: i18n.__('The api address of the push message'),
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

export { cmdConfig as default }

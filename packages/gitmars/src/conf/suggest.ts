import type { GitmarsOptionType } from '../../typings'
// // import i18n from '#lib/locales/index'
const i18n = { __: (txt: string) => txt }

export const cmdConfig: GitmarsOptionType = {
    command: 'suggest',
    short: 'sg',
    args: [],
    options: [],
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

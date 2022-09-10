import type { GitmarsOptionType } from '../../typings'
// import i18n from '#lib/locales/index'

export const cmdConfig: GitmarsOptionType = {
    command: 'status',
    short: '',
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

import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
    command: 'install',
    short: 'i',
    args: [
        {
            required: true,
            name: 'pluginName',
            variadic: false,
            description: t('Plugin Name')
        },
        {
            required: false,
            name: 'version',
            variadic: false,
            validator: (val, opts, cb) => {
                if (/\s+/.test(val)) {
                    cb(new Error(t('Please do not enter spaces')))
                    return
                }
                cb()
            },
            // transformer: null,
            description: t('Version number')
        }
    ],
    options: [
        {
            flags: '-m, --mirror',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-m',
            long: '--mirror',
            negate: false,
            description: t('Whether to use Taobao Mirror'),
            defaultValue: false
        },
        {
            flags: '-c, --client [client]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-c',
            long: '--client',
            negate: false,
            description: t('The name of the client used to load the package'),
            defaultValue: 'npm',
            recommend: true,
            value: 'npm'
        },
        {
            flags: '-r, --registry <registry>',
            required: true,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-r',
            long: '--registry',
            negate: false,
            description: t('Use mirror address'),
            defaultValue: '',
            recommend: true,
            value: 'https://registry.npmmirror.com'
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

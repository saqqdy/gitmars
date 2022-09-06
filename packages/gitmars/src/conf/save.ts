import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'save',
        short: 'sv',
        args: [
            {
                required: false,
                name: 'message',
                variadic: false,
                validator: (val, opts, cb) => {
                    if (/\s+/.test(val)) {
                        cb(new Error(i18n.__('Please do not enter spaces')))
                        return
                    }
                    cb()
                },
                // transformer: null,
                description: i18n.__('AccessKeyword')
            }
        ],
        options: [
            {
                flags: '-f, --force',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-f',
                long: '--force',
                negate: false,
                description: i18n.__(
                    'No version of the file is also staged, which will perform a git add .'
                ),
                defaultValue: false
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // validator args
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // 清洗传值
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // transform args
        transformArgs: (val, opts, cb) => {
            cb()
        }
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.save = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

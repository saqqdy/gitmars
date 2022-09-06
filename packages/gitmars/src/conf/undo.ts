import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'undo',
        short: 'ud',
        args: [
            {
                required: false,
                name: 'commitid',
                variadic: true,
                validator: (val, opts, cb) => {
                    cb()
                },
                // transformer: null,
                description: i18n.__('ID of the undo needed')
            }
        ],
        options: [
            {
                flags: '--lastet [lastet]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--lastet',
                negate: false,
                description: i18n.__(
                    'Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'
                ),
                defaultValue: '7d'
            },
            {
                flags: '--no-merges',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--no-merges',
                negate: true,
                description: i18n.__('Whether to exclude merge records'),
                defaultValue: true,
                recommend: false
            },
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
            },
            {
                flags: '--limit [limit]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '',
                long: '--limit',
                negate: false,
                description: i18n.__(
                    'The maximum number of logs to be queried'
                ),
                defaultValue: 20
            },
            {
                flags: '--calc',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--calc',
                negate: false,
                description: i18n.__(
                    'Clean up the current branch undo failure log'
                ),
                recommend: false
            },
            {
                flags: '--calcAll',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--calcAll',
                negate: false,
                description: i18n.__('Clean up all branch undo failures'),
                recommend: false
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            if (
                (val.includes('--calc') || val.includes('--calcAll')) &&
                val.length > 1
            ) {
                cb(
                    new Error(
                        i18n.__(
                            '--calc and --calcAll can only be used individually'
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
        root.gitmarsCmdConfig.undo = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

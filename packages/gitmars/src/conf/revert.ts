import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'revert',
        short: 'rt',
        args: [
            {
                required: false,
                name: 'commitid',
                variadic: false,
                validator: (val, opts, cb) => {
                    cb()
                },
                // transformer: null,
                description: i18n.__('ID of the undo needed')
            }
        ],
        options: [
            {
                flags: '-n, --number [number]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-n',
                long: '--number',
                negate: false,
                description: i18n.__(
                    'Undo the last commit (or undo the penultimate nth commit)'
                ),
                defaultValue: ''
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
                defaultValue: '',
                options: ['1', '2'],
                value: '1'
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
        root.gitmarsCmdConfig.revert = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

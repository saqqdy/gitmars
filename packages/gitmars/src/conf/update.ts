import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'update',
        short: 'up',
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
                description: i18n.__(
                    'Branch name (without feature/bugfix prefix)'
                )
            }
        ],
        options: [
            {
                flags: '--use-merge',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--use-merge',
                negate: false,
                description: i18n.__('Use merge to update (default merge)'),
                defaultValue: true,
                value: true,
                recommend: true
            },
            {
                flags: '--use-rebase',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                long: '--use-rebase',
                negate: false,
                description: i18n.__('Update with rebase (default merge)'),
                defaultValue: false,
                recommend: true
            },
            {
                flags: '-a --all',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-a',
                long: '--all',
                negate: false,
                description: i18n.__(
                    'Update all local bugfix, feature, support branches'
                ),
                defaultValue: false,
                recommend: false
            },
            {
                flags: '-f, --force',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-f',
                long: '--force',
                negate: false,
                description: i18n.__('Whether to force a merge request'),
                recommend: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.update = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

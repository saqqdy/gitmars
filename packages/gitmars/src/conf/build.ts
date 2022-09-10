import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

const cmdConfig: GitmarsOptionType = {
    command: 'build',
    short: 'bd',
    args: [
        {
            required: true,
            name: 'project',
            variadic: false,
            description: i18n.__('Project name')
        }
    ],
    options: [
        {
            flags: '-e, --env [env]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-e',
            long: '--env',
            negate: false,
            description: i18n.__(
                'Build environment, optionally dev, prod, bug, all'
            ),
            defaultValue: 'dev',
            recommend: true,
            options: ['dev', 'prod', 'bug', 'all'],
            value: 'dev'
        },
        {
            flags: '-a, --app [app]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-a',
            long: '--app',
            negate: false,
            description: i18n.__('Build application'),
            defaultValue: 'all',
            recommend: true,
            value: 'all'
        }
    ]
}

export default cmdConfig

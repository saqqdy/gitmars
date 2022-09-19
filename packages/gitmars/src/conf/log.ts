import type { GitmarsOptionType } from '../../typings'
// import i18n from '#lib/locales/index'
const i18n = { __: (txt: string) => txt }

export const cmdConfig: GitmarsOptionType = {
    command: 'log',
    short: 'lg',
    args: [
        {
            required: false,
            name: 'branch',
            variadic: false
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
            flags: '--limit [limit]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--limit',
            negate: false,
            description: i18n.__('The maximum number of logs to be queried'),
            defaultValue: 20
        },
        {
            flags: '--json',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--json',
            negate: false,
            description: i18n.__(
                'Whether to output logs in json format, default form'
            ),
            defaultValue: false
        }
    ]
}

export { cmdConfig as default }

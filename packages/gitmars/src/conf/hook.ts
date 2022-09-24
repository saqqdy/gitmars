import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
    command: 'hook',
    short: 'hk',
    args: [
        {
            required: false,
            name: 'command',
            variadic: false
        },
        {
            required: false,
            name: 'args',
            variadic: true
        }
    ],
    options: [
        {
            flags: '--no-verify',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--no-verify',
            negate: true,
            description: t('Do you want to skip the check permission'),
            defaultValue: false
        },
        {
            flags: '--lastet [lastet]',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--lastet',
            negate: false,
            description: t(
                'Query logs after a certain time, fill in the format: 10s/2m/2h/3d/4M/5y'
            ),
            defaultValue: '7d'
        },
        {
            flags: '--limit [limit]',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--limit',
            negate: false,
            description: t('The maximum number of logs to be queried'),
            defaultValue: 20
        },
        {
            flags: '-t, --type <type>',
            required: true,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-t',
            long: '--type',
            negate: false,
            description: t('Detection type'),
            defaultValue: ''
        },
        {
            flags: '--branch [branch]',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '',
            long: '--branch',
            negate: false,
            description: t('Branch to query'),
            defaultValue: ''
        }
    ]
}

export { cmdConfig as default }

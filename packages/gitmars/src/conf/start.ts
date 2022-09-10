import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

const cmdConfig: GitmarsOptionType = {
    command: 'start',
    short: 'st',
    args: [
        {
            required: true,
            name: 'type',
            variadic: false,
            description: i18n.__('Branch Type'),
            options: ['feature', 'bugfix', 'support'],
            value: ''
        },
        {
            required: true,
            name: 'name',
            variadic: false,
            description: i18n.__('Branch name (without feature/bugfix prefix)')
        }
    ],
    options: [
        {
            flags: '-t, --tag <tag>',
            required: true,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-t',
            long: '--tag',
            negate: false,
            description: i18n.__('Create branch from tag'),
            defaultValue: '',
            recommend: false
        }
    ]
}

export default cmdConfig

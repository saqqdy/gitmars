import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

export const cmdConfig: GitmarsOptionType = {
    command: 'continue',
    short: 'ct',
    args: [],
    options: [
        {
            flags: '-l, --list',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-l',
            long: '--list',
            negate: false,
            description: i18n.__('Show command queue'),
            defaultValue: false
        }
    ]
}

export { cmdConfig as default }

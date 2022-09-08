import type { GitmarsOptionType } from '../../typings'
import i18n from '../locales'

const cmdConfig: GitmarsOptionType = {
    command: 'ui',
    short: null,
    args: [],
    options: [
        {
            flags: '-p, --port [port]',
            required: false,
            optional: true,
            variadic: false,
            mandatory: false,
            short: '-p',
            long: '--port',
            negate: false,
            description: i18n.__('Specify the port number'),
            defaultValue: 3000,
            recommend: false
        }
    ]
}

export default cmdConfig

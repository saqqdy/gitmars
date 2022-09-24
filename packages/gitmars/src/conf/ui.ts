import type { GitmarsOptionType } from '../../typings'
// import lang from '#lib/common/local'
const t = (txt: string) => txt

export const cmdConfig: GitmarsOptionType = {
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
            description: t('Specify the port number'),
            defaultValue: 3000,
            recommend: false
        }
    ]
}

export { cmdConfig as default }

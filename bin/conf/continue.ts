import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
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
            description: '显示指令队列',
            defaultValue: false
        }
    ]
}

export default cmdConfig

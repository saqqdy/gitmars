import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'run',
    short: '',
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
    options: []
}

export { cmdConfig, cmdConfig as default }

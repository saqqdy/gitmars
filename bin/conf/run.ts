import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
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

export const args = cmdConfig.args
export const options = cmdConfig.options
export default cmdConfig

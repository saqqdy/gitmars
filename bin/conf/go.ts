import type { GitmarsOptionType } from '../../typings'

const cmdConfig: GitmarsOptionType = {
    command: 'go',
    short: '',
    args: [],
    options: []
}

export const args = cmdConfig.args
export const options = cmdConfig.options
export default cmdConfig

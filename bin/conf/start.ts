import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'start',
    short: 'st',
    args: [
        { required: true, name: 'type', variadic: false, description: '分支类型' },
        { required: true, name: 'name', variadic: false, description: '分支名称(不带feature/bugfix前缀)' }
    ],
    options: []
}

export { cmdConfig, cmdConfig as default }

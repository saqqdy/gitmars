import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'update',
    short: 'up',
    args: [
        { required: false, name: 'type', variadic: false, description: '分支类型' },
        { required: false, name: 'name', variadic: false, description: '分支名称(不带feature/bugfix前缀)' }
    ],
    options: [
        {
            flags: '--use-merge',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--use-merge',
            negate: false,
            description: '使用merge方式更新(默认merge)',
            defaultValue: true,
            recommend: true
        },
        {
            flags: '--use-rebase',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            long: '--use-rebase',
            negate: false,
            description: '使用rebase方式更新(默认merge)',
            defaultValue: false,
            recommend: true
        },
        {
            flags: '-a --all',
            required: false,
            optional: false,
            variadic: false,
            mandatory: false,
            short: '-a',
            long: '--all',
            negate: false,
            description: '更新本地所有bugfix、feature、support分支',
            defaultValue: false,
            recommend: false
        }
    ]
}

export { cmdConfig, cmdConfig as default }

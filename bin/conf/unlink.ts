import type { GitmarsConfigType } from '../../typings'

const cmdConfig: GitmarsConfigType = {
    command: 'unlink',
    short: null,
    args: [
        {
            required: false,
            name: 'name',
            variadic: false,
            validator: (val, opts, cb) => {
                if (/\s+/.test(val)) {
                    cb(new Error('请不要输入空格'))
                    return
                }
                cb()
            },
            // transformer: null,
            description: '包的名称'
        }
    ],
    options: []
}

export { cmdConfig, cmdConfig as default }

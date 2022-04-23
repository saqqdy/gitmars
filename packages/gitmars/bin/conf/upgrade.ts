import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'upgrade',
        short: 'ug',
        args: [
            {
                required: false,
                name: 'version',
                variadic: false,
                validator: (val, opts, cb) => {
                    if (/\s+/.test(val)) {
                        cb(new Error('请不要输入空格'))
                        return
                    }
                    cb()
                },
                // transformer: null,
                description: '版本号'
            }
        ],
        options: [
            {
                flags: '-m, --mirror',
                required: false,
                optional: false,
                variadic: false,
                mandatory: false,
                short: '-m',
                long: '--mirror',
                negate: false,
                description: '是否使用淘宝镜像',
                defaultValue: false
            },
            {
                flags: '-c, --client [client]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-c',
                long: '--client',
                negate: false,
                description: '用于装包的客户端名称',
                defaultValue: 'npm',
                recommend: true,
                value: 'npm'
            },
            {
                flags: '-r, --registry <registry>',
                required: true,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-r',
                long: '--registry',
                negate: false,
                description: '使用镜像地址',
                defaultValue: '',
                recommend: true,
                value: 'https://registry.npmmirror.com'
            }
        ],
        // 校验传值
        validatorOpts: (val, opts, cb) => {
            cb()
        },
        // 校验参数
        validatorArgs: (val, opts, cb) => {
            cb()
        },
        // 清洗传值
        transformOpts: (val, opts, cb) => {
            cb()
        },
        // 清洗参数
        transformArgs: (val, opts, cb) => {
            cb()
        }
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.upgrade = cmdConfig
    }
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

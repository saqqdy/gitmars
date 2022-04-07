import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'link',
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
            // {
            //     required: true,
            //     name: 'path',
            //     variadic: false,
            //     validator: (val, opts, cb) => {
            //         if (/\s+/.test(val)) {
            //             cb(new Error('请不要输入空格'))
            //             return
            //         }
            //         cb()
            //     },
            //     transformer: null,
            //     description: '包的路径'
            // }
        ],
        options: []
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.link = cmdConfig
    }
    // @ts-ignore
})(typeof window !== 'undefined' ? window : global)

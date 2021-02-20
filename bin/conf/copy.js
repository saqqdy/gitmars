;(function (root) {
    const cmdConfig = {
        command: 'copy',
        short: 'cp',
        args: [
            { required: true, name: 'from', variadic: false },
            { required: false, name: 'commitid', variadic: true }
        ],
        options: [
            {
                flags: '-k, --key [keyword]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--key',
                negate: false,
                description: '模糊搜索commit信息关键词',
                defaultValue: ''
            },
            {
                flags: '-a, --author [author]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-a',
                long: '--author',
                negate: false,
                description: '提交者',
                defaultValue: ''
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)

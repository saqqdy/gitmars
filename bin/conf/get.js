;(function (root) {
    const cmdConfig = {
        command: 'get',
        short: 'gt',
        args: [
            { required: false, name: 'message', variadic: false },
            { required: false, name: 'index', variadic: false }
        ],
        options: [
            {
                flags: '-k, --keep [keep]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-k',
                long: '--keep',
                negate: false,
                description: '保留暂存区不删除',
                defaultValue: false
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)

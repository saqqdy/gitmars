;(function (root) {
    const cmdConfig = {
        command: 'build',
        short: 'bd',
        args: [
            {
                required: true,
                name: 'project',
                variadic: false,
                description: '项目名称'
            }
        ],
        options: [
            {
                flags: '-e, --env [env]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-e',
                long: '--env',
                negate: false,
                description: '构建环境，可选dev、prod、bug、all',
                defaultValue: 'dev',
                recommend: true
            },
            {
                flags: '-a, --app [app]',
                required: false,
                optional: true,
                variadic: false,
                mandatory: false,
                short: '-a',
                long: '--app',
                negate: false,
                description: '构建应用',
                defaultValue: 'all',
                recommend: true
            }
        ]
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['build'] = cmdConfig
    }
})(typeof window !== 'undefined' ? window : global)

import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'end',
        short: 'ed',
        args: [
            { required: false, name: 'type', variadic: false, description: '分支类型' },
            { required: false, name: 'name', variadic: false, description: '分支名称(不带feature/bugfix前缀)' }
        ],
        options: []
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['end'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

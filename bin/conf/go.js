;(function (root) {
    const cmdConfig = {
        command: 'go',
        short: '',
        args: [],
        options: []
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object') module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else root['cmdConfig'] = cmdConfig
})(typeof window !== 'undefined' ? window : global)

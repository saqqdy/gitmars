import type { GitmarsOptionType } from '../../typings'
;(function (root) {
    const cmdConfig: GitmarsOptionType = {
        command: 'go',
        short: '',
        args: [
            {
                required: false,
                name: 'command',
                variadic: false,
                description: '指令名称',
                options: [
                    'combine',
                    'end',
                    'update',
                    'build',
                    'start',
                    'admin.publish',
                    'admin.update',
                    'admin.create',
                    'admin.clean',
                    'branch',
                    'copy',
                    'get',
                    'save',
                    'revert',
                    'link',
                    'unlink',
                    'postmsg'
                ],
                value: ''
            }
        ],
        options: []
    }

    /* istanbul ignore next */
    if (typeof exports === 'object' && typeof module === 'object')
        module.exports = cmdConfig
    // else if (typeof define === 'function' && define.amd) define(['cmdConfig'], () => cmdConfig)
    else if (typeof exports === 'object') exports['cmdConfig'] = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig['go'] = cmdConfig
    }
    //@ts-ignore
})(typeof window !== 'undefined' ? window : global)

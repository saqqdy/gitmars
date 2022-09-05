import type { GitmarsOptionType } from '../../typings'
const i18n = require('../locales')
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
                    'undo',
                    'redo',
                    'admin.publish',
                    'admin.update',
                    'admin.create',
                    'admin.clean',
                    'branch',
                    'copy',
                    'get',
                    'save',
                    'cleanbranch',
                    'clean',
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
    if (typeof exports === 'object' && typeof module === 'object') {
        module.exports = cmdConfig
    } else if (typeof exports === 'object') exports.cmdConfig = cmdConfig
    else {
        if (!root.gitmarsCmdConfig) root.gitmarsCmdConfig = {}
        root.gitmarsCmdConfig.go = cmdConfig
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
})(typeof window !== 'undefined' ? window : global)

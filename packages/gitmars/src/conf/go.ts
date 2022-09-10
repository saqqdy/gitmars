import type { GitmarsOptionType } from '../../typings'
import i18n from '#lib/locales/index'

export const cmdConfig: GitmarsOptionType = {
    command: 'go',
    short: '',
    args: [
        {
            required: false,
            name: 'command',
            variadic: false,
            description: i18n.__('Command Name'),
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

export { cmdConfig as default }

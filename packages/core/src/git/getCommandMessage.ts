import type { CommandMessageType } from '../../typings'
import i18n from '#lib/locales/index'

/**
 * 获取通用的指令提示信息
 *
 * @param cmd - 指令
 * @returns commandMessage - 指令提示信息
 */
function getCommandMessage(cmd: string): CommandMessageType {
    const msg = {} as CommandMessageType
    const arr = cmd.replace(/[\s]+/g, ' ').split(' ')
    if (arr.length < 2 || arr[0] !== 'git') return msg
    switch (arr[1]) {
        case 'checkout':
            msg.processing = i18n.__('Checkout branches now')
            msg.success = i18n.__('Checkout branch successfully')
            msg.fail = i18n.__('Failed to checkout')
            break
        case 'pull':
            msg.processing = i18n.__('Pulling code now')
            msg.success = i18n.__('Pulling code successfully')
            msg.fail = i18n.__('Failed to pull code')
            break
        case 'fetch':
            msg.processing = i18n.__('Pulling remote version')
            msg.success = i18n.__('Fetching success')
            msg.fail = i18n.__('Failed to fetch')
            break
        case 'commit':
            msg.processing = i18n.__('Committing')
            msg.success = i18n.__('Commit success')
            msg.fail = i18n.__('Commit Failure')
            break
        case 'push':
            msg.processing = i18n.__('Pushing')
            msg.success = i18n.__('Successful Pushed')
            msg.fail = i18n.__('Push failed')
            break
        case 'cherry-pick':
            msg.processing = i18n.__('Syncing submission records')
            msg.success = i18n.__('Syncing submission records successfully')
            msg.fail = i18n.__('Failed to sync commit records')
            break
        case 'merge':
            msg.processing = i18n.__('Merging branch')
            msg.success = i18n.__('merge branch succeeded')
            msg.fail = i18n.__('merge branch failed')
            break
        case 'rebase':
            msg.processing = i18n.__('working on rebase branch')
            msg.success = i18n.__('rebase branch succeeded')
            msg.fail = i18n.__('rebase branch failed')
            break
        case 'revert':
            msg.processing = i18n.__('Undoing code')
            msg.success = i18n.__('Undoing success')
            msg.fail = i18n.__('undo failed')
            break
        case 'clean':
            msg.processing = i18n.__('Cleaning up')
            msg.success = i18n.__('Cleanup successful')
            msg.fail = i18n.__('Cleanup failed')
            break

        default:
            break
    }
    return msg
}

export default getCommandMessage

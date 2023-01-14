import type { CommandMessageType } from '../../typings'
import lang from '#lib/lang'

const { t } = lang

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
			msg.processing = t('Checkout branches now')
			msg.success = t('Checkout branch successfully')
			msg.fail = t('Failed to checkout')
			break
		case 'pull':
			msg.processing = t('Pulling code now')
			msg.success = t('Pulling code successfully')
			msg.fail = t('Failed to pull code')
			break
		case 'fetch':
			msg.processing = t('Pulling remote version')
			msg.success = t('Fetching success')
			msg.fail = t('Failed to fetch')
			break
		case 'commit':
			msg.processing = t('Committing')
			msg.success = t('Commit success')
			msg.fail = t('Commit Failure')
			break
		case 'push':
			msg.processing = t('Pushing')
			msg.success = t('Successful Pushed')
			msg.fail = t('Push failed')
			break
		case 'cherry-pick':
			msg.processing = t('Syncing submission records')
			msg.success = t('Syncing submission records successfully')
			msg.fail = t('Failed to sync commit records')
			break
		case 'merge':
			msg.processing = t('Merging branch')
			msg.success = t('merge branch succeeded')
			msg.fail = t('merge branch failed')
			break
		case 'rebase':
			msg.processing = t('working on rebase branch')
			msg.success = t('rebase branch succeeded')
			msg.fail = t('rebase branch failed')
			break
		case 'revert':
			msg.processing = t('Undoing code')
			msg.success = t('Undoing success')
			msg.fail = t('undo failed')
			break
		case 'clean':
			msg.processing = t('Cleaning up')
			msg.success = t('Cleanup successful')
			msg.fail = t('Cleanup failed')
			break

		default:
			break
	}
	return msg
}

export default getCommandMessage

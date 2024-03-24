import { enUS, zhCN } from './locales'
export type { TranslatePair, Language } from './locales'
import getCurlOfMergeRequest from './getCurlOfMergeRequest'
import { getMessage, postMessage } from './message'
import { queue, wait } from './queue'
import sendGroupMessage from './sendGroupMessage'
import { isNeedUpgrade, upgradeGitmars } from './versionControl'

export type * from './types'
export default {
	version: '__VERSION__',
	zhCN,
	enUS,
	getCurlOfMergeRequest,
	getMessage,
	postMessage,
	queue,
	wait,
	sendGroupMessage,
	isNeedUpgrade,
	upgradeGitmars
}

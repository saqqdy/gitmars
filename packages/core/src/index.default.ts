import getCurlOfMergeRequest from './getCurlOfMergeRequest'
import { getMessage, postMessage } from './message'
import { queue, wait } from './queue'
import sendGroupMessage from './sendGroupMessage'
import { isNeedUpgrade, upgradeGitmars } from './versionControl'

export type { QueueStartFunction, WaitCallback } from './queue'
export type * from './types'
export default {
	version: '__VERSION__',
	getCurlOfMergeRequest,
	getMessage,
	postMessage,
	queue,
	wait,
	sendGroupMessage,
	isNeedUpgrade,
	upgradeGitmars
}

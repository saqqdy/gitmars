import type { GitLogsType } from './types'
import { debug } from '@gitmars/utils'
import getCurrentBranch from './getCurrentBranch'
import getGitLogs from './getGitLogs'

export interface IsUpdatedInTimeConfigType {
	// Logs from a recent period, e.g. 10s/2m/2h/3d/4M/5y
	lastet: string
	// Maximum number of logs
	limit?: number
	// Target branch
	branch: string
}

/**
 * Check whether the upstream branch was synced within the last week
 *
 * @param option - Parameters
 * @returns isUpdated - Whether the upstream branch was synced in time
 */
function getIsUpdatedInTime({ lastet, limit, branch }: IsUpdatedInTimeConfigType): boolean {
	let isUpdated = false
	const current = getCurrentBranch()
	const mainVers: string[] = []
	const currentVers: string[] = []
	const mainLogs = getGitLogs({
		lastet,
		limit,
		branch,
		noMerges: true,
	})
	const currentLogs = getGitLogs({
		lastet,
		limit,
		branch: current,
		noMerges: true,
	})

	mainLogs.forEach((log: GitLogsType) => {
		mainVers.push(log['%H']!)
	})
	currentLogs.forEach((log: GitLogsType) => {
		const arr = log['%P'] ? log['%P'].split(' ') : []

		arr.forEach((item: string) => {
			currentVers.push(item)
		})
	})
	mainVer: for (const ver of mainVers) {
		if (currentVers.includes(ver)) {
			debug('getIsUpdatedInTime', ver)
			isUpdated = true
			break mainVer
		}
	}

	return isUpdated
}

export default getIsUpdatedInTime

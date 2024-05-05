import { debug } from '@gitmars/utils'
import getCurrentBranch from './getCurrentBranch'
import getGitLogs from './getGitLogs'
import type { GitLogsType } from './types'

export interface IsUpdatedInTimeConfigType {
	// 最近几天的日志，可以是10s/2m/2h/3d/4M/5y
	lastet: string
	// 日志数量限制
	limit?: number
	// 目标分支
	branch: string
}

/**
 * 获取一周内是否同步过上游分支代码
 *
 * @param option - Parameters
 * @returns isMergedTargetBranch - 是否合并过
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
		noMerges: true
	})
	const currentLogs = getGitLogs({
		lastet,
		limit,
		branch: current,
		noMerges: true
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

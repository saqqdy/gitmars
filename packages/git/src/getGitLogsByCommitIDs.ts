import { spawnSync } from '@gitmars/core'
import { debug } from '@gitmars/utils'
import GitLogsFormatter from './gitLogsFormatter'
import type { GitLogKeysType, GitLogsType } from './types'

export interface GetGitLogsByCommitIDsOptions {
	commitIDs: string | string[]
	params?: string
	keys: GitLogKeysType[]
}

/**
 * 获取日志
 *
 * @param option - Parameters
 * @param option.commitIDs - commitID
 * @param option.params - Attached parameters
 * @param option.keys - Fields to be returned
 * @returns logsList - Return array
 */
function getGitLogsByCommitIDs({
	commitIDs,
	params = '',
	keys
}: GetGitLogsByCommitIDsOptions): GitLogsType[] {
	if (typeof commitIDs === 'string') commitIDs = [commitIDs]
	const formatter = new GitLogsFormatter()
	const { stdout } = spawnSync('git', [
		'show',
		...commitIDs,
		'--name-only',
		`--pretty=format:${formatter.getFormat(keys)}`,
		...params.split(' ')
	])
	debug('getGitLogsByCommitIDs', stdout)
	return formatter.getLogs(stdout!)
}

export default getGitLogsByCommitIDs

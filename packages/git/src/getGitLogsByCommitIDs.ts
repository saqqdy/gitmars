import { debug, spawnSync } from '@gitmars/utils'
import GitLogsFormatter from './gitLogsFormatter'
import type { GitLogKeysType, GitLogsType } from './types'

export interface GetGitLogsByCommitIDsOptions {
	// commitID
	commitIDs: string | string[]
	// Attached parameters
	params?: string
	// Fields to be returned
	keys: GitLogKeysType[]
}

/**
 * 获取日志
 *
 * @param option - Parameters
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

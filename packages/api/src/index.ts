export { default as getUserInfo } from './getUserInfo'

export {
	createMergeRequest,
	getMergeRequestList,
	getMergeRequestCommits,
	getMergeRequestCloseIssues,
	getMergeRequestParticipants,
	getMergeRequestChanges,
	getMergeRequestDiffVersions,
	acceptMergeRequest,
	updateMergeRequest,
	deleteMergeRequest
} from './mergeRequest'

export { default } from './index.default'
export type * from './index.default'
export const version = '__VERSION__' as string

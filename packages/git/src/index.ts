export { default as getIsGitProject } from './getIsGitProject'
export { default as searchBranches } from './searchBranches'
export { default as getCurrentBranch } from './getCurrentBranch'
export { default as getGitLogs } from './getGitLogs'
export { default as getGitLogsByCommitIDs } from './getGitLogsByCommitIDs'
export { default as getGitVersion } from './getGitVersion'
export { default as getGitConfig } from './getGitConfig'
export { default as getGitRevParse } from './getGitRevParse'
export { default as getAheadLogs } from './getAheadLogs'
export { default as getBehindLogs } from './getBehindLogs'
export { default as getIsBranchOrCommitExist } from './getIsBranchOrCommitExist'
export { default as getIsMergeAction } from './getIsMergeAction'
export { default as getIsMergedTargetBranch } from './getIsMergedTargetBranch'
export { default as getIsUpdatedInTime } from './getIsUpdatedInTime'
export {
	getGitEmail,
	getGitMiniprogramToken,
	getGitMiniprogramSession,
	getGitToken,
	getGitUser
} from './getGitUser'
export { default as getBranchesFromID } from './getBranchesFromID'
export { default as getGitStatus } from './getGitStatus'
export { default as getCommandMessage } from './getCommandMessage'
export { default as checkGitStatus } from './checkGitStatus'
export { default as getStashList } from './getStashList'
export { default as fetch } from './fetch'
export { default as checkout } from './checkout'
export { default as prune } from './prune'
export { default as readPkg } from './readPkg'
export { default as getConfig } from './getConfig'

export { default } from './index.default'
export type * from './index.default'
export const version = '__VERSION__' as string

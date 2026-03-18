import checkGitStatus from './checkGitStatus'
import checkout from './checkout'
import fetch from './fetch'
import getAheadLogs from './getAheadLogs'
import getBehindLogs from './getBehindLogs'
import getBranchesFromID from './getBranchesFromID'
import getCommandMessage from './getCommandMessage'
import getConfig from './getConfig'
import getCurrentBranch from './getCurrentBranch'
import getGitConfig from './getGitConfig'
import getGitLogs from './getGitLogs'
import getGitLogsByCommitIDs from './getGitLogsByCommitIDs'
import getGitRevParse from './getGitRevParse'
import getGitStatus from './getGitStatus'
import {
	getGitEmail,
	getGitMiniprogramSession,
	getGitMiniprogramToken,
	getGitToken,
	getGitUser,
} from './getGitUser'
import getGitVersion from './getGitVersion'
import getIsBranchOrCommitExist from './getIsBranchOrCommitExist'
import getIsGitProject from './getIsGitProject'
import getIsMergeAction from './getIsMergeAction'
import getIsMergedTargetBranch from './getIsMergedTargetBranch'
import getIsUpdatedInTime from './getIsUpdatedInTime'
import getStashList from './getStashList'
import prune from './prune'
import readPkg from './readPkg'
import searchBranches from './searchBranches'

export type { GitProjectConfigType } from './getGitConfig'
export type { GetGitLogsOption } from './getGitLogs'
export type { GetGitLogsByCommitIDsOptions } from './getGitLogsByCommitIDs'
export type { GitProjectRevParseType } from './getGitRevParse'
export type { IsUpdatedInTimeConfigType } from './getIsUpdatedInTime'
export type * from './types'
export default {
	version: '__VERSION__',
	getIsGitProject,
	searchBranches,
	getCurrentBranch,
	getGitLogs,
	getGitLogsByCommitIDs,
	getGitVersion,
	getGitConfig,
	getGitRevParse,
	getAheadLogs,
	getBehindLogs,
	getIsBranchOrCommitExist,
	getIsMergeAction,
	getIsMergedTargetBranch,
	getIsUpdatedInTime,
	getGitMiniprogramToken,
	getGitMiniprogramSession,
	getGitToken,
	getGitUser,
	getGitEmail,
	getBranchesFromID,
	getGitStatus,
	getCommandMessage,
	checkGitStatus,
	getStashList,
	fetch,
	checkout,
	prune,
	readPkg,
	getConfig,
}

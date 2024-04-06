import getIsGitProject from './getIsGitProject'
import searchBranches from './searchBranches'
import getCurrentBranch from './getCurrentBranch'
import getGitLogs from './getGitLogs'
import getGitLogsByCommitIDs from './getGitLogsByCommitIDs'
import getGitVersion from './getGitVersion'
import getGitConfig from './getGitConfig'
import getGitRevParse from './getGitRevParse'
import getAheadLogs from './getAheadLogs'
import getBehindLogs from './getBehindLogs'
import getIsBranchOrCommitExist from './getIsBranchOrCommitExist'
import getIsMergeAction from './getIsMergeAction'
import getIsMergedTargetBranch from './getIsMergedTargetBranch'
import getIsUpdatedInTime from './getIsUpdatedInTime'
import { getGitEmail, getGitToken, getGitUser } from './getGitUser'
import getBranchesFromID from './getBranchesFromID'
import getGitStatus from './getGitStatus'
import getCommandMessage from './getCommandMessage'
import checkGitStatus from './checkGitStatus'
import getStashList from './getStashList'
import fetch from './fetch'
import prune from './prune'
import readPkg from './readPkg'
import getConfig from './getConfig'

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
	getGitToken,
	getGitUser,
	getGitEmail,
	getBranchesFromID,
	getGitStatus,
	getCommandMessage,
	checkGitStatus,
	getStashList,
	fetch,
	prune,
	readPkg,
	getConfig
}

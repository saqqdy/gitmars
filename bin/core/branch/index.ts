const getAheadLogs = require('./getAheadLogs')
const getBehindLogs = require('./getBehindLogs')
const getIsBranchOrCommitExist = require('./getIsBranchOrCommitExist')
const getIsMergeAction = require('./getIsMergeAction')
const getIsMergedTargetBranch = require('./getIsMergedTargetBranch')
const getIsUpdatedInTime = require('./getIsUpdatedInTime')

module.exports = {
    getAheadLogs,
    getBehindLogs,
    getIsBranchOrCommitExist,
    getIsMergeAction,
    getIsMergedTargetBranch,
    getIsUpdatedInTime
}
export {}

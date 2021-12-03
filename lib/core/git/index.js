'use strict';

const getIsGitProject = require("./getIsGitProject");
const searchBranches = require("./searchBranches");
const getCurrentBranch = require("./getCurrentBranch");
const getGitLogs = require("./getGitLogs");
const getGitVersion = require("./getGitVersion");
const getGitConfig = require("./getGitConfig");
const getGitRevParse = require("./getGitRevParse");
const getAheadLogs = require("./getAheadLogs");
const getBehindLogs = require("./getBehindLogs");
const getIsBranchOrCommitExist = require("./getIsBranchOrCommitExist");
const getIsMergeAction = require("./getIsMergeAction");
const getIsMergedTargetBranch = require("./getIsMergedTargetBranch");
const getIsUpdatedInTime = require("./getIsUpdatedInTime");
const { getGitUser, getGitEmail } = require("./getGitUser");
const getBranchesFromID = require("./getBranchesFromID");
const getGitStatus = require("./getGitStatus");
const getCommandMessage = require("./getCommandMessage");
const checkGitStatus = require("./checkGitStatus");
const getStashList = require("./getStashList");
const { mergeRequest } = require("./remoteRequest");
module.exports = {
  getIsGitProject,
  searchBranches,
  getCurrentBranch,
  getGitLogs,
  getGitVersion,
  getGitConfig,
  getGitRevParse,
  getAheadLogs,
  getBehindLogs,
  getIsBranchOrCommitExist,
  getIsMergeAction,
  getIsMergedTargetBranch,
  getIsUpdatedInTime,
  getGitUser,
  getGitEmail,
  getBranchesFromID,
  getGitStatus,
  getCommandMessage,
  checkGitStatus,
  getStashList,
  mergeRequest
};

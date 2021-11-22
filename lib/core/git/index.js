'use strict';

const getIsGitProject = require("./getIsGitProject");
const searchBranches = require("./searchBranches");
const getCurrentBranch = require("./getCurrentBranch");
const getGitLogs = require("./getGitLogs");
const getGitVersion = require("./getGitVersion");
const getGitConfig = require("./getGitConfig");
const getGitRevParse = require("./getGitRevParse");
const checkGitDirEnv = require("./checkGitDirEnv");
const getAheadLogs = require("./getAheadLogs");
const getBehindLogs = require("./getBehindLogs");
const getIsBranchOrCommitExist = require("./getIsBranchOrCommitExist");
const getIsMergeAction = require("./getIsMergeAction");
const getIsMergedTargetBranch = require("./getIsMergedTargetBranch");
const getIsUpdatedInTime = require("./getIsUpdatedInTime");
module.exports = {
  getIsGitProject,
  searchBranches,
  getCurrentBranch,
  getGitLogs,
  getGitVersion,
  getGitConfig,
  getGitRevParse,
  checkGitDirEnv,
  getAheadLogs,
  getBehindLogs,
  getIsBranchOrCommitExist,
  getIsMergeAction,
  getIsMergedTargetBranch,
  getIsUpdatedInTime
};

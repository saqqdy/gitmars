'use strict';

const { getCurrentBranch, getGitLogs } = require("../git/index");
function getIsMergeAction() {
  const current = getCurrentBranch();
  const currentLogs = getGitLogs({
    limit: 1,
    branches: current
  });
  const p = currentLogs[0]["%P"] ? currentLogs[0]["%P"].split(" ") : [];
  return p.length > 1;
}
module.exports = getIsMergeAction;

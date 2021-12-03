'use strict';

const getGitLogs = require("./getGitLogs");
function getIsMergeAction() {
  const currentLogs = getGitLogs({
    limit: 1
  });
  const p = currentLogs[0]["%P"] ? currentLogs[0]["%P"].split(" ") : [];
  return p.length > 1;
}
module.exports = getIsMergeAction;

'use strict';

const { getCurrent, getLogs } = require("../index");
function getIsMergeAction() {
  const current = getCurrent();
  const currentLogs = getLogs({
    limit: 1,
    branches: current
  });
  const p = currentLogs[0]["%P"] ? currentLogs[0]["%P"].split(" ") : [];
  return p.length > 1;
}
module.exports = getIsMergeAction;

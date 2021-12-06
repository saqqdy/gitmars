'use strict';

const getCurrentBranch = require("./getCurrentBranch");
const getGitLogs = require("./getGitLogs");
function getIsUpdatedInTime({
  lastet,
  limit,
  branch
}) {
  let isUpdated = false;
  const current = getCurrentBranch();
  const mainVers = [];
  const currentVers = [];
  const mainLogs = getGitLogs({
    lastet,
    limit,
    branch,
    params: "--no-merges"
  });
  const currentLogs = getGitLogs({
    lastet,
    limit,
    branch: current,
    params: "--no-merges"
  });
  mainLogs.forEach((log) => {
    mainVers.push(log["%H"]);
  });
  currentLogs.forEach((log) => {
    const arr = log["%P"] ? log["%P"].split(" ") : [];
    arr.forEach((item) => {
      currentVers.push(item);
    });
  });
  mainVer:
    for (const ver of mainVers) {
      if (currentVers.includes(ver)) {
        isUpdated = true;
        break mainVer;
      }
    }
  return isUpdated;
}
module.exports = getIsUpdatedInTime;

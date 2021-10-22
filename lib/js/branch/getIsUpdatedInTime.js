'use strict';

const { getCurrent, getLogs } = require("../index");
function getIsUpdatedInTime({
  lastet,
  limit,
  branch: branches
}) {
  let isUpdated = false;
  const current = getCurrent();
  const mainVers = [];
  const currentVers = [];
  const mainLogs = getLogs({ lastet, limit, branches });
  const currentLogs = getLogs({ lastet, limit, branches: current });
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

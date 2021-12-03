'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
function getAheadLogs() {
  const current = getCurrentBranch();
  spawnSync("git", ["fetch"]);
  const { stdout } = spawnSync("git", [
    "log",
    `origin/${current}..${current}`,
    "--pretty",
    "format:%p"
  ]);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getAheadLogs;

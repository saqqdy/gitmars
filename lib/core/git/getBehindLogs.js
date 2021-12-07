'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
function getBehindLogs() {
  const current = getCurrentBranch();
  spawnSync("git", ["fetch"]);
  const { stdout } = spawnSync("git", [
    "log",
    `${current}..origin/${current}`,
    "--pretty",
    "format:%p"
  ]);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getBehindLogs;

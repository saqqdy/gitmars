'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
const { debug } = require("../utils/debug");
function getAheadLogs() {
  const current = getCurrentBranch();
  spawnSync("git", ["fetch"]);
  const { stdout } = spawnSync("git", [
    "log",
    `origin/${current}..${current}`,
    "--pretty",
    "format:%p"
  ]);
  debug("getAheadLogs", stdout);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getAheadLogs;

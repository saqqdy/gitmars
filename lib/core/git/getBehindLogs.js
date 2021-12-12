'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
const { debug } = require("../utils/debug");
function getBehindLogs() {
  const current = getCurrentBranch();
  spawnSync("git", ["fetch"]);
  const { stdout } = spawnSync("git", [
    "log",
    `${current}..origin/${current}`,
    "--pretty",
    "format:%p"
  ]);
  debug("getBehindLogs", stdout);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getBehindLogs;

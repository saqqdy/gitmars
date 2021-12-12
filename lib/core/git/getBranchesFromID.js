'use strict';

const { spawnSync } = require("../spawn");
const { debug } = require("../utils/debug");
function getBranchesFromID(commitID, remote = false) {
  const { stdout } = spawnSync("git", [
    "branch",
    remote ? "-r" : "",
    "--contains",
    commitID,
    "--format",
    "%(refname:short)"
  ]);
  debug("getBranchesFromID", stdout);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getBranchesFromID;

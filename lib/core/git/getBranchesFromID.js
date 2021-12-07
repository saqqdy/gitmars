'use strict';

const { spawnSync } = require("../spawn");
function getBranchesFromID(commitID, remote = false) {
  const { stdout } = spawnSync("git", [
    "branch",
    remote ? "-r" : "",
    "--contains",
    commitID,
    "--format",
    "%(refname:short)"
  ]);
  return stdout ? stdout.split("\n") : [];
}
module.exports = getBranchesFromID;

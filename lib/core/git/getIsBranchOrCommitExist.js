'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
function getIsBranchOrCommitExist(name, remote = false) {
  if (!name)
    name = getCurrentBranch();
  if (remote && name.indexOf("origin") === -1)
    name = "origin/" + name;
  const { status } = spawnSync("git", ["rev-parse", "--verify", name]);
  return status === 0;
}
module.exports = getIsBranchOrCommitExist;

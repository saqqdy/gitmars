'use strict';

const sh = require("shelljs");
const getCurrentBranch = require("./getCurrentBranch");
function getIsBranchOrCommitExist(name, remote = false) {
  if (!name)
    name = getCurrentBranch();
  if (remote && name.indexOf("origin") === -1)
    name = "origin/" + name;
  return sh.exec(`git rev-parse --verify ${name}`, {
    silent: true
  }).code === 0;
}
module.exports = getIsBranchOrCommitExist;

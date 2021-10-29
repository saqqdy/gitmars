'use strict';

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getIsBranchOrCommitExist(name, remote = false) {
  if (!name)
    name = getCurrent();
  if (remote)
    name = "origin/" + name;
  return sh.exec(`git rev-parse --verify ${name}`, {
    silent: true
  }).code === 0;
}
module.exports = getIsBranchOrCommitExist;

'use strict';

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getIsMergedTargetBranch(branch, targetBranch = "dev", remote = false) {
  if (!branch)
    branch = getCurrent();
  if (remote)
    branch = "origin/" + branch;
  const result = sh.exec(`git branch --contains ${branch} --format="%(refname:short)"`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result.split("\n").includes(targetBranch);
}
module.exports = getIsMergedTargetBranch;

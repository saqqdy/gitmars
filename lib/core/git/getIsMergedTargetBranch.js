'use strict';

const sh = require("shelljs");
const getCurrentBranch = require("./getCurrentBranch");
function getIsMergedTargetBranch(branch, targetBranch = "dev", remote = false) {
  if (!branch)
    branch = getCurrentBranch();
  if (remote && targetBranch.indexOf("origin") === -1)
    targetBranch = "origin/" + targetBranch;
  const result = sh.exec(`git branch --contains ${branch} --format="%(refname:short)" ${remote ? "--remote" : ""}`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result.split("\n").includes(targetBranch);
}
module.exports = getIsMergedTargetBranch;

'use strict';

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getIsMergedTargetBranch(branch, targetBranch = "dev", remote = false) {
  if (!branch)
    branch = getCurrent();
  if (remote && targetBranch.indexOf("origin") === -1)
    targetBranch = "origin/" + targetBranch;
  const result = sh.exec(`git branch --contains ${branch} --format="%(refname:short)" ${remote ? "--remote" : ""}`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result.split("\n").includes(targetBranch);
}
module.exports = getIsMergedTargetBranch;

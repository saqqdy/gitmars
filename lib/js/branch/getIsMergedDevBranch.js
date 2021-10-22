'use strict';

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getIsMergedDevBranch(branch, targetBranch = "dev") {
  if (!branch)
    branch = getCurrent();
  const result = sh.exec(`git branch --contains ${branch} --format="%(refname:short)"`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result.split("\n").includes(targetBranch);
}
module.exports = getIsMergedDevBranch;

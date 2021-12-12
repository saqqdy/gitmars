'use strict';

const { spawnSync } = require("../spawn");
const getCurrentBranch = require("./getCurrentBranch");
const { debug } = require("../utils/debug");
function getIsMergedTargetBranch(branch, targetBranch = "dev", remote = false) {
  if (!branch)
    branch = getCurrentBranch();
  if (remote && targetBranch.indexOf("origin") === -1)
    targetBranch = "origin/" + targetBranch;
  const { stdout } = spawnSync("git", [
    "branch",
    "--contains",
    branch,
    "--format",
    "%(refname:short)",
    remote ? "--remote" : ""
  ]);
  debug("getIsMergedTargetBranch", stdout);
  return stdout.split("\n").includes(targetBranch);
}
module.exports = getIsMergedTargetBranch;

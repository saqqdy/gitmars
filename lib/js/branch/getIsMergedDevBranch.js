'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getIsMergedDevBranch(branch, targetBranch = "dev") {
  if (!branch)
    branch = getCurrent();
  const result = sh.exec(`git branch --contains ${branch}`, { silent: true }).stdout.replace(/\s+$/g, "");
  return result.split("\n").includes(targetBranch);
}

exports["default"] = getIsMergedDevBranch;
exports.getIsMergedDevBranch = getIsMergedDevBranch;

'use strict';

const sh = require("shelljs");
function getBranchesFromID(commitID, remote = false) {
  const out = sh.exec(`git branch ${remote ? "-r" : ""} --contains ${commitID} --format="%(refname:short)`, { silent: true }).stdout.replace(/(^\s+|\n+$)/, "");
  return out ? out.split("\n") : [];
}
module.exports = getBranchesFromID;

'use strict';

const sh = require("shelljs");
const getCurrentBranch = require("./getCurrentBranch");
function getBehindLogs() {
  const current = getCurrentBranch();
  sh.exec("git fetch", { silent: true });
  const result = sh.exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result ? result.split("\n") : [];
}
module.exports = getBehindLogs;

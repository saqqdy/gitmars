'use strict';

const sh = require("shelljs");
const { getCurrentBranch } = require("../git/index");
function getAheadLogs() {
  const current = getCurrentBranch();
  sh.exec("git fetch", { silent: true });
  const result = sh.exec(`git log origin/${current}..${current} --pretty=format:"%p"`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result ? result.split("\n") : [];
}
module.exports = getAheadLogs;

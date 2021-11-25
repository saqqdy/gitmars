'use strict';

const sh = require("shelljs");
function getCurrentBranch() {
  return sh.exec("git symbolic-ref --short -q HEAD", { silent: true }).stdout.replace(/[\n\s]*$/g, "");
}
module.exports = getCurrentBranch;

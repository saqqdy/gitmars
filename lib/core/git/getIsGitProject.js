'use strict';

const sh = require("shelljs");
function getIsGitProject() {
  return sh.exec("git rev-parse --is-inside-work-tree", { silent: true }).stdout.includes("true");
}
module.exports = getIsGitProject;

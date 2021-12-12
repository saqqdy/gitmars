'use strict';

const { spawnSync } = require("../spawn");
const { debug } = require("../utils/debug");
function getIsGitProject() {
  const { stdout } = spawnSync("git", ["rev-parse", "--is-inside-work-tree"]);
  debug("getIsGitProject", stdout, stdout.includes("true"));
  return stdout.includes("true");
}
module.exports = getIsGitProject;

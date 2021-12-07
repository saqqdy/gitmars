'use strict';

const { spawnSync } = require("../spawn");
function getIsGitProject() {
  const { stdout } = spawnSync("git", ["rev-parse", "--is-inside-work-tree"]);
  return stdout.includes("true");
}
module.exports = getIsGitProject;

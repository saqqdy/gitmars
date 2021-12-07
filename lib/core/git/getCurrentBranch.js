'use strict';

const { spawnSync } = require("../spawn");
function getCurrentBranch() {
  const { stdout } = spawnSync("git", [
    "symbolic-ref",
    "--short",
    "-q",
    "HEAD"
  ]);
  return stdout;
}
module.exports = getCurrentBranch;

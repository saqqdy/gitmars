'use strict';

const { spawnSync } = require("../spawn");
const slash = require("slash");
const { debug } = require("../utils/debug");
function getGitRevParse(cwd = process.cwd()) {
  const { stdout } = spawnSync("git", [
    "rev-parse",
    "--show-toplevel",
    "--show-prefix",
    "--git-common-dir",
    "--absolute-git-dir",
    "--show-cdup"
  ], { cwd });
  const [root, prefix, gitCommonDir, gitDir, cdup = ""] = stdout.split("\n").map((s) => s.trim()).map(slash);
  debug("getGitRevParse", {
    prefix: prefix || ".",
    gitCommonDir,
    root,
    gitDir,
    gitHookDir: gitDir + "/hooks",
    cdup
  });
  return {
    prefix: prefix || ".",
    gitCommonDir,
    root,
    gitDir,
    gitHookDir: gitDir + "/hooks",
    cdup
  };
}
module.exports = getGitRevParse;

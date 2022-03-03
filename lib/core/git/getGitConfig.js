'use strict';

const { spawnSync } = require("../spawn");
const slash = require("slash");
const { debug } = require("../utils/debug");
function getGitConfig(cwd = process.cwd()) {
  const { stdout } = spawnSync("git", ["config", "--local", "--get", "remote.origin.url"], { cwd });
  const [gitUrl] = stdout.split("\n").map((s) => s.trim()).map(slash);
  debug("getGitConfig", {
    gitUrl,
    appName: gitUrl.replace(/\.git\/?$/, "").split("/").reverse()[0]
  });
  return {
    gitUrl,
    appName: gitUrl.replace(/\.git\/?$/, "").split("/").reverse()[0]
  };
}
module.exports = getGitConfig;

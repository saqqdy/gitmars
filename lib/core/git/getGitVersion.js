'use strict';

const sh = require("shelljs");
const { spawnSync } = require("../spawn");
const { yellow } = require("colors");
function getGitVersion() {
  const { stdout } = spawnSync("git", ["--version"]);
  let version = stdout.match(/[\d.?]+/g);
  if (!version) {
    sh.echo(yellow("\u6CA1\u6709\u627E\u5230git"));
    process.exit(1);
    return;
  }
  version = version[0];
  return version;
}
module.exports = getGitVersion;

'use strict';

const sh = require("shelljs");
const { warning } = require("../utils/colors");
function getGitVersion() {
  let version = sh.exec("git --version", { silent: true }).stdout.replace(/\s*$/g, "").match(/[\d.?]+/g);
  if (!version) {
    sh.echo(warning("\u6CA1\u6709\u627E\u5230git"));
    sh.exit(1);
    return;
  }
  version = version[0];
  return version;
}
module.exports = getGitVersion;

'use strict';

const { spawnSync } = require("../spawn");
const { debug } = require("../utils/debug");
function getGitUser() {
  const { stdout } = spawnSync("git", ["config", "user.name"]);
  debug("git.user", stdout);
  return stdout;
}
function getGitEmail() {
  const { stdout } = spawnSync("git", ["config", "user.email"]);
  debug("git.email", stdout);
  return stdout;
}
module.exports = {
  getGitUser,
  getGitEmail
};

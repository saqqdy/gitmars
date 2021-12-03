'use strict';

const { spawnSync } = require("../spawn");
function getGitUser() {
  const { stdout } = spawnSync("git", ["config", "user.name"]);
  return stdout;
}
function getGitEmail() {
  const { stdout } = spawnSync("git", ["config", "user.email"]);
  return stdout;
}
module.exports = {
  getGitUser,
  getGitEmail
};

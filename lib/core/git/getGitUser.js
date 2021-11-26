'use strict';

const sh = require("shelljs");
function getGitUser() {
  return sh.exec("git config user.name", { silent: true }).stdout.replace(/(^\s+|\n+$)/, "");
}
function getGitEmail() {
  return sh.exec("git config user.email", { silent: true }).stdout.replace(/(^\s+|\n+$)/, "");
}
module.exports = {
  getGitUser,
  getGitEmail
};

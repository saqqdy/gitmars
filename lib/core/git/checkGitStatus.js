'use strict';

const sh = require("shelljs");
const getGitStatus = require("./getGitStatus");
const { warning, error } = require("../utils/colors");
function checkGitStatus() {
  const sum = getGitStatus({ stdio: "inherit" });
  if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
    sh.echo(error("\u60A8\u8FD8\u6709\u672A\u63D0\u4EA4\u7684\u6587\u4EF6\uFF0C\u8BF7\u5904\u7406\u540E\u518D\u7EE7\u7EED") + "\n\u5982\u679C\u9700\u8981\u6682\u5B58\u6587\u4EF6\u8BF7\u6267\u884C: gitm save\n\u6062\u590D\u65F6\u6267\u884C\uFF1Agitm get");
    process.exit(1);
    return false;
  } else if (sum["??"].length > 0) {
    sh.echo(warning("\u60A8\u6709\u672A\u52A0\u5165\u7248\u672C\u7684\u6587\u4EF6,") + "\n\u5982\u679C\u9700\u8981\u6682\u5B58\u6587\u4EF6\u8BF7\u6267\u884C: gitm save --force\n\u6062\u590D\u65F6\u6267\u884C\uFF1Agitm get");
  }
  return true;
}
module.exports = checkGitStatus;

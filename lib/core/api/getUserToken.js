'use strict';

const sh = require("shelljs");
const { red } = require("colors");
const { getGitUser } = require("../git/getGitUser");
const request = require("../request");
const getConfig = require("../getConfig");
async function getUserToken() {
  const config = getConfig();
  if (!config.api) {
    sh.echo(red("\u8BF7\u914D\u7F6E\u7528\u4E8E\u8BF7\u6C42\u6743\u9650\u7684api\u63A5\u53E3\u5730\u5740\uFF0C\u63A5\u6536\u53C2\u6570\u5F62\u5F0F\uFF1Aurl?name=git_user_name\uFF0C\u8FD4\u56DEdata=token"));
    process.exit(1);
  }
  const user = getGitUser();
  if (!user) {
    sh.echo(red("\u8BF7\u8BBE\u7F6E\u672C\u5730git\u7528\u6237\u540D"));
    process.exit(1);
  }
  const fetchData = (await request.get({ url: `${config.api}?name=${user}` })).data || null;
  if (!fetchData) {
    sh.echo(red("\u6CA1\u6709\u627E\u5230\u7528\u6237\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"));
    process.exit(1);
  } else if (!fetchData.token) {
    sh.echo(red("\u8BF7\u8BBE\u7F6Eaccess_token"));
    process.exit(1);
  }
  return fetchData;
}
module.exports = getUserToken;

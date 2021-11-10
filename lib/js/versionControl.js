'use strict';

const sh = require("shelljs");
const { error, success } = require("./index");
const getPkgInfo = require("./getPkgInfo");
const { version } = require("../../package.json");
async function isNeedUpgrade() {
  const { "dist-tags": tags, versions } = await getPkgInfo();
  if (version.indexOf("1.") === 0) {
    return parseFloat(tags.lite) > parseFloat(version);
  }
  return parseFloat(tags.latest) > parseFloat(version);
}
function upgradeGitmars() {
  sh.echo(error(`\u68C0\u6D4B\u5230\u4F60\u7684\u7248\u672C\u6BD4\u8F83\u53E4\u8001\uFF0C\u4E3A\u907F\u514D\u7248\u672C\u788E\u7247\u5316\u95EE\u9898\uFF0C\u8BF7\u5347\u7EA7\u4E4B\u540E\u518D\u4F7F\u7528!`) + success("\nMac\u7528\u6237\u5347\u7EA7\u65B9\u6CD5\uFF1Asudo gitm upgrade latest -m -c npm\nWindows\u7528\u6237\u5347\u7EA7\u65B9\u6CD5\uFF1Anpm i -g gitmars@lite"));
  sh.exit(1);
}
module.exports = {
  isNeedUpgrade,
  upgradeGitmars
};

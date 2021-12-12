'use strict';

const debug = require("../utils/debug");
function checkGitDirEnv() {
  if (process.env.GIT_DIR) {
    debug(`GIT_DIR \u73AF\u5883\u53D8\u91CF\u503C\u4E3A\uFF1A${process.env.GIT_DIR}`);
    debug('\u5982\u679C\u63D0\u793A"fatal: not a git repository"\uFF0C\u8BF7\u68C0\u67E5 GIT_DIR \u7684\u503C');
  }
}
module.exports = checkGitDirEnv;

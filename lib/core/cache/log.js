'use strict';

const sh = require("shelljs");
const getGitRevParse = require("../git/getGitRevParse");
function setLog(log) {
  const { gitDir } = getGitRevParse();
  sh.touch(gitDir + "/.gitmarslog");
  sh.sed("-i", /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(log)), gitDir + "/.gitmarslog");
}
module.exports = {
  setLog
};

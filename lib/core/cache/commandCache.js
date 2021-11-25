'use strict';

const sh = require("shelljs");
const getGitRevParse = require("../git/getGitRevParse");
const { isFileExist } = require("../utils/file");
function getCommandCache() {
  const { gitDir } = getGitRevParse();
  let arr = [];
  if (isFileExist(gitDir + "/.gitmarscommands")) {
    arr = sh.cat(gitDir + "/.gitmarscommands").stdout.split("\n")[0].replace(/(^\n*)|(\n*$)/g, "").replace(/\n{2,}/g, "\n").replace(/\r/g, "");
    arr = JSON.parse(decodeURIComponent(arr));
  }
  return arr;
}
function setCommandCache(rest) {
  const { gitDir } = getGitRevParse();
  sh.touch(gitDir + "/.gitmarscommands");
  sh.sed("-i", /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(rest)), gitDir + "/.gitmarscommands");
}
function cleanCommandCache() {
  setCommandCache([]);
}
module.exports = {
  getCommandCache,
  setCommandCache,
  cleanCommandCache
};

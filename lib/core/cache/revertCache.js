'use strict';

const sh = require("shelljs");
const getGitRevParse = require("../git/getGitRevParse");
const { writeFileSync, isFileExist } = require("../utils/file");
const { gitDir } = getGitRevParse();
const GITMARS_REVERT_CACHE_FILE = gitDir + "/gitmarsreverts.json";
function getRevertCache() {
  let reverts = [];
  if (isFileExist(GITMARS_REVERT_CACHE_FILE)) {
    reverts = require(GITMARS_REVERT_CACHE_FILE);
  } else {
    sh.touch(GITMARS_REVERT_CACHE_FILE);
    writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify([]));
  }
  return reverts;
}
function setRevertCache(reverts) {
  sh.touch(GITMARS_REVERT_CACHE_FILE);
  writeFileSync(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts, null, 4));
}
function addRevertCache(reverts) {
  if (!Array.isArray(reverts))
    reverts = [reverts];
  const revertCache = getRevertCache();
  let len = reverts.length;
  while (len--) {
    const _index = revertCache.findIndex((item) => item.after["%H"] === reverts[len]["%H"]);
    if (_index === -1) {
      revertCache.push({ before: reverts[len], after: {} });
    }
  }
  setRevertCache(revertCache);
}
function cleanRevertCache() {
  setRevertCache([]);
}
module.exports = {
  getRevertCache,
  setRevertCache,
  addRevertCache,
  cleanRevertCache
};

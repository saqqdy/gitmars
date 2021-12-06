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
function addRevertCache(revertCaches) {
  if (!Array.isArray(revertCaches))
    revertCaches = [revertCaches];
  const _cacheList = getRevertCache();
  let len = revertCaches.length;
  while (len--) {
    const _index = _cacheList.findIndex((item) => item.before["%H"] === revertCaches[len].before["%H"]);
    if (_index === -1) {
      _cacheList.push(revertCaches[len]);
    }
  }
  setRevertCache(_cacheList);
}
function delRevertCache(commitIDs) {
  if (!Array.isArray(commitIDs))
    commitIDs = [commitIDs];
  const _cacheList = getRevertCache();
  let len = commitIDs.length;
  while (len--) {
    const _index = _cacheList.findIndex((item) => item.after["%H"].indexOf(commitIDs[len]) > -1);
    if (_index > -1) {
      _cacheList.splice(_index, 1);
    }
  }
  setRevertCache(_cacheList);
}
function cleanRevertCache() {
  setRevertCache([]);
}
module.exports = {
  getRevertCache,
  setRevertCache,
  addRevertCache,
  delRevertCache,
  cleanRevertCache
};

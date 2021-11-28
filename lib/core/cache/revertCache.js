'use strict';

const sh = require("shelljs");
const getGitRevParse = require("../git/getGitRevParse");
const { writeFile, isFileExist } = require("../utils/file");
const { gitDir } = getGitRevParse();
const GITMARS_REVERT_CACHE_FILE = gitDir + "/gitmarsreverts.json";
function getRevertCache() {
  let reverts = [];
  if (isFileExist(GITMARS_REVERT_CACHE_FILE)) {
    reverts = require(GITMARS_REVERT_CACHE_FILE);
  } else {
    sh.touch(GITMARS_REVERT_CACHE_FILE);
    sh.sed("-i", /.+/, "[]", GITMARS_REVERT_CACHE_FILE);
  }
  return reverts;
}
async function setRevertCache(reverts) {
  sh.touch(GITMARS_REVERT_CACHE_FILE);
  await writeFile(GITMARS_REVERT_CACHE_FILE, JSON.stringify(reverts));
}
async function addRevertCache(revert) {
  const reverts = getRevertCache();
  const _index = reverts.findIndex((item) => item.after["%H"] === revert["%H"]);
  if (_index === -1) {
    reverts.push({ before: revert, after: revert });
  } else {
    reverts.splice(_index, 1);
  }
  await setRevertCache(reverts);
}
async function cleanRevertCache() {
  await setRevertCache([]);
}
module.exports = {
  getRevertCache,
  setRevertCache,
  addRevertCache,
  cleanRevertCache
};

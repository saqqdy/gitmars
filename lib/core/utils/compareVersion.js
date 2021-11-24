'use strict';

function compareVersion(basicVer, compareVer) {
  if (basicVer === null)
    return null;
  basicVer = basicVer + ".";
  compareVer = compareVer + ".";
  const bStr = parseFloat(basicVer);
  const cStr = parseFloat(compareVer);
  const bStrNext = parseFloat(basicVer.replace(bStr + ".", "")) || 0;
  const cStrNext = parseFloat(compareVer.replace(cStr + ".", "")) || 0;
  if (cStr > bStr) {
    return false;
  } else if (cStr < bStr) {
    return true;
  } else {
    if (bStrNext >= cStrNext) {
      return true;
    } else {
      return false;
    }
  }
}
module.exports = compareVersion;

'use strict';

const sh = require("shelljs");
function isFileExist(filePath) {
  return sh.test("-f", filePath) || sh.find(filePath).stdout !== "";
}
module.exports = isFileExist;

'use strict';

const fs = require("fs");
const sh = require("shelljs");
function writeFile(url, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(url, data, (err) => {
      if (err) {
        reject(new Error("\u6587\u4EF6\u5199\u5165\u9519\u8BEF"));
      } else {
        resolve(true);
      }
    });
  });
}
function isFileExist(filePath) {
  return sh.test("-f", filePath) || sh.find(filePath).stdout !== "";
}
module.exports = {
  writeFile,
  isFileExist
};

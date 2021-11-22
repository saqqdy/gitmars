'use strict';

const { isFileExist } = require("./utils/index");
const gitRevParse = require("./gitRevParse");
const { root } = gitRevParse();
const getConfigFrom = () => {
  if (isFileExist(root + "/.gitmarsrc")) {
    return 1;
  } else if (isFileExist(root + "/gitmarsconfig.json")) {
    return 2;
  }
  return 0;
};
module.exports = getConfigFrom();

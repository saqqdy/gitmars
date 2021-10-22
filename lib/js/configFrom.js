'use strict';

const sh = require("shelljs");
const gitRevParse = require("./gitRevParse");
const { root } = gitRevParse();
const getConfigFrom = () => {
  if (sh.test("-f", root + "/.gitmarsrc")) {
    return 1;
  } else if (sh.test("-f", root + "/gitmarsconfig.json")) {
    return 2;
  }
  return 0;
};
module.exports = getConfigFrom();

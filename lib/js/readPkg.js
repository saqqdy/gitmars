'use strict';

const gitRevParse = require("./gitRevParse");
const fs = require("fs");
const path = require("path");
function readPkg(dir) {
  if (!dir) {
    const { root } = gitRevParse();
    dir = root;
  }
  const pkgFile = path.resolve(dir, "package.json");
  const pkgStr = fs.readFileSync(pkgFile, "utf-8");
  return JSON.parse(pkgStr);
}
module.exports = readPkg;

'use strict';

const fs = require("fs");
const { cosmiconfigSync } = require("cosmiconfig");
const { getGitRevParse } = require("./git/index");
const { defaults } = require("./global");
module.exports = function getConfig(pathName, moduleName = "gitmars") {
  let info;
  if (!pathName) {
    const { root } = getGitRevParse();
    try {
      pathName = root + "/gitmarsconfig.json";
      info = fs.statSync(pathName);
    } catch (err) {
      pathName = root;
    }
  }
  const defaultSet = {
    skipCI: true
  };
  const explorer = cosmiconfigSync(moduleName);
  if (!info)
    info = fs.statSync(pathName);
  if (info.isDirectory()) {
    const { config = {}, filepath = "" } = explorer.search(pathName) || {};
    return Object.assign({}, defaults, defaultSet, config, { filepath });
  } else {
    const { config = {}, filepath = "" } = explorer.load(pathName) || {};
    return Object.assign({}, defaults, defaultSet, config, { filepath });
  }
};

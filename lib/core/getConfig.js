'use strict';

const fs = require("fs");
const { cosmiconfigSync } = require("cosmiconfig");
const getGitRevParse = require("./git/getGitRevParse");
const { defaults } = require("./global");
const { debug } = require("./utils/debug");
function getConfig(pathName, moduleName = "gitmars") {
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
  debug("getConfig", pathName, info);
  const defaultSet = {
    skipCI: true
  };
  const explorer = cosmiconfigSync(moduleName);
  if (!info)
    info = fs.statSync(pathName);
  if (info.isDirectory()) {
    const { config = {}, filepath = "" } = explorer.search(pathName) || {};
    debug("getConfig-config", config, filepath);
    return Object.assign({}, defaults, defaultSet, config, { filepath });
  } else {
    const { config = {}, filepath = "" } = explorer.load(pathName) || {};
    debug("getConfig-config", config, filepath);
    return Object.assign({}, defaults, defaultSet, config, { filepath });
  }
}
module.exports = getConfig;

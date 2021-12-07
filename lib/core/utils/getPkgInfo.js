'use strict';

const path = require("path");
const getProperty = require("js-cool/lib/getProperty");
const { writeFile, isFileExist } = require("./file");
const { isCacheExpired, updateCacheTime } = require("../cache/cache");
const { spawnSync } = require("../spawn");
const cacheDir = path.join(__dirname, "../../../cache");
async function getPkgInfo(name) {
  let packageInfo;
  if (!isCacheExpired("packageInfoTime") && isFileExist(cacheDir + "/packageInfo.json")) {
    packageInfo = require(cacheDir + "/packageInfo.json");
    return name ? getProperty(packageInfo, name) : packageInfo;
  }
  const { stdout } = spawnSync("npm", ["view", "gitmars", "--json"]);
  try {
    packageInfo = JSON.parse(stdout);
  } catch (e) {
    throw "\u51FA\u9519\u4E86";
  }
  await updateCacheTime("packageInfoTime");
  await writeFile(cacheDir + "/packageInfo.json", JSON.stringify(packageInfo));
  return name ? getProperty(packageInfo, name) : packageInfo;
}
module.exports = getPkgInfo;

'use strict';

const path = require("path");
const sh = require("shelljs");
const { writeFile } = require("../index");
const cacheDir = path.join(__dirname, "../../../cache");
function isCacheExpired(name, time = 24 * 60 * 60 * 1e3) {
  const now = new Date().getTime();
  let timestamp = {};
  if (!name)
    throw "\u8BF7\u4F20\u5165\u540D\u79F0";
  if (!sh.test("-f", cacheDir + "/timestamp.json"))
    return true;
  timestamp = require(cacheDir + "/timestamp.json");
  return !timestamp[name] || now - timestamp[name] >= time;
}
async function updateCacheTime(name) {
  const now = new Date().getTime();
  let timestamp = {};
  if (!name)
    throw "\u8BF7\u4F20\u5165\u540D\u79F0";
  if (sh.test("-f", cacheDir + "/timestamp.json"))
    timestamp = require(cacheDir + "/timestamp.json");
  timestamp[name] = now;
  await writeFile(cacheDir + "/timestamp.json", JSON.stringify(timestamp));
}
module.exports = {
  isCacheExpired,
  updateCacheTime
};

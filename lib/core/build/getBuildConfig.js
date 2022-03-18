'use strict';

const path = require("path");
const apollo = require("node-apollo");
const sh = require("shelljs");
const request = require("@jssj/request");
const { red } = require("colors");
const { writeFile, isFileExist } = require("../utils/file");
const { isCacheExpired, updateCacheTime } = require("../cache/cache");
const getConfig = require("../getConfig");
const { debug } = require("../utils/debug");
function getNamespace(params = {}) {
  const names = [];
  const keys = Object.keys(params).sort((a, b) => a.length - b.length);
  for (const key of keys) {
    if (params[key] && typeof params[key] === "string")
      names.push(params[key]);
  }
  if (names.length)
    return names.join("-");
  return "gitmars";
}
async function getBuildConfig() {
  const cacheDir = path.join(__dirname, "../../../cache");
  const config = getConfig();
  const { apis = {} } = config;
  let NS, _buildConfig;
  debug("getBuildConfig", config);
  if (apis.buildConfig) {
    NS = getNamespace(apis.buildConfig.params || {});
  } else if (config.apolloConfig) {
    const { appId, clusterName } = config.apolloConfig;
    NS = getNamespace({ appId, clusterName });
  } else {
    sh.echo(red("\u8BF7\u914D\u7F6Eapollo\u6216buildConfigApi"));
    process.exit(0);
    return;
  }
  const BUILD_CONFIG_TIME_NAME = `buildConfigTime-${NS}`;
  const BUILD_CONFIG_PATH = `${cacheDir}/buildConfig-${NS}.json`;
  if (!isCacheExpired(BUILD_CONFIG_TIME_NAME) && isFileExist(BUILD_CONFIG_PATH)) {
    return require(BUILD_CONFIG_PATH);
  }
  if (apis.buildConfig) {
    const { url, method = "get", params = {} } = apis.buildConfig;
    _buildConfig = (await request[method]({
      url,
      data: params
    })).data || {};
  } else if (config.apolloConfig) {
    let apolloConfig;
    if (typeof config.apolloConfig === "string") {
      try {
        apolloConfig = JSON.parse(config.apolloConfig);
      } catch (e) {
        return;
      }
    } else {
      apolloConfig = config.apolloConfig;
    }
    _buildConfig = (await apollo.remoteConfigService(apolloConfig)).content || {};
  }
  await updateCacheTime(BUILD_CONFIG_TIME_NAME);
  await writeFile(BUILD_CONFIG_PATH, JSON.stringify(_buildConfig));
  return _buildConfig;
}
module.exports = getBuildConfig;

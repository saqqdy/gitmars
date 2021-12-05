'use strict';

const path = require("path");
const apollo = require("node-apollo");
const sh = require("shelljs");
const { red } = require("colors");
const { writeFile, isFileExist } = require("../utils/file");
const { isCacheExpired, updateCacheTime } = require("../cache/cache");
const getConfig = require("../getConfig");
async function getApolloConfig() {
  const cacheDir = path.join(__dirname, "../../../cache");
  const config = getConfig();
  if (!config.apolloConfig) {
    sh.echo(red("\u8BF7\u914D\u7F6Eapollo"));
    process.exit(0);
    return;
  }
  const { appId, clusterName } = config.apolloConfig;
  const BUILD_CONFIG_TIME_NAME = `buildConfigTime-${appId}-${clusterName}`;
  const BUILD_CONFIG_PATH = `${cacheDir}/buildConfig-${appId}-${clusterName}.json`;
  let apolloConfig;
  if (!isCacheExpired(BUILD_CONFIG_TIME_NAME) && isFileExist(BUILD_CONFIG_PATH)) {
    return require(BUILD_CONFIG_PATH);
  }
  if (typeof config.apolloConfig === "string") {
    try {
      apolloConfig = JSON.parse(config.apolloConfig);
    } catch (e) {
      return;
    }
  } else {
    apolloConfig = config.apolloConfig;
  }
  const result = await apollo.remoteConfigService(apolloConfig);
  await updateCacheTime(BUILD_CONFIG_TIME_NAME);
  await writeFile(BUILD_CONFIG_PATH, JSON.stringify(result.content));
  return result.content;
}
module.exports = getApolloConfig;

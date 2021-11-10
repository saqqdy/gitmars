'use strict';

const path = require("path");
const apollo = require("node-apollo");
const sh = require("shelljs");
const { isCacheExpired, updateCacheTime } = require("./cacheControl");
const { error, writeFile } = require("./index");
const getConfig = require("./getConfig");
async function apolloConfig() {
  const cacheDir = path.join(__dirname, "../../cache");
  let apolloConfig2;
  if (!isCacheExpired("buildConfigTime") && sh.test("-f", cacheDir + "/buildConfig.json")) {
    return require(cacheDir + "/buildConfig.json");
  }
  const config = getConfig();
  if (!config.apolloConfig) {
    sh.echo(error("\u8BF7\u914D\u7F6Eapollo"));
    sh.exit(0);
    return;
  }
  if (typeof config.apolloConfig === "string") {
    try {
      apolloConfig2 = JSON.parse(config.apolloConfig);
    } catch (e) {
      return;
    }
  } else {
    apolloConfig2 = config.apolloConfig;
  }
  const result = await apollo.remoteConfigService(apolloConfig2);
  await updateCacheTime("buildConfigTime");
  await writeFile(cacheDir + "/buildConfig.json", JSON.stringify(result.content));
  return result.content;
}
module.exports = apolloConfig;

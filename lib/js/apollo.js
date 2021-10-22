'use strict';

const path = require("path");
const apollo = require("node-apollo");
const sh = require("shelljs");
const { error, writeFile } = require("./index");
const getConfig = require("./getConfig");
async function apolloConfig() {
  const cacheDir = path.join(__dirname, "../../cache");
  const now = new Date().getTime();
  let apolloConfig2;
  if (sh.test("-f", cacheDir + "/buildConfig.json")) {
    const fileDate = parseInt(sh.cat(cacheDir + "/buildConfig.txt").stdout);
    if (now - fileDate < 24 * 60 * 60 * 1e3)
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
  await writeFile(cacheDir + "/buildConfig.txt", String(now));
  await writeFile(cacheDir + "/buildConfig.json", JSON.stringify(result.content));
  return result.content;
}
module.exports = apolloConfig;

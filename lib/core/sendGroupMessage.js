'use strict';

const sh = require("shelljs");
require("./request");
const getApolloConfig = require("./build/getApolloConfig");
const { error, success } = require("./utils/colors");
async function sendGroupMessage(message, cfg = {}) {
  const config = await getApolloConfig();
  const { silent = true, url } = cfg;
  let urls = [];
  if (!config.gitNotificationGroupUrl && !url) {
    sh.echo(error("\u6CA1\u6709\u914D\u7F6E\u7FA4\u6D88\u606F\u63A8\u9001\u5730\u5740"));
    return;
  }
  if (url)
    urls = [url];
  else if (config.gitNotificationGroupUrl) {
    if (typeof config.gitNotificationGroupUrl === "string")
      urls = [config.gitNotificationGroupUrl];
    else
      urls = config.gitNotificationGroupUrl;
  }
  message = message.replace(/\s/g, "");
  urls.forEach(async (item) => {
    sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"${message}\\"}" "${item || config.gitNotificationGroupUrl}"`, { silent });
  });
}
module.exports = sendGroupMessage;

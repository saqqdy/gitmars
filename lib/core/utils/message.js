'use strict';

const sh = require("shelljs");
const { error } = require("./colors");
const mapTemplate = require("./mapTemplate");
const getGitConfig = require("../git/getGitConfig");
const getGitRevParse = require("../git/getGitRevParse");
const getConfig = require("../getConfig");
function getMessage(type) {
  const { root } = getGitRevParse();
  const { appName } = getGitConfig();
  const config = getConfig();
  const d = new Date();
  let str = "";
  switch (type) {
    case "time":
      str = d.toLocaleString();
      break;
    case "timeNum":
      str = String(d.getTime());
      break;
    case "pwd":
      str = root;
      break;
    case "project":
      str = appName;
      break;
    case "user":
      str = config.user;
      break;
  }
  return str;
}
function postMessage(msg = "") {
  const config = getConfig();
  if (!config.msgTemplate) {
    sh.echo(error("\u8BF7\u914D\u7F6E\u6D88\u606F\u53D1\u9001api\u6A21\u677F\u5730\u5740"));
    return;
  }
  const message = mapTemplate(config.msgTemplate, (key) => {
    if (key === "message")
      return msg;
    return getMessage(key);
  });
  config.msgUrl && message && sendMessage(message);
}
function sendMessage(message = "", cfg = {}) {
  const config = getConfig();
  const { silent = true } = cfg;
  if (!config.msgUrl) {
    sh.echo(error("\u8BF7\u914D\u7F6E\u6D88\u606F\u63A8\u9001\u5730\u5740"));
    return;
  }
  message = message.replace(/\s/g, "");
  config.msgUrl && sh.exec(`curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`, { silent });
}
module.exports = {
  getMessage,
  postMessage,
  sendMessage
};

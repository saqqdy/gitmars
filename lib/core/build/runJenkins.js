'use strict';

const sh = require("shelljs");
const getApolloConfig = require("./getApolloConfig");
const { mapTemplate } = require("../index");
const { error, success } = require("../utils/colors");
async function runJenkins({
  env,
  project,
  app = "all"
}) {
  const buildConfig = await getApolloConfig();
  const cfg = buildConfig[env];
  let p;
  if (!cfg) {
    sh.echo(error("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u73AF\u5883\u540D\u79F0"));
    sh.exit(1);
    return;
  }
  p = cfg.list.find((el) => el.name === project);
  if (!p) {
    sh.echo(error("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u9879\u76EE\u540D\u79F0"));
    sh.exit(1);
    return;
  }
  if (app && p.apps) {
    let appList = app.split(",");
    for (const item of appList) {
      if (!p.apps.includes(item)) {
        sh.echo(error("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5E94\u7528\u540D\u79F0"));
        sh.exit(1);
        return;
      }
    }
  }
  if (!buildConfig.template) {
    sh.echo(error("\u8BF7\u914D\u7F6EJenkins\u6784\u5EFA\u5730\u5740\u6A21\u677F"));
    sh.exit(1);
    return;
  }
  const url = mapTemplate(p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template, {
    line: cfg.line,
    project: p.project,
    token: cfg.token,
    app
  });
  sh.exec(`curl -u ${buildConfig.username}:${buildConfig.password} "${url}"`, { silent: true });
  sh.echo(success("\u6210\u529F\u8C03\u8D77Jenkins\u6784\u5EFA"));
}
module.exports = runJenkins;

'use strict';

const sh = require("shelljs");
const { green, red } = require("colors");
const request = require("../request");
const getApolloConfig = require("./getApolloConfig");
const mapTemplate = require("../utils/mapTemplate");
const { debug } = require("../utils/debug");
async function runJenkins({
  env,
  project,
  app = "all"
}) {
  const buildConfig = await getApolloConfig();
  const cfg = buildConfig[env];
  debug("runJenkins-buildConfig", env, project, app, buildConfig);
  if (!cfg) {
    sh.echo(red("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u73AF\u5883\u540D\u79F0"));
    process.exit(1);
    return;
  }
  const p = cfg.list.find((el) => el.name === project);
  if (!p) {
    sh.echo(red("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u9879\u76EE\u540D\u79F0"));
    process.exit(1);
    return;
  }
  if (app && p.apps) {
    const appList = app.split(",");
    for (const item of appList) {
      if (!p.apps.includes(item)) {
        sh.echo(red("\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u5E94\u7528\u540D\u79F0"));
        process.exit(1);
        return;
      }
    }
  }
  if (!buildConfig.template) {
    sh.echo(red("\u8BF7\u914D\u7F6EJenkins\u6784\u5EFA\u5730\u5740\u6A21\u677F"));
    process.exit(1);
    return;
  }
  const url = mapTemplate(p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template, {
    line: cfg.line,
    project: p.project,
    token: cfg.token,
    app
  });
  const auth = `Basic ${Buffer.from(buildConfig.username + ":" + buildConfig.password).toString("base64")}`;
  await request.get({
    url,
    headers: { Authorization: auth }
  }).then(() => {
    sh.echo(green("\u6210\u529F\u8C03\u8D77Jenkins\u6784\u5EFA"));
  });
}
module.exports = runJenkins;

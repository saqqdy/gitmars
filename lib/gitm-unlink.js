#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/unlink");
const { createArgs } = require("./core/utils/command");
const { spawnSync } = require("./core/spawn");
program.name("gitm unlink").usage("[name]").description("\u89E3\u9664\u672C\u5730\u5305\u94FE\u63A5");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((name) => {
  const isLink = sh.test("-L", `./node_modules/${name}`);
  const isExist = sh.test("-e", `./node_modules/${name}_bak`);
  const npmClient = sh.which("yarn") ? "yarn" : "npm";
  if (!name) {
    spawnSync(npmClient, ["unlink"]);
    sh.echo("\u5904\u7406\u5B8C\u6210");
    process.exit(0);
  } else if (isLink) {
    spawnSync(npmClient, ["unlink", name]);
  } else {
    sh.echo("\u6CA1\u6709\u627E\u5230\u8F6F\u94FE\uFF0C\u8BF7\u786E\u8BA4\u8F93\u5165\u6B63\u786E\u540D\u79F0");
  }
  if (isExist) {
    sh.mv(`./node_modules/${name}_bak`, `./node_modules/${name}`);
  }
  sh.echo("\u5904\u7406\u5B8C\u6210");
});
program.parse(process.argv);

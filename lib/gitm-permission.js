#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { red } = require("colors");
const { getCurrentBranch } = require("./core/git/index");
const getConfig = require("./core/getConfig");
const { spawnSync } = require("./core/spawn");
const config = getConfig();
program.name("gitm permission").usage("[message] [--no-verify] [--dev] [--release]").arguments("[message]").description("\u6821\u9A8C\u63D0\u4EA4\u6743\u9650").option("--no-verify", "\u662F\u5426\u9700\u8981\u8DF3\u8FC7\u6821\u9A8C\u6743\u9650", false).option("--dev", "\u662F\u5426\u9650\u5236dev\u63D0\u4EA4", false).option("--release", "\u662F\u5426\u9650\u5236release\u63D0\u4EA4", false).action((message, opt) => {
  console.info("gitm permission is running");
  const current = getCurrentBranch();
  const allow = [config.master];
  const { stdout } = spawnSync("git", ["show"]);
  if (opt.dev)
    allow.push(config.develop);
  if (opt.release)
    allow.push(config.release);
  const index = allow.indexOf(current);
  if (index > -1 && !opt.noVerify && stdout && stdout.indexOf("Merge:") === -1 && stdout.indexOf("Merge branch") === -1) {
    sh.echo(red(`${allow[index]}\u5206\u652F\u4E0D\u5141\u8BB8\u76F4\u63A5\u63D0\u4EA4`));
    process.exit(1);
  } else {
    process.exit(0);
  }
});
program.parse(process.argv);

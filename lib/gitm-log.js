#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/log");
const { error, getLogs, isGitProject } = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm log").usage("[branche] [--lastet [lastet]] [--limit [limit]]").description("\u65E5\u5FD7\u67E5\u8BE2");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (branche, opt) => {
  const logs = getLogs({
    lastet: opt.lastet,
    limit: opt.limit,
    branches: branche
  });
  console.log(logs);
  sh.exit(1);
});
program.parse(process.argv);

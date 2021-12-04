#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/log");
const { getIsGitProject, getGitLogs } = require("./core/git/index");
const { error } = require("./core/utils/index");
const { createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm log").usage("[branch] [--lastet [lastet]] [--limit [limit]]").description("\u65E5\u5FD7\u67E5\u8BE2");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (branch, opt) => {
  const logs = getGitLogs({
    lastet: opt.lastet,
    limit: opt.limit,
    branches: branch
  });
  console.info(logs);
  process.exit(0);
});
program.parse(process.argv);

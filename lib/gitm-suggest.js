#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { yellow, red } = require("colors");
const { options, args } = require("./conf/suggest");
require("./core/queue");
const { getIsGitProject, getCurrentBranch } = require("./core/git/index");
const { createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm suggest").usage("[message] [index] [-k --keep [keep]]").description("\u6062\u590D\u6682\u5B58\u533A\u6587\u4EF6");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((message, index, opt) => {
});
program.parse(process.argv);

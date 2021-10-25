#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
sh.config.execPath = sh.which("node").toString();
const { options, args } = require("./conf/continue");
const { error, queue, getCache, isGitProject } = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm continue").usage("[-l --list]").description("\u7EE7\u7EED\u672A\u5B8C\u6210\u7684\u64CD\u4F5C");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((opt) => {
  const cmd = getCache();
  if (opt.list) {
    sh.echo(cmd);
    sh.exit(0);
  }
  if (cmd.length > 0) {
    queue(cmd);
  } else {
    sh.echo(error("\u961F\u5217\u91CC\u9762\u6CA1\u6709\u672A\u6267\u884C\u7684\u6307\u4EE4"));
  }
});
program.parse(process.argv);

#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const columnify = require("columnify");
const { red, green, cyan, blue, yellow } = require("colors");
const { options, args } = require("./conf/log");
const getIsGitProject = require("./core/git/getIsGitProject");
const getGitLogs = require("./core/git/getGitLogs");
const { createArgs } = require("./core/utils/command");
const echo = require("./core/utils/echo");
if (!getIsGitProject()) {
  echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm log").usage("[branch] [--lastet [lastet]] [--limit [limit]] [--no-merges] [--json]").description("\u65E5\u5FD7\u67E5\u8BE2");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (branch, opt) => {
  const logs = getGitLogs({
    lastet: opt.lastet,
    limit: opt.limit,
    branch,
    noMerges: !opt.merges
  });
  if (opt.json) {
    console.info(logs);
  } else {
    const data = logs.map((log) => ({
      commit: cyan(log["%h"]),
      merge: cyan(log["%p"]),
      title: green(log["%s"]),
      author: yellow(log["%an"]),
      date: blue(dayjs(log["%aI"]).format("YYYY/MM/DD HH:mm:ss"))
    }));
    echo(columnify(data));
  }
  process.exit(0);
});
program.parse(process.argv);

#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/get");
const { queue, getStashList } = require("./core/index");
const { getIsGitProject, getCurrentBranch } = require("./core/git/index");
const { error, warning, createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm get").usage("[message] [index] [-k --keep [keep]]").description("\u6062\u590D\u6682\u5B58\u533A\u6587\u4EF6");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (message, index, opt) => {
  if (!message)
    message = getCurrentBranch();
  const list = await getStashList(message);
  if (list.length === 0) {
    sh.echo(warning("\u8BE5\u5206\u652F\u6CA1\u6709\u6682\u5B58\u4EFB\u4F55\u6587\u4EF6\uFF01"));
    sh.exit(0);
  }
  if (index === void 0 && list.length > 1)
    sh.echo(warning(`\u8BE5\u5206\u652F\u4E0B\u6709${list.length}\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u9ED8\u8BA4\u6062\u590D\u6700\u8FD1\u7684\u4E00\u6761\u8BB0\u5F55`));
  if (list.length > 2)
    sh.echo(warning(`\u8BE5\u5206\u652F\u4E0B\u6709${list.length}\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u5EFA\u8BAE\u5B9A\u671F\u6E05\u7406\u4E0D\u5FC5\u8981\u7684\u6682\u5B58\u8BB0\u5F55\uFF01`));
  queue([
    {
      cmd: `git stash ${opt.keep ? "apply" : "pop"} ${list[index || 0].key}`,
      config: {
        again: opt.keep ? false : `git stash drop ${list[index || 0].key}`,
        success: "\u6587\u4EF6\u6062\u590D\u6210\u529F",
        fail: "\u6062\u590D\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u51B2\u7A81"
      }
    },
    "git reset -q HEAD -- ."
  ]);
});
program.parse(process.argv);

#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { green, yellow, red } = require("colors");
const inquirer = require("inquirer");
const { options, args } = require("./conf/continue");
const { queue } = require("./core/queue");
const { getCommandCache, cleanCommandCache } = require("./core/cache/index");
const { getIsGitProject, getGitStatus } = require("./core/git/index");
const { createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm continue").usage("[-l --list]").description("\u7EE7\u7EED\u672A\u5B8C\u6210\u7684\u64CD\u4F5C");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  const sum = getGitStatus();
  const cmd = getCommandCache();
  if (opt.list) {
    sh.echo(cmd);
    process.exit(0);
  }
  if (cmd.length > 0) {
    if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
      await inquirer.prompt({
        type: "confirm",
        name: "value",
        message: "\u68C0\u6D4B\u5230\u6709\u672A\u63D0\u4EA4\u7684\u6587\u4EF6\uFF0C\u5728\u5408\u5E76\u5206\u652F\u7684\u8FC7\u7A0B\u9047\u5230\u51B2\u7A81\uFF0C\u9700\u8981\u5728\u5904\u7406\u51B2\u7A81\u540E\u6267\u884C\u4E00\u4E0B git add . \u548C git commit ,\u7136\u540E\u518D\u6267\u884C gitm continue\u3002\u662F\u5426\u8981\u5F3A\u5236\u7EE7\u7EED\u6267\u884C\u811A\u672C\uFF1F",
        default: false
      }).then((answers) => {
        if (!answers.value) {
          sh.echo(green("\u5DF2\u9000\u51FA"));
          process.exit(0);
        }
      });
    } else if (sum["??"].length > 0) {
      sh.echo(yellow("\u68C0\u6D4B\u5230\u6709\u672A\u52A0\u5165\u7248\u672C\u7684\u6587\u4EF6\uFF0C\u8BF7\u7559\u610F\uFF01"));
    }
    queue(cmd).then(() => {
      cleanCommandCache();
    });
  } else {
    sh.echo(red("\u961F\u5217\u91CC\u9762\u6CA1\u6709\u672A\u6267\u884C\u7684\u6307\u4EE4"));
  }
});
program.parse(process.argv);

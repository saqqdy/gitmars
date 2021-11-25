#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/save");
const { queue } = require("./core/queue");
const getIsGitProject = require("./core/git/getIsGitProject");
const getCurrentBranch = require("./core/git/getCurrentBranch");
const { error } = require("./core/utils/colors");
const { createArgs } = require("./core/utils/command");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm save").usage("[message] [-f --force]").description("\u6682\u5B58\u5F53\u524D\u5206\u652F\u6587\u4EF6");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((message, opt) => {
  if (!message)
    message = getCurrentBranch();
  let cmd = [
    {
      cmd: `git stash save "${message}"`,
      config: { success: "\u6587\u4EF6\u6682\u5B58\u6210\u529F", fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458" }
    }
  ];
  if (opt.force) {
    cmd = [
      "git add .",
      {
        cmd: `git stash save "${message}"`,
        config: {
          success: "\u6587\u4EF6\u6682\u5B58\u6210\u529F",
          fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"
        }
      }
    ];
  }
  queue(cmd);
});
program.parse(process.argv);

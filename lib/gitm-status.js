#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const columnify = require("columnify");
const { yellow, red, cyan, green } = require("colors");
const { options, args } = require("./conf/status");
const getIsGitProject = require("./core/git/getIsGitProject");
const getCurrentBranch = require("./core/git/getCurrentBranch");
const getGitStatus = require("./core/git/getGitStatus");
const { createArgs } = require("./core/utils/command");
const echo = require("./core/utils/echo");
if (!getIsGitProject()) {
  echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm status").usage("[-k --keep [keep]]").description("\u6062\u590D\u6682\u5B58\u533A\u6587\u4EF6");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(() => {
  const current = getCurrentBranch();
  const status = getGitStatus();
  const data = [];
  let num = Math.max(status["??"].length, status["A"].length, status["M"].length, status["D"].length, status["UU"].length);
  while (num--) {
    data.unshift({
      added: yellow(status["A"][num] || ""),
      modified: green(status["M"][num] || ""),
      deleted: red(status["D"][num] || ""),
      unmerged: red(status["UU"]),
      untracked: cyan(status["??"][num] || "")
    });
  }
  echo(green(`\u5F53\u524D\u5206\u652F\uFF1A${current}
`));
  echo(columnify(data));
});
program.parse(process.argv);

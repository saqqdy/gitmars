#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/branch");
const { queue } = require("./core/queue");
const {
  searchBranches,
  getIsGitProject,
  getIsBranchOrCommitExist
} = require("./core/git/index");
const { success, error, createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm branch").usage("[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [--exclude [exclude]] [--include [include]] [-r --remote [remote]] [-D --forcedelete [branch]] [-u --upstream [upstream]]").description("\u5206\u652F\u67E5\u8BE2\u3001\u5220\u9664\uFF08\u6CE8\u610F\u8BE5\u6307\u4EE4\u4E0D\u7528\u4E8E\u521B\u5EFA\u5206\u652F\uFF0C\u5982\u9700\u521B\u5EFA\u5206\u652F\u8BF7\u8D70start\u6D41\u7A0B\uFF09");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((opt) => {
  const cmd = [];
  const isBranchExist = getIsBranchOrCommitExist(opt.delete);
  if (opt.delete) {
    if (isBranchExist)
      cmd.push(`git branch -d ${opt.delete}`);
    if (opt.remote)
      cmd.push(`git push origin --delete ${opt.delete}`);
  } else if (opt.forcedelete) {
    if (isBranchExist)
      cmd.push(`git branch -D ${opt.forcedelete}`);
    if (opt.remote)
      cmd.push(`git push origin --delete ${opt.delete}`);
  } else if (opt.upstream) {
    if (typeof opt.upstream === "string") {
      cmd.push(`git branch --set-upstream-to origin/${opt.upstream}`);
    } else {
      cmd.push("git branch --unset-upstream");
    }
  } else {
    const branches = searchBranches({
      remote: opt.remote,
      type: opt.type,
      key: opt.key,
      exclude: opt.exclude,
      include: opt.include
    });
    sh.echo(success(branches.join("\n")));
    return;
  }
  queue(cmd);
});
program.parse(process.argv);

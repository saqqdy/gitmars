#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const inquirer = require("inquirer");
const ora = require("ora");
const { options, args } = require("./conf/cleanbranch");
const {
  getIsGitProject,
  searchBranches,
  getCurrentBranch,
  getIsMergedTargetBranch,
  getIsBranchOrCommitExist
} = require("./core/git/index");
const { error, success, createArgs, delay } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./core/getConfig");
const config = getConfig();
function getIsMergedTarget(branch, targets, remote) {
  branch = remote ? "origin/" + branch : branch;
  if (typeof targets === "string")
    targets = [targets];
  for (const target of targets) {
    const isMerged = getIsMergedTargetBranch(branch, target, remote);
    if (!isMerged)
      return false;
  }
  return true;
}
program.name("gitm cleanbranch").usage("[branches...] [-l --list [list]] [-k --key [keyword]] [--exclude [exclude]] [--include [include]] [-t --type [type]] [--target [target]] [-r --remote]").description("\u6E05\u7406\u5408\u5E76\u8FC7\u7684\u529F\u80FD\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (branches, opt) => {
  const spinner = ora();
  spinner.color = "green";
  const current = getCurrentBranch();
  const targets = opt.target ? opt.target.split(",") : [config.develop, config.release];
  sh.exec("git fetch", { silent: true });
  current !== config.develop && sh.exec(`git checkout ${config.develop}`, { silent: true });
  if (branches.length === 0) {
    branches = searchBranches({
      remote: opt.remote,
      type: opt.type,
      key: opt.key,
      exclude: opt.exclude,
      include: opt.include
    });
  }
  const _willDeleteBranch = [];
  if (branches.length > 0) {
    if (!opt.list && !opt.confirm) {
      await inquirer.prompt({
        type: "confirm",
        name: "value",
        message: "\u5373\u5C06\u5F00\u59CB\u6279\u91CF\u5220\u9664\u5206\u652F\uFF0C\u662F\u5426\u7EE7\u7EED\uFF1F",
        default: false
      }).then((answers) => {
        if (!answers.value) {
          sh.echo(success("\u5DF2\u9000\u51FA"));
          sh.exit(0);
        }
      });
    }
  } else {
    sh.echo(success("\u6CA1\u6709\u67E5\u8BE2\u5230\u4EFB\u4F55\u5206\u652F"));
    sh.exit(0);
  }
  for (const branch of branches) {
    if ([
      config.master,
      config.develop,
      config.release,
      config.bugfix,
      config.support
    ].includes(branch)) {
      continue;
    }
    spinner.start(success(`\u5F00\u59CB\u5206\u6790\uFF1A${branch}`));
    const isMerged = getIsMergedTarget(branch, targets, opt.remote);
    if (!isMerged) {
      spinner.fail();
      continue;
    }
    _willDeleteBranch.push(branch);
    await delay(200);
    spinner.succeed();
    if (opt.list) {
      continue;
    }
    const removeLocal = getIsBranchOrCommitExist(branch);
    const removeRemote = opt.remote && getIsBranchOrCommitExist(branch, true);
    if (removeLocal || removeRemote) {
      spinner.start(success(`\u6B63\u5728\u5220\u9664\uFF1A${branch}`));
      await delay(200);
      spinner.succeed();
    }
    if (removeLocal) {
      sh.exec(`git branch -D ${branch}`, { silent: true });
    }
    if (removeRemote) {
      sh.exec(`git push origin --delete ${branch}`, {
        silent: true
      });
    }
  }
  spinner.stop();
  if (opt.list) {
    if (_willDeleteBranch.length > 0) {
      sh.echo(success(`\u5206\u6790\u5B8C\u6210\uFF0C\u4EE5\u4E0B\u5206\u652F\u5408\u5E76\u8FC7${targets.join(",")}\u5206\u652F\uFF0C\u53EF\u4EE5\u6E05\u7406\uFF1A`));
      console.info("\n" + success(_willDeleteBranch.join(" ") + "\n"));
    } else {
      sh.echo(success("\u5206\u6790\u5B8C\u6210\uFF0C\u6CA1\u6709\u5206\u652F\u9700\u8981\u6E05\u7406"));
    }
  } else {
    sh.echo(success("\u5220\u9664\u5B8C\u6210"));
  }
});
program.parse(process.argv);

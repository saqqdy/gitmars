#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const inquirer = require("inquirer");
const { options, args } = require("./conf/cleanbranch");
const {
  error,
  success,
  isGitProject,
  getCurrent,
  searchBranches,
  delay
} = require("./js/index");
const getIsMergedTargetBranch = require("./js/branch/getIsMergedTargetBranch");
const getIsBranchOrCommitExist = require("./js/branch/getIsBranchOrCommitExist");
const ora = require("ora");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./js/getConfig");
const config = getConfig();
program.name("gitm cleanbranch").usage("[-l --list [list]] [--except [exception]] [-t --type [type]] [-r --remote]").description("\u6E05\u7406\u5408\u5E76\u8FC7\u7684\u529F\u80FD\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  const spinner = ora();
  spinner.color = "green";
  const current = getCurrent();
  sh.exec(`git fetch`, { silent: true });
  current !== config.develop && sh.exec(`git checkout ${config.develop}`, { silent: true });
  const branches = searchBranches({
    remote: opt.remote,
    type: opt.type,
    except: opt.except
  });
  let _willDeleteBranch = [];
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
    const branchName = opt.remote ? "origin/" + branch : branch;
    if ([
      config.master,
      config.develop,
      config.release,
      config.bugfix,
      config.support
    ].includes(branch) || branch.indexOf("/") === -1) {
      continue;
    }
    spinner.start(success(`\u5F00\u59CB\u5206\u6790\uFF1A${branch}`));
    const isMergedDev = getIsMergedTargetBranch(branchName, config.dev, opt.remote);
    if (!isMergedDev) {
      spinner.fail();
      continue;
    }
    const isMergedRelease = getIsMergedTargetBranch(branchName, config.release, opt.remote);
    if (!isMergedRelease) {
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
    return;
  }
  spinner.stop();
  if (opt.list) {
    sh.echo(success("\u5206\u6790\u5B8C\u6210\uFF0C\u627E\u5230\u4E86\u4EE5\u4E0B\u5206\u652F\uFF1A"));
    console.info(_willDeleteBranch);
  } else {
    sh.echo(success("\u5220\u9664\u5B8C\u6210"));
  }
});
program.parse(process.argv);

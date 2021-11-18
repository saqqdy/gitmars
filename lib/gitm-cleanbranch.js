#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const inquirer = require("inquirer");
const { options, args } = require("./conf/cleanbranch");
const { error, success, isGitProject, searchBranchs } = require("./js/index");
const getIsMergedTargetBranch = require("./js/branch/getIsMergedTargetBranch");
const getIsBranchOrCommitExist = require("./js/branch/getIsBranchOrCommitExist");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./js/getConfig");
const config = getConfig();
program.name("gitm cleanbranch").usage("[-f --force]").description("\u6682\u5B58\u5F53\u524D\u5206\u652F\u6587\u4EF6");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  sh.exec(`git fetch`, { silent: true });
  sh.exec(`git checkout ${config.develop}`, { silent: true });
  const branchs = searchBranchs({
    remote: opt.remote,
    local: !opt.remote,
    type: opt.type,
    except: opt.except
  });
  if (branchs.length > 0) {
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
  for (const branch of branchs) {
    const branchName = branch.replace(/^origin\//, "");
    const isMergedDev = getIsMergedTargetBranch(branch, config.dev, opt.remote);
    if (!isMergedDev)
      continue;
    const isMergedRelease = getIsMergedTargetBranch(branch, config.release, opt.remote);
    if (!isMergedRelease)
      continue;
    sh.exec(`git branch -D ${branchName}`, { silent: true });
    if (opt.remote && getIsBranchOrCommitExist(branchName, true)) {
      sh.exec(`git push origin --delete ${branchName}`, {
        silent: true
      });
    }
  }
});
program.parse(process.argv);

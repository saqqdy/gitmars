#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/hook");
const {
  error,
  success,
  getCurrent,
  getBranchsFromID,
  isGitProject
} = require("./js/index");
const { createArgs } = require("./js/tools");
const getIsMergedTargetBranch = require("./js/branch/getIsMergedTargetBranch");
const getIsUpdatedInTime = require("./js/branch/getIsUpdatedInTime");
const getIsMergeAction = require("./js/branch/getIsMergeAction");
const getBehindLogs = require("./js/branch/getBehindLogs");
const { init, remove } = require("./js/hook/index");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./js/getConfig");
const config = getConfig();
program.name("gitm hook").usage("[command] [args...] [--no-verify] [--lastet [lastet]] [--limit [limit]] [-t --type <type>] [--branch [branch]]").description("git hook\u94A9\u5B50");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (command, args2, opt) => {
  console.log("gitmars hooks is running");
  if (opt.noVerify) {
    sh.exit(0);
    return;
  }
  if (command === "init") {
    init();
  } else if (command === "remove") {
    remove();
  } else {
    const types = opt.type ? opt.type.split(",") : [];
    const mainBranchs = [
      config.master,
      config.develop,
      config.release,
      config.support,
      config.bugfix
    ];
    const current = getCurrent();
    console.log(types, process.env, process.argv, getBranchsFromID("2080d17e"));
    if (current !== config.develop && mainBranchs.includes(current) && types.includes("1")) {
      const [command2, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(" ") : [];
      if (command2 === "merge") {
        const isMergedBranch = getIsMergedTargetBranch(branch, config.develop);
        if (!isMergedBranch) {
          console.info(error("\u68C0\u6D4B\u5230\u4F60\u7684\u5206\u652F\u6CA1\u6709\u5408\u5E76\u8FC7" + config.develop));
          sh.exit(0);
        } else {
          console.info(success(branch + "\u5408\u5E76\u8FC7" + config.develop));
        }
      }
    }
    if (mainBranchs.includes(current) && types.includes("2")) {
      const [command2, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(" ") : [];
      const branchPrefix = branch.split("/")[0];
      if (command2 === "merge") {
        const isUpdatedInTime = getIsUpdatedInTime({
          lastet: opt.lastet,
          branch
        });
        if (!isUpdatedInTime) {
          console.info(error("\u68C0\u6D4B\u5230\u4F601\u5468\u5185\u6CA1\u6709\u540C\u6B65\u8FC7\u4E3B\u5E72" + branchPrefix + "\u5206\u652F\u4EE3\u7801"));
          sh.exit(0);
        } else {
          console.info(success(branch + "\u4E00\u5468\u5185\u540C\u6B65\u8FC7\u4E3B\u5E72\u5206\u652F\u4EE3\u7801"));
        }
      }
    }
    if (mainBranchs.includes(current) && types.includes("3")) {
      const isMergeAction = getIsMergeAction();
      if (!isMergeAction) {
        console.info(error("\u68C0\u6D4B\u5230\u4F60\u76F4\u63A5\u5728\u4E3B\u5E72\u5206\u652F\u4FEE\u6539\u4EE3\u7801"));
        sh.exit(0);
      } else {
        console.info(success("\u6700\u540E\u4E00\u6761\u8BB0\u5F55\u662Fmerge\u8BB0\u5F55"));
      }
    }
    if (mainBranchs.includes(current) && types.includes("4")) {
      const behindLogs = getBehindLogs();
      if (!behindLogs.length) {
        console.info("\u4F60\u672C\u5730\u5206\u652F\u7248\u672C\u843D\u540E\u4E8E\u8FDC\u7A0B\u5206\u652F\uFF0C\u8BF7\u5148\u6267\u884Cpull");
        sh.exit(0);
      } else {
        console.info(success("\u672C\u5730\u7248\u672C\u6CA1\u6709\u843D\u540E\u8FDC\u7A0B\uFF0C\u53EF\u76F4\u63A5push"));
      }
    }
  }
  sh.exit(0);
});
program.parse(process.argv);

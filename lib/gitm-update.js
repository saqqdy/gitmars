#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/update");
const { queue } = require("./core/queue");
const {
  getIsGitProject,
  getCurrentBranch,
  checkGitStatus,
  searchBranches
} = require("./core/git/index");
const { error } = require("./core/utils/index");
const { isNeedUpgrade, upgradeGitmars } = require("./core/versionControl");
const { createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./core/getConfig");
const { defaults } = require("./core/global");
const config = getConfig();
program.name("gitm update").usage("[type] [name] [--use-merge] [--use-rebase] [-a --all]").description("\u66F4\u65B0bug\u4EFB\u52A1\u5206\u652F\u3001\u66F4\u65B0feature\u529F\u80FD\u5F00\u53D1\u5206\u652F\u3001\u6846\u67B6\u8C03\u6574\u5206\u652Fsupport");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (type, name, opt) => {
  const needUpgrade = await isNeedUpgrade();
  needUpgrade && upgradeGitmars();
  const allow = ["bugfix", "feature", "support"];
  const deny = [
    defaults.master,
    defaults.develop,
    defaults.release,
    defaults.bugfix,
    defaults.support
  ];
  const status = checkGitStatus();
  let cmds = [], branchList = [], _nameArr = [];
  if (!status)
    sh.exit(1);
  if (opt.all) {
    if (!type)
      type = allow.join(",");
    branchList = searchBranches({ type });
  } else if (!type || !name) {
    const current = getCurrentBranch();
    [type, ..._nameArr] = current.split("/");
    name = _nameArr.join("/");
    if (!name) {
      deny.includes(type) && sh.echo(error(`\u9A9A\u5E74\uFF0C\u4F60\u5728${type}\u5206\u652F\u6267\u884C\u8FD9\u4E2A\u6307\u4EE4\u662F\u4EC0\u4E48\u9A9A\u64CD\u4F5C\uFF1F`));
      sh.exit(1);
    }
    if (!allow.includes(type)) {
      sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(allow)));
      sh.exit(1);
    }
    branchList = [].concat(current);
  } else if (!allow.includes(type)) {
    sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(allow)));
    sh.exit(1);
  } else {
    branchList = [type + "/" + name];
  }
  branchList.forEach((branch) => {
    [type, ..._nameArr] = branch.split("/");
    name = _nameArr.join("/");
    const base = type === "bugfix" ? config.bugfix : type === "support" ? config.master : config.release;
    const cmd = [
      "git fetch",
      `git checkout ${base}`,
      "git pull",
      `git checkout ${type}/${name}`
    ];
    if (opt.useRebase) {
      cmd.push({
        cmd: `git rebase ${base}`,
        config: {
          again: false,
          success: `${base}\u66F4\u65B0\u5230${type}/${name}\u6210\u529F`,
          fail: `${base}\u66F4\u65B0\u5230${type}/${name}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
        }
      });
    } else {
      cmd.push({
        cmd: `git merge --no-ff ${base}`,
        config: {
          again: false,
          success: `${base}\u540C\u6B65\u5230${type}/${name}\u6210\u529F`,
          fail: `${base}\u540C\u6B65\u5230${type}/${name}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
        }
      });
    }
    cmds = cmds.concat(cmd);
  });
  queue(cmds);
});
program.parse(process.argv);

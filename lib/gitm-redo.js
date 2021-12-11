#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
const sh = require("shelljs");
const { yellow, blue, green, red } = require("colors");
const { options, args } = require("./conf/redo");
const { queue } = require("./core/queue");
const getIsGitProject = require("./core/git/getIsGitProject");
const getCurrentBranch = require("./core/git/getCurrentBranch");
const { getRevertCache, delRevertCache } = require("./core/cache/revertCache");
const { createArgs } = require("./core/utils/command");
const echo = require("./core/utils/echo");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm redo").usage("[commitid...] [-m --mode [mode]]").description("\u64A4\u9500\u4E00\u6B21\u63D0\u4EA4\u8BB0\u5F55");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (commitid, opt) => {
  const current = getCurrentBranch();
  let revertCache = getRevertCache(current), cmd = [], commitIDs = [], mode = "";
  mode = " -m " + Math.abs(Number(opt.mode || 1));
  if (commitid.length > 0) {
    revertCache = revertCache.filter((item) => commitid.some((id) => item.after["%H"].indexOf(id) > -1));
  }
  if (revertCache.length === 0) {
    echo(yellow("\u6CA1\u6709\u627E\u5230\u53EF\u6062\u590D\u7684\u64A4\u9500\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  const prompt = {
    type: "checkbox",
    message: "\u8BF7\u9009\u62E9\u8981\u6062\u590D\u7684\u64A4\u9500\u8BB0\u5F55",
    name: "commitIDs",
    choices: []
  };
  revertCache.forEach(({ after }, index) => {
    const _time = dayjs(after["%aI"]).format("YYYY/MM/DD HH:mm");
    prompt.choices.push({
      name: `${green(index + 1 + ".")} ${green(after["%s"])} | ${yellow(after["%an"])} | ${blue(_time)}`,
      value: after["%H"],
      checked: false
    });
  });
  commitIDs = (await inquirer.prompt(prompt)).commitIDs;
  if (commitIDs.length === 0) {
    echo(yellow("\u6CA1\u6709\u9009\u62E9\u4EFB\u4F55\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  revertCache = revertCache.filter((item) => commitIDs.includes(item.after["%H"]));
  cmd = revertCache.map((item) => ({
    cmd: `git revert -s --no-edit ${item.after["%H"]}${mode}`,
    config: {
      again: false,
      success: `\u64A4\u9500\u6210\u529F\uFF1A${item.after["%s"]}`,
      fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
    }
  }));
  queue(cmd).then(() => {
    delRevertCache(commitIDs);
  });
});
program.parse(process.argv);

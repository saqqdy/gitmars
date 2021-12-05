#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
const sh = require("shelljs");
const { yellow, blue, green, red } = require("colors");
const { options, args } = require("./conf/undo");
const { queue } = require("./core/queue");
const { getIsGitProject, getGitLogs } = require("./core/git/index");
const { getRevertCache, addRevertCache } = require("./core/cache/index");
const { createArgs, echo } = require("./core/utils/index");
const { spawnSync } = require("./core/spawn");
const GitLogsFormatter = require("./core/git/gitLogsFormatter");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
function getRevertCommitIDs(commitIDs) {
  const revertCache = getRevertCache();
  let len = commitIDs.length;
  while (len--) {
    const _index = revertCache.findIndex((item) => item.before["%H"] === commitIDs[len]);
    if (_index > -1) {
      echo(yellow(`\u68C0\u6D4B\u5230 ${commitIDs[len]} \u8FD9\u6761\u8BB0\u5F55\u64A4\u9500\u8FC7\u4E00\u6B21\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u6709\u8BEF\uFF01`));
      commitIDs.splice(len, 1);
    }
  }
  return commitIDs;
}
program.name("gitm undo").usage("[commitid...] [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]").description("\u64A4\u9500\u4E00\u6B21\u63D0\u4EA4\u8BB0\u5F55");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (commitid, opt) => {
  const formatter = new GitLogsFormatter();
  const keys = ["%H", "%T", "%P", "%aI", "%an", "%s", "%b"];
  let logList = [], cmd = [], commitIDs = [], mode = "";
  if (opt.mode)
    mode = " -m " + Math.abs(Number(opt.mode));
  if (commitid.length > 0) {
    const { stdout } = spawnSync("git", [
      "show",
      ...commitid,
      "--name-only",
      `--pretty=format:${formatter.getFormat(keys)}`
    ]);
    logList = formatter.getLogs(stdout);
  } else {
    logList = getGitLogs({
      lastet: opt.lastet,
      limit: opt.limit,
      noMerges: !opt.merges,
      keys
    });
    if (logList.length === 0) {
      echo(yellow('\u6CA1\u6709\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684commit\uFF0C\u8BF7\u9002\u5F53\u653E\u5BBD\u7B5B\u9009\u6761\u4EF6\uFF0C\u9ED8\u8BA4\uFF1A"--lastet=7d --limit=20"\u3002\u8FDB\u7A0B\u5DF2\u9000\u51FA'));
      process.exit(0);
    }
  }
  if (logList.length > 1) {
    const prompt = {
      type: "checkbox",
      message: "\u8BF7\u9009\u62E9\u8981\u64A4\u9500\u7684commit\u8BB0\u5F55",
      name: "commitIDs",
      choices: []
    };
    logList.forEach((log, index) => {
      const _time = dayjs(log["%aI"]).format("YYYY/MM/DD HH:mm");
      prompt.choices.push({
        name: `${green(index + 1 + ".")} ${green(log["%s"])} | ${yellow(log["%an"])} | ${blue(_time)}`,
        value: log["%H"],
        checked: false
      });
    });
    commitIDs = (await inquirer.prompt(prompt)).commitIDs;
  }
  if (commitIDs.length === 0) {
    echo(yellow("\u6CA1\u6709\u9009\u62E9\u4EFB\u52A1\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  commitIDs = getRevertCommitIDs(commitIDs);
  if (commitIDs.length === 0) {
    echo(yellow("\u6CA1\u6709\u53EF\u64A4\u9500\u7684\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  logList = logList.filter((log) => commitIDs.includes(log["%H"]));
  cmd = logList.map((log) => ({
    cmd: `git revert -s --no-edit ${log["%H"]}${mode}`,
    config: {
      again: true,
      success: `\u64A4\u9500\u6210\u529F\uFF1A${log["%s"]}`,
      fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
    }
  }));
  queue(cmd).then(() => {
    addRevertCache(logList);
  });
});
program.parse(process.argv);

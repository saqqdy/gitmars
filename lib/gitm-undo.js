#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const dayjs = require("dayjs");
const inquirer = require("inquirer");
const sh = require("shelljs");
const { yellow, blue, green, red } = require("colors");
const { options, args } = require("./conf/undo");
const { queue } = require("./core/queue");
const {
  getIsGitProject,
  getGitLogs,
  getGitLogsByCommitIDs,
  getCurrentBranch
} = require("./core/git/index");
const {
  getRevertCache,
  addRevertCache,
  setRevertCache
} = require("./core/cache/index");
const { createArgs, echo } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
function getRevertCommitIDs(commitIDs) {
  const revertCache = getRevertCache();
  const current = getCurrentBranch();
  let len = commitIDs.length;
  while (len--) {
    const _before = revertCache.findIndex((item) => item.branch === current && item.before["%H"] === commitIDs[len]);
    const _after = revertCache.findIndex((item) => item.branch === current && item.after["%H"] === commitIDs[len]);
    if (_before > -1 || _after > -1) {
      echo(yellow(_before > -1 ? `\u68C0\u6D4B\u5230 ${commitIDs[len]} \u8FD9\u6761\u8BB0\u5F55\u64A4\u9500\u8FC7\u4E00\u6B21\uFF0C\u8BF7\u68C0\u67E5\u662F\u5426\u6709\u8BEF\uFF01` : `\u68C0\u6D4B\u5230 ${commitIDs[len]} \u8FD9\u6761\u8BB0\u5F55\u662F\u4E00\u6761revert\u8BB0\u5F55\uFF0C\u8BF7\u4F7F\u7528gitm redo\u64CD\u4F5C\uFF01`));
      commitIDs.splice(len, 1);
    }
  }
  return commitIDs;
}
function calculate(all = false, opt) {
  const keys = ["%H", "%T", "%P", "%aI", "%an", "%s", "%b"];
  const revertCache = getRevertCache();
  const current = getCurrentBranch();
  let len = revertCache.length;
  while (len--) {
    const { before, after, branch } = revertCache[len];
    let _undoLogs = [], _redoLogs = [];
    if (!after) {
      const _logs = getGitLogs({
        lastet: opt.lastet,
        limit: opt.limit * 2,
        noMerges: true,
        keys,
        branch,
        grep: before["%H"]
      });
      if (_logs && _logs.length > 0)
        revertCache[len].after = _logs[0];
    }
    _undoLogs = getGitLogs({
      lastet: "60d",
      limit: 500,
      noMerges: true,
      keys,
      branch,
      grep: before["%H"]
    });
    if (after) {
      _redoLogs = getGitLogs({
        lastet: "60d",
        limit: 500,
        noMerges: true,
        keys,
        branch,
        grep: after["%H"]
      });
    }
    if (!all && current !== branch)
      continue;
    if (_undoLogs.length === 0 || _redoLogs.length > 0) {
      echo(yellow(_undoLogs.length === 0 ? `\u68C0\u6D4B\u5230 ${revertCache[len].before["%H"]} \u8FD9\u6761\u8BB0\u5F55\u64A4\u9500\u5931\u8D25\uFF0C\u5DF2\u5220\u9664\u76F8\u5173\u65E5\u5FD7` : `\u68C0\u6D4B\u5230 ${revertCache[len].before["%H"]} \u8FD9\u6761\u8BB0\u5F55\u5DF2\u7ECF\u88AB\u6062\u590D\u4E86\uFF0C\u5DF2\u5220\u9664\u76F8\u5173\u65E5\u5FD7`));
      revertCache.splice(len, 1);
    }
  }
  setRevertCache(revertCache);
}
program.name("gitm undo").usage("[commitid...] [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]").description("\u64A4\u9500\u4E00\u6B21\u63D0\u4EA4\u8BB0\u5F55");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (commitid, opt) => {
  const keys = ["%H", "%T", "%P", "%aI", "%an", "%s", "%b"];
  const current = getCurrentBranch();
  let logList = [], cmd = [], commitIDs = [], mode = "";
  if (opt.calc) {
    calculate(false, opt);
    return;
  }
  if (opt.calcAll) {
    calculate(true, opt);
    return;
  }
  if (!opt.limit)
    opt.limit = 20;
  if (opt.mode)
    mode = " -m " + Math.abs(Number(opt.mode));
  if (commitid.length > 0) {
    logList = getGitLogsByCommitIDs({ commitIDs: commitid, keys });
  } else {
    logList = getGitLogs({
      lastet: opt.lastet,
      limit: opt.limit,
      noMerges: !opt.merges,
      keys
    });
    if (logList.length === 0) {
      echo(yellow('\u6CA1\u6709\u627E\u5230\u7B26\u5408\u6761\u4EF6\u7684commit\u8BB0\u5F55\uFF0C\u8BF7\u9002\u5F53\u653E\u5BBD\u7B5B\u9009\u6761\u4EF6\uFF0C\u9ED8\u8BA4\uFF1A"--lastet=7d --limit=20"\u3002\u8FDB\u7A0B\u5DF2\u9000\u51FA'));
      process.exit(0);
    } else {
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
  }
  if (commitIDs.length === 0) {
    echo(yellow("\u6CA1\u6709\u9009\u62E9commit\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  commitIDs = getRevertCommitIDs(commitIDs);
  if (commitIDs.length === 0) {
    echo(yellow("\u6CA1\u6709\u53EF\u64A4\u9500\u7684\u8BB0\u5F55\uFF0C\u8FDB\u7A0B\u5DF2\u9000\u51FA"));
    process.exit(0);
  }
  logList = logList.filter((log) => commitIDs.some((id) => log["%H"].indexOf(id) > -1));
  cmd = logList.map((log) => ({
    cmd: `git revert -s --no-edit ${log["%H"]}${mode}`,
    config: {
      again: false,
      success: `\u64A4\u9500\u6210\u529F\uFF1A${log["%s"]}`,
      fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
    }
  }));
  const revertCacheList = logList.map((log) => {
    const cache = { before: log, after: null, branch: current };
    const _logs = getGitLogs({
      lastet: opt.lastet,
      limit: opt.limit * 2,
      noMerges: true,
      keys,
      branch: current,
      grep: log["%H"]
    });
    if (_logs.length > 0)
      cache.after = _logs[0];
    return cache;
  });
  addRevertCache(revertCacheList);
  queue(cmd).then(() => {
    calculate(false, opt);
  }).catch(() => {
    echo(yellow("\u5904\u7406\u51B2\u7A81\u4E4B\u540E\uFF0C\u6267\u884C\uFF1Agitm undo --calc"));
  });
});
program.parse(process.argv);

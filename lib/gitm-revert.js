#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { yellow, red } = require("colors");
const { options, args } = require("./conf/revert");
const { queue } = require("./core/queue");
const { getIsGitProject } = require("./core/git/index");
const { createArgs } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
program.name("gitm revert").usage("[commitid] [-n --number [number]] [-m --mode [mode]]").description("\u64A4\u9500\u4E00\u6B21\u63D0\u4EA4\u8BB0\u5F55");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((commitid, opt) => {
  const cmd = [];
  let n = "HEAD", m = "";
  if (opt.mode)
    m = " -m " + Math.abs(Number(opt.mode));
  if (opt.number) {
    const num = Math.abs(Number(opt.number));
    if (num > 1)
      n += "~" + (num - 1);
    cmd.push({
      cmd: `git revert ${n}${m}`,
      config: {
        again: true,
        success: "\u64A4\u9500\u6210\u529F",
        fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
      }
    });
  } else if (commitid) {
    cmd.push({
      cmd: `git revert ${commitid}${m}`,
      config: {
        again: true,
        success: "\u64A4\u9500\u6210\u529F",
        fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
      }
    });
  } else {
    sh.echo(yellow("\u6307\u4EE4\u4E0D\u5408\u6CD5"));
    process.exit(1);
  }
  queue(cmd);
});
program.parse(process.argv);

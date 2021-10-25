#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
sh.config.execPath = sh.which("node").toString();
const { options, args } = require("./conf/copy");
const {
  error,
  warning,
  queue,
  getStatus,
  getCurrent,
  isGitProject
} = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm copy").usage("<from> [commitid...] [-k --key [keyword]] [-a --author [author]]").description("cherry-pick\u6613\u7528\u7248\u672C\uFF0C\u4ECE\u67D0\u4E2A\u5206\u652F\u62F7\u8D1D\u67D0\u6761\u8BB0\u5F55\u5408\u5E76\u5230\u5F53\u524D\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((from, commitid, opts) => {
  const status = getStatus();
  const cur = getCurrent();
  if (!status)
    sh.exit(1);
  if (opts.key !== "" || opts.author !== "") {
    const cmd = [
      `git checkout ${from}`,
      `git log --grep=${opts.key} --author=${opts.author}`
    ];
    sh.echo(warning("\u4E3A\u786E\u4FDDcopy\u51C6\u786E\uFF0C\u8BF7\u5C3D\u91CF\u5B8C\u6574\u586B\u5199\u5173\u952E\u8BCD"));
    queue(cmd).then((data) => {
      const commits = [];
      if (data[1].code === 0) {
        const logs = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || [];
        let cmds = [`git checkout ${cur}`];
        logs.forEach((el) => {
          commits.push(el.replace(/(commit\s)|\n/g, ""));
        });
        commits.reverse();
        if (commits.length > 0) {
          cmds = cmds.concat([
            {
              cmd: `git cherry-pick ${commits.join(" ")}`,
              config: {
                again: false,
                success: "\u8BB0\u5F55\u5408\u5E76\u6210\u529F",
                fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            },
            {
              cmd: "git push",
              config: {
                again: true,
                success: "\u63A8\u9001\u6210\u529F",
                fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            }
          ]);
        } else {
          sh.echo("\u6CA1\u6709\u627E\u5230\u4EFB\u4F55\u8BB0\u5F55");
        }
        queue(cmds);
      } else {
        sh.echo(data[1].err);
      }
    });
  } else {
    const cmd = [
      {
        cmd: `git cherry-pick ${commitid.join(" ")}`,
        config: {
          again: false,
          success: "\u8BB0\u5F55\u5408\u5E76\u6210\u529F",
          fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
        }
      },
      {
        cmd: "git push",
        config: {
          again: true,
          success: "\u63A8\u9001\u6210\u529F",
          fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
        }
      }
    ];
    queue(cmd);
  }
});
program.parse(process.argv);

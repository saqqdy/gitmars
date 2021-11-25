#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { queue } = require("./core/queue");
const { getIsGitProject } = require("./core/git/index");
const { error } = require("./core/utils/index");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm merge").usage("<name>").arguments("<name>").description("\u5408\u5E76\u5206\u652F\u4EE3\u7801").action((name) => {
  const cmd = [
    {
      cmd: `git merge --no-ff ${name}`,
      config: {
        again: false,
        success: `\u5408\u5E76${name}\u5206\u652F\u6210\u529F`,
        fail: `\u5408\u5E76${name}\u5206\u652F\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
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
});
program.parse(process.argv);

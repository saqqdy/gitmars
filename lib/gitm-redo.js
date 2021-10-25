#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const inquirer = require("inquirer");
const sh = require("shelljs");
sh.config.execPath = sh.which("node").toString();
const { options, args } = require("./conf/redo");
const { error, warning, queue, isGitProject } = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
program.name("gitm redo").usage("[commitid...] [-b --branch [branch]] [-m --mode [mode]]").description("\u64A4\u9500\u4E00\u6B21\u63D0\u4EA4\u8BB0\u5F55");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (commitid, opt) => {
  const cmd = [];
  let m = "";
  if (opt.mode)
    m = " -m " + Math.abs(Number(opt.mode));
  if (opt.branch) {
    const keys = ["%H", "%aI", "%an"];
    const results = sh.exec(`git log --merges --grep="'${opt.branch}'" --date-order --pretty=format:"${keys.join(",=")}-end-"`, { silent: true }).stdout.replace(/[\r\n]+/g, "").replace(/-end-$/, "");
    const logList = [];
    let logs = logList.map((log) => log["%H"]);
    results && results.split("-end-").forEach((log) => {
      const args2 = log.split(",=");
      const map = {};
      keys.forEach((key, i) => {
        map[key] = args2[i];
      });
      logList.push(map);
    });
    logList.reverse();
    if (logList.length > 1) {
      const prompt = {
        type: "checkbox",
        message: "\u68C0\u6D4B\u5230\u5B58\u5728\u591A\u6761\u8BB0\u5F55\uFF0C\u8BF7\u9009\u62E9\u8981\u64A4\u9500\u7684\u9879",
        name: "commitIDs",
        choices: []
      };
      logList.forEach((log) => {
        prompt.choices.push({
          name: `${log["%an"]}\u64CD\u4F5C\u4E8E\uFF1A${log["%aI"]}`,
          value: log["%H"],
          checked: true
        });
      });
      const { commitIDs } = await inquirer.prompt(prompt);
      logs = commitIDs;
    }
    logs.forEach((log) => {
      cmd.push({
        cmd: `git revert ${log}${m}`,
        config: {
          again: true,
          success: "\u64A4\u9500\u6210\u529F",
          fail: "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
        }
      });
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
    sh.echo(warning("\u6307\u4EE4\u4E0D\u5408\u6CD5"));
    sh.exit(1);
  }
  queue(cmd);
});
program.parse(process.argv);

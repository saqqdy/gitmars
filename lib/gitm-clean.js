#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const path = require("path");
const sh = require("shelljs");
const inquirer = require("inquirer");
const { options, args } = require("./conf/clean");
const { success, warning, isGitProject } = require("./js/index");
const { createArgs } = require("./js/tools");
const gitRevParse = require("./js/gitRevParse");
const cacheDir = path.join(__dirname, "../cache");
const { root, gitDir } = gitRevParse();
program.name("gitm clean").usage("[-f --force]").description("\u6E05\u7406gitmars\u7F13\u5B58");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  if (isGitProject()) {
    sh.rm(gitDir + "/.gitmarscommands", gitDir + "/.gitmarslog");
    if (opt.force) {
      await inquirer.prompt({
        type: "confirm",
        name: "value",
        message: "\u60A8\u8F93\u5165\u4E86--force\uFF0C\u5C06\u540C\u65F6\u6E05\u7406\u672C\u5730gitmars\u914D\u7F6E\u6587\u4EF6\u3002\u662F\u5426\u7EE7\u7EED\uFF1F",
        default: false
      }).then((answers) => {
        if (!answers.value) {
          sh.echo(success("\u5DF2\u9000\u51FA"));
          sh.exit(0);
        }
      });
      sh.rm(root + "/gitmarsconfig.json", root + "/.gitmarsrc");
    }
  } else {
    sh.echo(warning("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  }
  sh.rm(cacheDir + "/buildConfig*.json", cacheDir + "/buildConfig.txt", cacheDir + "/packageInfo.json", cacheDir + "/timestamp.json");
  sh.echo(success("\u6E05\u7406\u5B8C\u6BD5"));
});
program.parse(process.argv);

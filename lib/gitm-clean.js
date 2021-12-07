#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const path = require("path");
const sh = require("shelljs");
const { green, yellow } = require("colors");
const inquirer = require("inquirer");
const ora = require("ora");
const { options, args } = require("./conf/clean");
const { getIsGitProject, getGitRevParse } = require("./core/git/index");
const { isFileExist, createArgs } = require("./core/utils/index");
const cacheDir = path.join(__dirname, "../cache");
const { gitDir } = getGitRevParse();
sh.config.silent = true;
function removeFile(files) {
  const spinner = ora();
  for (const file of files) {
    file.name && spinner.start(green(`\u6B63\u5728\u5904\u7406${file.name}`));
    const fileExist = isFileExist(file.url);
    if (fileExist) {
      sh.rm(file.url);
      file.name && spinner.succeed(green(`${file.name}\u5DF2\u5220\u9664`));
    } else {
      file.name && spinner.warn(green(`${file.name}\u672A\u627E\u5230`));
    }
  }
  spinner.stop();
  sh.echo(green("\u6E05\u7406\u5B8C\u6BD5"));
}
program.name("gitm clean").usage("[-f --force]").description("\u6E05\u7406gitmars\u7F13\u5B58");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (opt) => {
  if (getIsGitProject()) {
    if (opt.force) {
      await inquirer.prompt({
        type: "confirm",
        name: "value",
        message: "\u60A8\u8F93\u5165\u4E86--force\uFF0C\u5C06\u540C\u65F6\u6E05\u7406gitmars\u6267\u884C\u7F13\u5B58\u3002\u662F\u5426\u7EE7\u7EED\uFF1F",
        default: false
      }).then((answers) => {
        if (!answers.value) {
          sh.echo(green("\u5DF2\u9000\u51FA"));
          process.exit(0);
        }
      });
      removeFile([
        {
          name: "gitmars\u6307\u4EE4\u961F\u5217\u7F13\u5B58\u6587\u4EF6",
          url: gitDir + "/.gitmarscommands"
        },
        {
          name: "gitmars\u6267\u884C\u65E5\u5FD7\u6587\u4EF6",
          url: gitDir + "/.gitmarslog"
        }
      ]);
    }
  } else {
    sh.echo(yellow("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  }
  removeFile([
    {
      name: "Jenkins\u6784\u5EFA\u914D\u7F6E\u7F13\u5B58\u6587\u4EF6",
      url: cacheDir + "/buildConfig*.json"
    },
    {
      url: cacheDir + "/buildConfig.txt"
    },
    {
      name: "Gitmars\u5305\u7F13\u5B58\u6587\u4EF6",
      url: cacheDir + "/packageInfo.json"
    },
    {
      name: "\u7F13\u5B58\u65F6\u95F4Map\u6587\u4EF6",
      url: cacheDir + "/timestamp.json"
    }
  ]);
});
program.parse(process.argv);

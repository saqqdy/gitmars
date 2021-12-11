#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { green, red } = require("colors");
const inquirer = require("inquirer");
const { options, args } = require("./conf/go");
const getProperty = require("js-cool/lib/getProperty");
const commands = require("./core/go/index");
const getCurrentBranch = require("./core/git/getCurrentBranch");
const { createArgs } = require("./core/utils/command");
program.name("gitm go").usage("[command]").description("\u667A\u80FD\u731C\u6D4B\u4F60\u8981\u6267\u884C\u7684\u52A8\u4F5C");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (command) => {
  const current = getCurrentBranch();
  sh.echo(green(`\u5F53\u524D\u5206\u652F${current}\uFF0C\u7CFB\u7EDF\u731C\u6D4B\u4F60\u53EF\u80FD\u60F3\u505A\u4EE5\u4E0B\u64CD\u4F5C\uFF1A`));
  if (command) {
    const cmd = getProperty(commands, command);
    if (!cmd) {
      sh.echo(red("\u60A8\u8F93\u5165\u7684\u6307\u4EE4\u6CA1\u6709\u627E\u5230\uFF0C\u53EF\u80FD\u6682\u4E0D\u652F\u6301"));
      process.exit(1);
    }
    cmd();
  } else {
    inquirer.prompt({
      type: "list",
      name: "command",
      message: "\u8BF7\u9009\u62E9\u4F60\u60F3\u8981\u7684\u64CD\u4F5C?",
      default: "combine",
      choices: [
        new inquirer.Separator(" === 1. Gitmars\u5DE5\u4F5C\u6D41 === "),
        "combine",
        "end",
        "update",
        "build",
        "start",
        "undo",
        "redo",
        "admin.publish",
        "admin.update",
        "admin.create",
        "admin.clean",
        new inquirer.Separator(" === 2. \u9AD8\u7EA7\u5DE5\u5177 === "),
        "branch",
        "copy",
        "get",
        "save",
        "cleanbranch",
        "clean",
        "revert",
        "link",
        "unlink",
        "postmsg",
        new inquirer.Separator(" === \u9000\u51FA === "),
        "exit",
        new inquirer.Separator()
      ],
      filter: (val) => {
        return val;
      }
    }).then((answers) => {
      if (answers.command === "exit") {
        sh.echo(green("\u5DF2\u9000\u51FA"));
        process.exit(0);
      }
      sh.echo(green(`\u4F60\u9009\u62E9\u4E86${answers.command}\u6307\u4EE4`));
      getProperty(commands, answers.command)();
    });
  }
});
program.parse(process.argv);

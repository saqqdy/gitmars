#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const inquirer = require("inquirer");
const { options, args } = require("./conf/go");
const {
  combine,
  end,
  update,
  build,
  start,
  admin,
  branch,
  copy,
  get,
  save,
  revert,
  link,
  unlink,
  postmsg
} = require("./js/go/index");
const { success, getCurrent } = require("./js/index");
const { createArgs } = require("./js/tools");
program.name("gitm go").usage("[command]").description("\u667A\u80FD\u731C\u6D4B\u4F60\u8981\u6267\u884C\u7684\u52A8\u4F5C");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async () => {
  const current = getCurrent();
  sh.echo(success(`\u5F53\u524D\u5206\u652F${current}\uFF0C\u7CFB\u7EDF\u731C\u6D4B\u4F60\u53EF\u80FD\u60F3\u505A\u4EE5\u4E0B\u64CD\u4F5C\uFF1A`));
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
      "admin.publish",
      "admin.update",
      "admin.create",
      "admin.clean",
      new inquirer.Separator(" === 2. \u9AD8\u7EA7\u5DE5\u5177 === "),
      "branch",
      "copy",
      "get",
      "save",
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
      sh.echo(success("\u5DF2\u9000\u51FA"));
      sh.exit(0);
    }
    sh.echo(success(`\u4F60\u9009\u62E9\u4E86${answers.command}\u6307\u4EE4`));
    if (answers.command === "combine") {
      combine();
    } else if (answers.command === "end") {
      sh.echo("\u6CE8\u610Fend\u6307\u4EE4\u4F1A\u5728\u6267\u884C\u5408\u5E76\u4EE3\u7801\u5230dev\u548C\u9884\u53D1\u4E4B\u540E\u5220\u9664\u5206\u652F");
      end();
    } else if (answers.command === "update") {
      update();
    } else if (answers.command === "build") {
      build();
    } else if (answers.command === "start") {
      start();
    } else if (answers.command === "admin.publish") {
      admin.publish();
    } else if (answers.command === "admin.update") {
      admin.update();
    } else if (answers.command === "admin.create") {
      admin.create();
    } else if (answers.command === "admin.clean") {
      admin.clean();
    } else if (answers.command === "branch") {
      branch();
    } else if (answers.command === "copy") {
      copy();
    } else if (answers.command === "get") {
      get();
    } else if (answers.command === "save") {
      save();
    } else if (answers.command === "revert") {
      revert();
    } else if (answers.command === "link") {
      link();
    } else if (answers.command === "unlink") {
      unlink();
    } else if (answers.command === "postmsg") {
      postmsg();
    }
  });
});
program.parse(process.argv);

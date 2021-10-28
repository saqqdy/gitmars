#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/start");
const { error, success, queue, getStatus, isGitProject } = require("./js/index");
const { createArgs } = require("./js/tools");
const getType = require("js-cool/lib/getType");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./js/getConfig");
const config = getConfig();
program.name("gitm start").usage("<type> <name> [-t --tag <tag>]").description("\u521B\u5EFAbugfix\u4EFB\u52A1\u5206\u652F\u3001\u521B\u5EFAfeature\u529F\u80FD\u5F00\u53D1\u5206\u652F\u3001support\u6846\u67B6\u652F\u6301\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((type, name, opt) => {
  const opts = ["bugfix", "feature", "support"];
  const status = getStatus();
  if (!status)
    sh.exit(1);
  if (opts.includes(type)) {
    if (opt.tag && type !== "bugfix") {
      sh.echo(error("\u6307\u5B9A\u4ECEtag\u62C9\u53D6\u5206\u652F\u65F6\u4EC5\u652F\u6301\u521B\u5EFAbugfix\u5206\u652F"));
      sh.exit(1);
    }
    if (config.nameValidator) {
      const reg = getType(config.nameValidator) === "regexp" ? config.nameValidator : new RegExp(config.nameValidator);
      if (!reg.test(name)) {
        sh.echo(error("\u5206\u652F\u540D\u79F0\u4E0D\u7B26\u5408\u89C4\u8303"));
        sh.exit(1);
      }
    }
    name = name.replace(/^\//, "");
    const base = opt.tag ? opt.tag : type === "bugfix" ? config.bugfix : type === "support" ? config.master : config.release;
    const cmd = opt.tag ? ["git fetch", `git checkout -b ${type}/${name} ${base}`] : [
      "git fetch",
      `git checkout ${base}`,
      "git pull",
      `git checkout -b ${type}/${name} ${base}`
    ];
    queue(cmd).then((data) => {
      if (data[3].code === 0) {
        sh.echo(`${name}\u5206\u652F\u521B\u5EFA\u6210\u529F\uFF0C\u8BE5\u5206\u652F\u57FA\u4E8E${base}\u521B\u5EFA\uFF0C\u60A8\u5F53\u524D\u5DF2\u7ECF\u5207\u6362\u5230${type}/${name}
\u5982\u679C\u9700\u8981\u63D0\u6D4B\uFF0C\u8BF7\u6267\u884C${success("gitm combine " + type + " " + name)}
\u5F00\u53D1\u5B8C\u6210\u540E\uFF0C\u8BB0\u5F97\u6267\u884C: ${success("gitm end " + type + " " + name)}`);
      }
    });
  } else {
    sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(opts)));
    sh.exit(1);
  }
});
program.parse(process.argv);

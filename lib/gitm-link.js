#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/link");
const { createArgs } = require("./js/tools");
program.name("gitm link").usage("[name]").description("\u94FE\u63A5\u672C\u5730\u5305");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((name) => {
  const isLink = sh.test("-L", `./node_modules/${name}`);
  const isExist = sh.test("-e", `./node_modules/${name}`);
  const npmClient = sh.which("yarn") ? "yarn" : "npm";
  if (!name) {
    const { code: code2 } = sh.exec(`${npmClient} link`, { silent: true });
    if (code2 === 0)
      sh.echo("\u5904\u7406\u5B8C\u6210");
    else
      sh.echo("\u51FA\u9519\u4E86");
    sh.exit(0);
  } else if (isLink) {
    sh.rm("-rf", `./node_modules/${name}`);
  } else if (isExist) {
    sh.mv(`./node_modules/${name}`, `./node_modules/${name}_bak`);
  }
  const { code } = sh.exec(`${npmClient} link ${name}`, { silent: true });
  if (code === 0)
    sh.echo("\u5904\u7406\u5B8C\u6210");
  else
    sh.echo(`\u5904\u7406\u5931\u8D25\uFF0C${name}\u8F6F\u94FE\u4E0D\u5B58\u5728\uFF0C\u8BF7\u8FDB\u5165\u672C\u5730${name}\u6839\u76EE\u5F55\u6267\u884C\uFF1Agitm link`);
});
program.parse(process.argv);

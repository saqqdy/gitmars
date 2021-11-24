#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { getIsGitProject, getGitRevParse } = require("./core/git/index");
const { error, success, writeFile } = require("./core/utils/index");
const { defaults } = require("./core/global");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./core/getConfig");
const config = getConfig();
program.name("gitm config").usage("<option> [value]").command("set <option> [value]").description("\u8BBE\u7F6Egitmars\u7684\u914D\u7F6E\u9879").action(async (option, value) => {
  let { filepath } = config;
  if (!filepath) {
    const { root } = getGitRevParse();
    filepath = root + "/.gitmarsrc";
  }
  if (value) {
    if (Object.keys(defaults).includes(option)) {
      config[option] = value;
      delete config.filepath;
      delete config.skipCI;
      await writeFile(filepath, JSON.stringify(config, null, 4));
      sh.echo(success("\u4FDD\u5B58\u6210\u529F"));
      sh.exit(0);
    } else {
      sh.echo(error("\u4E0D\u652F\u6301" + option + "\u8FD9\u4E2A\u914D\u7F6E\u9879"));
      sh.exit(1);
    }
  } else {
    sh.echo("\u8BF7\u8F93\u5165\u8981\u914D\u7F6E\u7684\u9879");
    sh.exit(1);
  }
});
program.name("gitm config").usage("list [option]").command("list [option]").description("\u67E5\u8BE2\u5355\u4E2A\u6216\u5168\u90E8gitmars\u7684\u914D\u7F6E\u9879").action((option) => {
  if (option) {
    sh.echo(success(config[option]));
  } else {
    sh.echo(success(config));
  }
  sh.exit(0);
});
program.parse(process.argv);

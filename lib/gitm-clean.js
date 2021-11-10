#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const path = require("path");
const sh = require("shelljs");
const { success, warning, isGitProject } = require("./js/index");
const gitRevParse = require("./js/gitRevParse");
const cacheDir = path.join(__dirname, "../cache");
const { root, gitDir } = gitRevParse();
program.name("gitm clean").usage("[-f --force]").description("\u6E05\u7406gitmars\u7F13\u5B58").option("-f, --force", "\u5F3A\u5236\u6E05\u7406", false).action((opt) => {
  if (isGitProject()) {
    sh.rm(gitDir + "/.gitmarscommands", gitDir + "/.gitmarslog");
    if (opt.force) {
      sh.echo(warning("\u60A8\u8F93\u5165\u4E86--force\uFF0C\u5C06\u540C\u65F6\u6E05\u7406\u672C\u5730gitmars\u914D\u7F6E\u6587\u4EF6"));
      sh.rm(root + "/gitmarsconfig.json", root + "/.gitmarsrc");
    }
  } else {
    sh.echo(warning("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  }
  sh.rm(cacheDir + "/buildConfig.json", cacheDir + "/buildConfig.txt", cacheDir + "/timestamp.json");
  sh.echo(success("\u6E05\u7406\u5B8C\u6BD5"));
});
program.parse(process.argv);

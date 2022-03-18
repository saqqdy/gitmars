#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { red } = require("colors");
const { options, args } = require("./conf/alias");
const getIsGitProject = require("./core/git/getIsGitProject");
const { createArgs } = require("./core/utils/command");
const { spawnSync } = require("./core/spawn");
const echo = require("./core/utils/echo");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
const actions = ["init", "remove"];
program.name("gitm alias").usage("<action>").description("\u5B89\u88C5\u548C\u79FB\u9664\u5FEB\u6377\u65B9\u5F0F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((action) => {
  if (!actions.includes(action)) {
    echo(red("\u60A8\u8F93\u5165\u7684\u65B9\u6CD5\u4E0D\u5BF9\uFF0C\u4EC5\u652F\u6301\uFF1Ainit, remove"));
    process.exit(1);
  }
  const alias = {
    flow: "!gitm",
    mars: "!gitm",
    unstage: "reset HEAD --",
    last: "log -1 HEAD",
    st: "status",
    cm: "commit",
    br: "branch",
    bh: "branch",
    ck: "checkout",
    ckb: "checkout -b",
    cp: "cherry-pick",
    ps: "push",
    pl: "pull",
    plm: "pull --merge",
    plr: "pull --rebase",
    fh: "fetch",
    sh: "stash",
    shp: "stash pop",
    sha: "stash apply",
    mg: "merge",
    mgn: "merge --no-ff",
    rs: "reset",
    rsh: "reset --hard",
    rss: "reset --soft",
    rb: "rebase"
  };
  const cmd = {
    init: () => {
      for (const short in alias) {
        spawnSync("git", [
          "config",
          "--global",
          `alias.${short}`,
          alias[short]
        ]);
      }
    },
    remove: () => {
      for (const short in alias) {
        spawnSync("git", [
          "config",
          "--global",
          "--unset",
          `alias.${short}`
        ]);
      }
    }
  };
  cmd[action]();
});
program.parse(process.argv);

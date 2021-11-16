#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { spawnSync } = require("child_process");
const sh = require("shelljs");
const { options, args } = require("./conf/upgrade");
const { success } = require("./js/index");
const { createArgs } = require("./js/tools");
const ora = require("ora");
program.name("gitm upgrade").usage("[version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]").description("\u5347\u7EA7gitmars");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (version, opt) => {
  const spinner = ora(success("\u6B63\u5728\u5B89\u88C5\u8BF7\u7A0D\u540E")).start();
  if (version) {
    const match = version.match(/[0-9.]+$/);
    if (match)
      version = match[0];
    else if (![
      "alpha",
      "lite",
      "beta",
      "release",
      "latest",
      "next"
    ].includes(version)) {
      console.error("\u8F93\u5165\u7684\u7248\u672C\u53F7\u4E0D\u6B63\u786E");
      sh.exit(0);
    }
  } else {
    version = "latest";
  }
  let cmdAdd, cmdDel;
  switch (opt.client) {
    case "yarn":
      cmdAdd = [opt.client, ["global", "add", `gitmars@${version}`]];
      cmdDel = [opt.client, ["global", "remove", "gitmars"]];
      break;
    case "pnpm":
      cmdAdd = [opt.client, ["add", "-g", `gitmars@${version}`]];
      cmdDel = [opt.client, ["remove", "-g", "gitmars"]];
      break;
    default:
      cmdAdd = [opt.client, ["install", "-g", `gitmars@${version}`]];
      cmdDel = [opt.client, ["uninstall", "-g", "gitmars"]];
      break;
  }
  if (!opt.registry && opt.mirror)
    opt.registry = "https://registry.npmmirror.com";
  if (opt.registry)
    cmdAdd[1] = cmdAdd[1].concat(["-registry", opt.registry]);
  const uninstall = spawnSync(cmdDel[0], cmdDel[1], {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  if (uninstall.status !== 0) {
    console.warn("\u5378\u8F7D\u51FA\u9519\u4E86");
    process.exit(0);
  }
  const install = spawnSync(cmdAdd[0], cmdAdd[1], {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  spawnSync("gitm", ["-v"], {
    stdio: "inherit",
    shell: process.platform === "win32"
  });
  sh.echo(`
${success("\u5B89\u88C5\u5B8C\u6210")}`);
  spinner.stop();
  if (install.status === 0) {
    process.exit(0);
  } else {
    console.warn("\u5B89\u88C5\u51FA\u9519\u4E86");
    process.exit(0);
  }
});
program.parse(process.argv);

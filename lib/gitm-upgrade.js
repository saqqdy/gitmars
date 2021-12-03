#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { spawnSync } = require("./core/spawn");
const sh = require("shelljs");
const { options, args } = require("./conf/upgrade");
const { error, success } = require("./core/utils/index");
const { createArgs } = require("./core/utils/index");
const ora = require("ora");
program.name("gitm upgrade").usage("[version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]").description("\u5347\u7EA7gitmars");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (version, opt) => {
  const spinner = ora();
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
      console.error("\u8F93\u5165\u7684\u7248\u672C\u53F7\u4E0D\u6B63\u786E\uFF0C\u4EC5\u652F\u6301\uFF1Aalpha\u3001lite\u3001beta\u3001release\u3001latest\u3001next");
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
  spinner.start(success("\u6B63\u5728\u5378\u8F7D"));
  const uninstall = spawnSync(cmdDel[0], cmdDel[1], {
    stdio: "ignore",
    shell: process.platform === "win32"
  });
  if (uninstall.status !== 0) {
    spinner.fail(error("\u5378\u8F7D\u51FA\u9519\u4E86\uFF0C\u8BF7\u5C1D\u8BD5\u624B\u52A8\u5220\u9664\u540E\u8FD0\u884C\uFF1Anpm install -g gitmars"));
    process.exit(0);
  }
  spinner.succeed(success("\u5378\u8F7D\u5B8C\u6210"));
  spinner.start(success("\u6B63\u5728\u5B89\u88C5"));
  const install = spawnSync(cmdAdd[0], cmdAdd[1], {
    stdio: "ignore",
    shell: process.platform === "win32"
  });
  if (install.status === 0) {
    spinner.succeed(success("\u5B89\u88C5\u5B8C\u6210"));
    spawnSync("gitm", ["-v"], {
      stdio: "inherit",
      shell: process.platform === "win32"
    });
  } else {
    spinner.fail(error("\u5B89\u88C5\u51FA\u9519\u4E86\uFF0C\u8BF7\u5C1D\u8BD5\u8FD0\u884C\uFF1Anpm install -g gitmars"));
  }
  spinner.stop();
  process.exit(0);
});
program.parse(process.argv);

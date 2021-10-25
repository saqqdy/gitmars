#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const path = require("path");
const sh = require("shelljs");
sh.config.execPath = sh.which("node").toString();
const { options, args } = require("./conf/ui");
const { createArgs } = require("./js/tools");
program.name("gitm ui").usage("[-p --port <port>]").description("\u94FE\u63A5\u672C\u5730\u5305");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((opt) => {
  process.chdir(path.join(__dirname, "../app"));
  opt.port && (process.env.PORT = String(opt.port));
  sh.exec(`npm run server:start`);
});
program.parse(process.argv);

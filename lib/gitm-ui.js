#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const path = require("path");
const sh = require("shelljs");
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
  sh.exec(`npm run server:start ${opt.port ? "--port " + opt.port : ""}`);
});
program.parse(process.argv);

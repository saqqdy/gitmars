#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { options, args } = require("./conf/build");
const { createArgs } = require("./core/utils/index");
const { runJenkins } = require("./core/build/index");
program.name("gitm build").usage("<project> [-e --env [env]] [-a --app [app]]").description("\u6784\u5EFAJenkins");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((project, opt) => {
  runJenkins({
    env: opt.env,
    project,
    app: opt.app
  });
});
program.parse(process.argv);

#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { options, args } = require("./conf/run");
const { createArgs } = require("./core/utils/command");
const run = require("./core/hook/run");
program.name("gitm run").usage("[command] [args...]").description("git\u94A9\u5B50\u8FD0\u884C\u6307\u4EE4");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((command, args2, opt) => {
  run(command, args2, opt);
});
program.parse(process.argv);

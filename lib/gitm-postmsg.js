#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const { options, args } = require("./conf/postmsg");
const sendGroupMessage = require("./core/sendGroupMessage");
const { createArgs } = require("./core/utils/index");
program.name("gitm postmsg").usage("<message> [-u --url [url]]").description("\u53D1\u9001\u7FA4\u6D88\u606F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action((message, opt) => {
  sendGroupMessage(message, opt.url || "");
});
program.parse(process.argv);

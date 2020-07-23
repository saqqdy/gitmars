#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

var program = require('commander');

var sh = require('shelljs');

program.name('gitm link').usage('<name> <path>').arguments('<name> <path>').description('链接本地包').action(function (name, path, opt) {
  path = path.replace(/\\/g, '/');
  var isLink = sh.test('-L', "./node_modules/".concat(name));

  if (isLink) {
    sh.rm('-rf', "./node_modules/".concat(name));
  } else {
    sh.mv("./node_modules/".concat(name), "./node_modules/".concat(name, "_bak"));
  }

  sh.ln('-s', path, "./node_modules/".concat(name));
  sh.echo('处理完成');
});
program.parse(process.argv);
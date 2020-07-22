#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/global'),
    pwd = _require.pwd;

program.name('gitm link').usage('<name> <path>').arguments('<name> <path>').description('链接本地包').action(function (name, path, opt) {
  sh.mv("./node_modules/".concat(name), "./node_modules/".concat(name, "_bak"));
  sh.ln('-s', path, "./node_modules/".concat(name));
  sh.echo('处理完成');
});
program.parse(process.argv);
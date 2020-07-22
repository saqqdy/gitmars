#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/global'),
    pwd = _require.pwd;

program.name('gitm unlink').usage('<name>').arguments('<name>').description('解除本地包链接').action(function (name, opt) {
  sh.rm('-rf', "./node_modules/".concat(name));
  sh.mv("./node_modules/".concat(name, "_bak"), "./node_modules/".concat(name));
  sh.echo('处理完成');
});
program.parse(process.argv);
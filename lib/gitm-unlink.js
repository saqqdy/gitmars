#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

program.name('gitm unlink').usage('<name>').arguments('<name>').description('解除本地包链接').action(function (name, opt) {
  var isLink = sh.test('-L', "./node_modules/".concat(name)),
      isExist = sh.test('-e', "./node_modules/".concat(name, "_bak"));

  if (isLink) {
    sh.rm('-rf', "./node_modules/".concat(name));
  } else {
    sh.echo('没有找到软链，请确认输入正确名称');
  }

  if (isExist) {
    sh.mv("./node_modules/".concat(name, "_bak"), "./node_modules/".concat(name));
  }

  sh.echo('处理完成');
});
program.parse(process.argv);
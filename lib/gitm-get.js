#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue;

program.name('gitm get').usage('').description('恢复暂存区最近一次暂存的文件').action(function () {
  queue([{
    cmd: 'git stash pop',
    config: {
      success: '文件恢复成功',
      fail: '恢复失败，请检查冲突'
    }
  }]);
});
program.parse(process.argv);
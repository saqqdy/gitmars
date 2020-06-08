#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    error = _require.error,
    queue = _require.queue,
    getCache = _require.getCache;

program.name('gitm continue').usage('[-l --list]').description('继续未完成的操作').option('-l, --list', '显示指令队列', false).action(function (opt) {
  var cmd = getCache();

  if (opt.list) {
    sh.echo(cmd);
    sh.exit(0);
  }

  if (cmd.length > 0) {
    queue(cmd);
  } else {
    sh.echo(error('队列里面没有未执行的指令'));
  }
});
program.parse(process.argv);
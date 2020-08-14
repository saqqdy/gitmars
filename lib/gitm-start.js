#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    error = _require.error,
    success = _require.success,
    queue = _require.queue,
    getStatus = _require.getStatus;

var config = require('./js/config');

program.name('gitm start').usage('<type> <name>').arguments('<type> <name>').description('创建bugfix任务分支、创建feature功能开发分支、support框架支持分支').action(function (type, name) {
  var opts = ['bugfix', 'feature', 'support'];
  var status = getStatus();
  if (!status) sh.exit(1);

  if (opts.includes(type)) {
    var base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release,
        cmd = ["git fetch", "git checkout ".concat(base), "git pull", "git checkout -b ".concat(type, "/").concat(name, " ").concat(base)];
    queue(cmd).then(function (data) {
      if (data[3].code === 0) {
        sh.echo("".concat(name, "\u5206\u652F\u521B\u5EFA\u6210\u529F\uFF0C\u8BE5\u5206\u652F\u57FA\u4E8E").concat(base, "\u521B\u5EFA\uFF0C\u60A8\u5F53\u524D\u5DF2\u7ECF\u5207\u6362\u5230").concat(type, "/").concat(name, "\n\u5982\u679C\u9700\u8981\u63D0\u6D4B\uFF0C\u8BF7\u6267\u884C").concat(success('gitm combine ' + type + ' ' + name), "\n\u5F00\u53D1\u5B8C\u6210\u540E\uFF0C\u8BB0\u5F97\u6267\u884C: ").concat(success('gitm end ' + type + ' ' + name)));
      }
    });
  } else {
    sh.echo(error('type只允许输入：' + JSON.stringify(opts)));
    sh.exit(1);
  }
});
program.parse(process.argv);
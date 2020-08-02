#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue,
    getCurrent = _require.getCurrent;

program.name('gitm save').usage('[message]').arguments('[message]').description('暂存当前分支文件').option('-f, --force', '没有版本的文件也暂存，这会执行git add .', false).action(function (message, opt) {
  if (!message) message = getCurrent();
  var cmd = [{
    cmd: "git stash save \"".concat(message, "\""),
    config: {
      success: '文件暂存成功',
      fail: '出错了，请联系管理员'
    }
  }];

  if (opt.force) {
    cmd = ['git add .', {
      cmd: "git stash save \"".concat(message, "\""),
      config: {
        success: '文件暂存成功',
        fail: '出错了，请联系管理员'
      }
    }];
  }

  queue(cmd);
});
program.parse(process.argv);
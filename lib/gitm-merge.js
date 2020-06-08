#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue;

program.name('gitm merge').usage('<name>').arguments('<name>').description('合并分支代码').action(function (name) {
  var cmd = [{
    cmd: "git merge --no-ff ".concat(name),
    config: {
      slient: false,
      again: false,
      success: "\u5408\u5E76".concat(name, "\u5206\u652F\u6210\u529F"),
      fail: "\u5408\u5E76".concat(name, "\u5206\u652F\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
    }
  }, {
    cmd: "git push",
    config: {
      slient: false,
      again: true,
      success: '推送成功',
      fail: '推送失败，请根据提示处理'
    }
  }];
  queue(cmd);
});
program.parse(process.argv);
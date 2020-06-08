#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue;

program.name('gitm upgrade').usage('[version]').description('升级gitmars').arguments('[version]').option('-m, --mirror', '是否使用淘宝镜像', false).action(function (version, opt) {
  var match = version && version.match(/[0-9.]+$/) || null,
      v = match ? match[0] : 'latest',
      cmd = [{
    cmd: "npm install -g gitmars@".concat(v, " ").concat(opt.mirror ? '--registry=https://registry.npm.taobao.org' : ''),
    config: {
      slient: false,
      again: true,
      kill: false,
      success: '升级成功',
      fail: '升级失败，请重试'
    }
  }, {
    cmd: "gitm -v",
    config: {
      slient: true,
      again: false
    }
  }];
  queue(cmd).then(function (data) {
    if (data[0].code === 0) {
      sh.echo(data[1].out);
    }
  });
});
program.parse(process.argv);
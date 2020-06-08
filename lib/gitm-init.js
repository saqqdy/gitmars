#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    success = _require.success,
    handleConfigOutput = _require.handleConfigOutput;

var _require2 = require('./js/global'),
    defaults = _require2.defaults,
    pwd = _require2.pwd;

program.name('gitm init').usage('').description('设置gitmars的配置项').action(function () {
  var o = [],
      i = 0,
      keys = Object.keys(defaults);
  sh.echo(success(handleConfigOutput(keys[i])));
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', function (data) {
    o.push(keys[i] + ' = ' + (data.replace(/[\n\s]*/g, '') || defaults[keys[i]]));
    i++;

    if (i < keys.length) {
      sh.echo(success(handleConfigOutput(keys[i])));
    } else {
      var r = sh.echo(o.join('\n')).to(pwd + '/.gitmarsrc');

      if (r.code === 0) {
        sh.echo(success('配置成功！'));
        process.exit(0);
      } else {
        process.exit(1);
      }
    }
  });
});
program.parse(process.argv);
#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.for-each");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('../js/index'),
    error = _require.error,
    success = _require.success;

var _require2 = require('../js/global'),
    defaults = _require2.defaults,
    pwd = _require2.pwd;

var config = require('../js/config');

var configFrom = require('../js/configFrom');

program.name('gitm config').usage('<option> [value]').command('set <option> [value]').description('设置gitmars的配置项').action(function (option, value) {
  if (value) {
    var o = _objectSpread({}, config);

    if (Object.keys(defaults).includes(option)) {
      o[option] = value;

      if (configFrom === 2) {
        sh.touch(pwd + '/gitmarsconfig.json');
        sh.echo(JSON.stringify(o, null, 4)).to(pwd + '/gitmarsconfig.json');
      } else {
        var arr = [];

        for (var k in o) {
          arr.push(k + ' = ' + o[k]);
        }

        sh.touch(pwd + '/.gitmarsrc');
        sh.echo(arr.join('\n')).to(pwd + '/.gitmarsrc');
      }
    } else {
      sh.echo(error('不支持' + option + '这个配置项'));
      process.exit(1);
    }
  } else {
    sh.echo('请输入：');
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function (data) {
      process.stdout.write(data);

      var o = _objectSpread({}, config);

      if (Object.keys(defaults).includes(option)) {
        o[option] = data.replace(/[\n\s]*/g, '') || defaults[option];

        if (configFrom === 2) {
          sh.touch(pwd + '/gitmarsconfig.json');
          sh.echo(JSON.stringify(o, null, 4)).to(pwd + '/gitmarsconfig.json');
        } else {
          var _arr = [];

          for (var _k in o) {
            _arr.push(_k + ' = ' + o[_k]);
          }

          sh.touch(pwd + '/.gitmarsrc');
          sh.echo(_arr.join('\n')).to(pwd + '/.gitmarsrc');
        }

        process.exit(0);
      } else {
        sh.echo(error('不支持' + option + '这个配置项'));
        process.exit(1);
      }
    });
  }
});
program.name('gitm config').usage('list [option]').command('list [option]').description('查询单个或全部gitmars的配置项').action(function (option) {
  if (option) {
    sh.echo(success(config[option]));
  } else {
    sh.echo(success(config));
  }

  sh.exit(1);
});
program.parse(process.argv);
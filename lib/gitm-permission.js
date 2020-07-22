#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    error = _require.error,
    getCurrent = _require.getCurrent;

var config = require('./js/config');

program.name('gitm permission').usage('[message]').arguments('[message]').description('校验提交权限').option('--no-verify', '是否需要跳过校验权限', false).option('--dev', '是否限制dev提交', false).option('--release', '是否限制release提交', false).action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message, opt) {
    var current, allow, msg, index;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getCurrent();

          case 2:
            current = _context.sent;
            allow = [config.master], msg = sh.exec('git show', {
              silent: true
            }).stdout;
            if (opt.dev) allow.push(config.develop);
            if (opt.release) allow.push(config.release);
            index = allow.indexOf(current);

            if (index > -1 && !opt.noVerify && msg && msg.indexOf('Merge:') === -1 && msg.indexOf('Merge branch') === -1) {
              sh.echo(error("".concat(allow[index], "\u5206\u652F\u4E0D\u5141\u8BB8\u76F4\u63A5\u63D0\u4EA4")));
              sh.exit(1);
            } else {
              sh.exit(0);
            }

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
program.parse(process.argv);
#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue,
    getCurrent = _require.getCurrent;

program.name('gitm save').usage('[message]').arguments('[message]').description('暂存当前分支文件').option('-f, --force', '没有版本的文件也暂存，这会执行git add .', false).action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message, opt) {
    var cmd;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (message) {
              _context.next = 4;
              break;
            }

            _context.next = 3;
            return getCurrent();

          case 3:
            message = _context.sent;

          case 4:
            cmd = [{
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

          case 7:
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
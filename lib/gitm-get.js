#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

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
    getCurrent = _require.getCurrent,
    getStashList = _require.getStashList,
    warning = _require.warning;

program.name('gitm get').usage('[message] [index]').arguments('[message] [index]').description('恢复暂存区文件').option('-k, --keep [keep]', '保留暂存区不删除', false).action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(message, index, opt) {
    var list;
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
            _context.next = 6;
            return getStashList(message);

          case 6:
            list = _context.sent;
            if (list.length === 0) sh.echo(warning("\u8BE5\u5206\u652F\u6CA1\u6709\u6682\u5B58\u4EFB\u4F55\u6587\u4EF6\uFF01"));
            if (index === undefined && list.length > 1) sh.echo(warning("\u8BE5\u5206\u652F\u4E0B\u6709".concat(list.length, "\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u9ED8\u8BA4\u6062\u590D\u6700\u8FD1\u7684\u4E00\u6761\u8BB0\u5F55")));
            if (list.length > 2) sh.echo(warning("\u8BE5\u5206\u652F\u4E0B\u6709".concat(list.length, "\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u5EFA\u8BAE\u5B9A\u671F\u6E05\u7406\u4E0D\u5FC5\u8981\u7684\u6682\u5B58\u8BB0\u5F55\uFF01")));
            queue([{
              cmd: "git stash ".concat(opt.keep ? 'apply' : 'pop', " ").concat(list[index || 0].key),
              config: {
                again: opt.keep ? false : "git stash drop ".concat(list[index || 0].key),
                success: '文件恢复成功',
                fail: '恢复失败，请检查冲突'
              }
            }]);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
program.parse(process.argv);
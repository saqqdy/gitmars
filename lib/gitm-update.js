#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.includes");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    error = _require.error,
    queue = _require.queue,
    getStatus = _require.getStatus;

var config = require('./js/config');

program.name('gitm update').usage('<type> <name>').arguments('<type> <name>').description('更新bug任务分支、更新feature功能开发分支、框架调整分支support').option('--use-merge', '是否使用merge方式更新，默认rebase', false).action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, name, opt) {
    var opts, status, base, cmd;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = ['bugfix', 'feature', 'support'];
            _context.next = 3;
            return getStatus();

          case 3:
            status = _context.sent;
            if (!status) sh.exit(1);

            if (opts.includes(type)) {
              base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release, cmd = ["git fetch", "git checkout ".concat(base), "git pull", "git checkout ".concat(type, "/").concat(name)];

              if (opt.useMerge) {
                cmd.push({
                  cmd: "git merge --no-ff ".concat(base),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(base, "\u540C\u6B65\u5230").concat(type, "/").concat(name, "\u6210\u529F"),
                    fail: "".concat(base, "\u540C\u6B65\u5230").concat(type, "/").concat(name, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                });
              } else {
                cmd.push({
                  cmd: "git rebase ".concat(base),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(base, "\u66F4\u65B0\u5230").concat(type, "/").concat(name, "\u6210\u529F"),
                    fail: "".concat(base, "\u66F4\u65B0\u5230").concat(type, "/").concat(name, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                });
              }

              queue(cmd);
            } else {
              sh.echo(error('type只允许输入：' + JSON.stringify(opts)));
              sh.exit(1);
            }

          case 6:
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
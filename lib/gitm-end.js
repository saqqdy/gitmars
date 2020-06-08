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

program.name('gitm end').usage('<type> <name>').arguments('<type> <name>').description('合并bugfix任务分支、合并feature功能开发分支，合并完成后将删除对应分支').action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, name, opt) {
    var allow, status, base, cmd;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            allow = ['bugfix', 'feature', 'support'];
            _context.next = 3;
            return getStatus();

          case 3:
            status = _context.sent;
            if (!status) sh.exit(1);

            if (allow.includes(type)) {
              base = type === 'bugfix' ? config.bugfix : config.release, cmd = ["git fetch", "git checkout ".concat(config.develop), "git pull", {
                cmd: "git merge --no-ff ".concat(type, "/").concat(name),
                config: {
                  slient: false,
                  again: false,
                  success: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.develop, "\u6210\u529F"),
                  fail: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.develop, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                }
              }, {
                cmd: "git push",
                config: {
                  slient: false,
                  again: true,
                  success: '推送成功',
                  fail: '推送失败，请根据提示处理'
                }
              }, "git checkout ".concat(type, "/").concat(name)];

              if (type === 'support') {
                cmd = cmd.concat(["git fetch", "git checkout ".concat(config.bugfix), "git pull", {
                  cmd: "git merge --no-ff ".concat(type, "/").concat(name),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.bugfix, "\u6210\u529F"),
                    fail: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.bugfix, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }, "git checkout ".concat(type, "/").concat(name)]);
              }

              cmd = cmd.concat(["git fetch", "git checkout ".concat(base), "git pull", {
                cmd: "git merge --no-ff ".concat(type, "/").concat(name),
                config: {
                  slient: false,
                  again: false,
                  success: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(base, "\u6210\u529F"),
                  fail: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(base, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                }
              }, {
                cmd: "git push",
                config: {
                  slient: false,
                  again: true,
                  success: '推送成功',
                  fail: '推送失败，请根据提示处理'
                }
              }, "git branch -D ".concat(type, "/").concat(name), "git checkout ".concat(config.develop)]);
              queue(cmd);
            } else {
              sh.echo(error('type只允许输入：' + JSON.stringify(allow)));
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
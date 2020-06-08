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

var _require2 = require('./js/global'),
    appName = _require2.appName;

var config = require('./js/config');

program.name('gitm combine').usage('<type> <name> [-d --dev] [-p --prod]').arguments('<type> <name>').description('合并bugfix任务分支、合并feature功能开发分支、合并support分支').option('-d, --dev', '是否同步到alpha测试环境', false).option('-p, --prod', '是否同步到预发布环境', false).option('-b, --build [build]', '需要构建的应用').option('--no-bugfix', '不同步到bug分支').option('--as-feature', 'bug分支合并到release').action(function () {
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

            if (!opt.dev && !opt.prod) {
              sh.echo('请输入需要同步到的环境');
              sh.exit(1);
            }

            if (!status) sh.exit(1);

            if (allow.includes(type)) {
              base = type === 'bugfix' ? config.bugfix : config.release, cmd = [];

              if (opt.dev) {
                cmd = cmd.concat(["git fetch", "git checkout ".concat(config.develop), "git pull", {
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
                }, "git checkout ".concat(type, "/").concat(name)]);

                if (opt.build) {
                  cmd = cmd.concat([{
                    cmd: "gitm build ".concat(appName, " --env dev --app ").concat(opt.build === true ? 'all' : opt.build),
                    config: {
                      slient: true,
                      again: false,
                      success: '调起构建成功',
                      fail: '调起构建失败'
                    }
                  }]);
                }
              }

              if (opt.prod) {
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
                }, "git checkout ".concat(type, "/").concat(name)]);

                if (type === 'bugfix' && opt.asFeature) {
                  cmd = cmd.concat(["git fetch", "git checkout ".concat(config.release), "git pull", {
                    cmd: "git merge --no-ff ".concat(type, "/").concat(name),
                    config: {
                      slient: false,
                      again: false,
                      success: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.release, "\u6210\u529F"),
                      fail: "".concat(type, "/").concat(name, "\u5408\u5E76\u5230").concat(config.release, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
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

                if (type === 'support' && opt.bugfix) {
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

                if (opt.build) {
                  if (type === 'bugfix') {
                    cmd = cmd.concat([{
                      cmd: "gitm build ".concat(appName, " --env bug --app ").concat(opt.build === true ? 'all' : opt.build),
                      config: {
                        slient: true,
                        again: false,
                        success: '调起构建成功',
                        fail: '调起构建失败'
                      }
                    }]);
                  }

                  if (type === 'support' && opt.bugfix) {
                    cmd = cmd.concat([{
                      cmd: "gitm build ".concat(appName, " --env bug --app ").concat(opt.build === true ? 'all' : opt.build),
                      config: {
                        slient: true,
                        again: false,
                        success: '调起构建成功',
                        fail: '调起构建失败'
                      }
                    }]);
                  }
                }
              }

              queue(cmd);
            } else {
              sh.echo(error('type只允许输入：' + JSON.stringify(allow)));
              sh.exit(1);
            }

          case 7:
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
#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.from");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.regexp.to-string");

require("core-js/modules/es.string.includes");

require("core-js/modules/es.string.iterator");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.iterator");

require("regenerator-runtime/runtime");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    error = _require.error,
    queue = _require.queue,
    getStatus = _require.getStatus,
    getCurrent = _require.getCurrent,
    searchBranch = _require.searchBranch;

var _require2 = require('./js/global'),
    defaults = _require2.defaults,
    appName = _require2.appName;

var config = require('./js/config');

program.name('gitm combine').usage('[type] [name] [-d --dev] [-p --prod]').arguments('[type] [name]').description('合并bugfix任务分支、合并feature功能开发分支、合并support分支').option('-d, --dev', '是否同步到alpha测试环境', false).option('-p, --prod', '是否同步到预发布环境', false).option('-b, --build [build]', '需要构建的应用').option('-m, --commit [commit]', 'commit信息', '').option('-a, --add', '需要add', false).option('--no-bugfix', '不同步到bug分支').option('--as-feature', 'bug分支合并到release').action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type, name, opt) {
    var allow, deny, status, _getCurrent$split, _getCurrent$split2, branchs, _branchs$0$split, _branchs$0$split2, base, cmd;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            allow = ['bugfix', 'feature', 'support'];
            deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support];

            if (!(!opt.add && opt.commit === '')) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return getStatus();

          case 5:
            _context.t0 = _context.sent;
            _context.next = 9;
            break;

          case 8:
            _context.t0 = true;

          case 9:
            status = _context.t0;

            if (!opt.dev && !opt.prod) {
              sh.echo('请输入需要同步到的环境');
              sh.exit(1);
            }

            if (!status) sh.exit(1);

            if (opt.commit === true) {
              sh.echo(error("\u8BF7\u8F93\u5165\u8981\u63D0\u4EA4\u7684message"));
              sh.exit(1);
            }

            if (type) {
              _context.next = 22;
              break;
            }

            ;
            _getCurrent$split = getCurrent().split('/');
            _getCurrent$split2 = _slicedToArray(_getCurrent$split, 2);
            type = _getCurrent$split2[0];
            name = _getCurrent$split2[1];

            if (!name) {
              deny.includes(type) && sh.echo(error("\u9A9A\u5E74\uFF0C\u4F60\u5728".concat(type, "\u5206\u652F\u6267\u884C\u8FD9\u4E2A\u6307\u4EE4\u662F\u4EC0\u4E48\u9A9A\u64CD\u4F5C\uFF1F")));
              sh.exit(1);
            }

            _context.next = 28;
            break;

          case 22:
            if (name) {
              _context.next = 28;
              break;
            }

            if (allow.includes(type)) {
              sh.echo('请输入分支名称');
              sh.exit(1);
            }

            _context.next = 26;
            return searchBranch(type);

          case 26:
            branchs = _context.sent;

            if (branchs.length === 1) {
              ;
              _branchs$0$split = branchs[0].split('/');
              _branchs$0$split2 = _slicedToArray(_branchs$0$split, 2);
              type = _branchs$0$split2[0];
              name = _branchs$0$split2[1];
            } else {
              sh.echo(branchs.length > 1 ? "\u67E5\u8BE2\u5230\u591A\u6761\u540D\u79F0\u5305\u542B".concat(type, "\u7684\u5206\u652F\uFF0C\u8BF7\u8F93\u5165\u5206\u652F\u7C7B\u578B") : error('分支不存在，请正确输入'));
              sh.exit(1);
            }

          case 28:
            if (allow.includes(type) && name) {
              base = type === 'bugfix' ? config.bugfix : config.release, cmd = [];

              if (opt.add) {
                cmd = cmd.concat(["git add ."]);
              }

              if (opt.commit) {
                cmd = cmd.concat(["git commit -m \"".concat(opt.commit, "\"")]);
              }

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

          case 29:
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
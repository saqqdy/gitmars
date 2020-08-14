#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.join");

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
    success = _require.success,
    queue = _require.queue,
    getStatus = _require.getStatus,
    checkBranch = _require.checkBranch,
    getCurrent = _require.getCurrent;

var _require2 = require('./js/global'),
    appName = _require2.appName;

var config = require('./js/config');

program.name('gitm admin').usage('<command> <type>').command('create <type>').description('创建bugfix、release、develop和support分支').action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(type) {
    var opts, base, status, hasBase, exits, cmd;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            opts = ['bugfix', 'release', 'develop', 'support'];
            base = type === 'release' ? config.master : config.release;
            status = getStatus();
            _context.next = 5;
            return checkBranch(base);

          case 5:
            hasBase = _context.sent;
            _context.next = 8;
            return checkBranch(config[type]);

          case 8:
            exits = _context.sent;
            if (!status) sh.exit(1);

            if (!hasBase) {
              sh.echo(error(base + '分支不存在，请先创建' + base + '分支'));
              sh.exit(1);
            }

            if (exits) {
              sh.echo(error(config[type] + '分支已存在，不需要重复创建'));
              sh.exit(1);
            }

            if (opts.includes(type)) {
              cmd = ["git fetch", "git checkout ".concat(base), "git pull", "git checkout -b ".concat(config[type], " ").concat(base)];
              queue(cmd).then(function (data) {
                if (data[3].code === 0) {
                  sh.echo("".concat(config[type], "\u5206\u652F\u521B\u5EFA\u6210\u529F\uFF0C\u8BE5\u5206\u652F\u57FA\u4E8E").concat(base, "\u521B\u5EFA\uFF0C\u60A8\u5F53\u524D\u5DF2\u7ECF\u5207\u6362\u5230").concat(name, "\n\u9700\u8981\u53D1\u7248\u65F6\uFF0C\u8BB0\u5F97\u6267\u884C: ").concat(success('gitm admin publish ' + type)));
                }
              });
            } else {
              sh.echo(error('type只允许输入：' + opts.join(',')));
              sh.exit(1);
            }

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
program.name('gitm admin').usage('<command> <type>').command('publish <type>').description('发布bugfix、release、support分支').option('-c, --combine', '是否把release代码同步到bug', false).option('--use-rebase', '是否使用rebase方式更新，默认merge', false).option('-p, --prod', '发布bug分支时，是否合并bug到master', false).option('-b, --build [build]', '需要构建的应用').option('--postmsg', '发送消息', false).action(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(type, opt) {
    var opts, status, curBranch, cmd, key;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            opts = ['bugfix', 'release', 'support'];
            status = getStatus();
            _context2.next = 4;
            return getCurrent();

          case 4:
            curBranch = _context2.sent;
            if (!status) sh.exit(1);

            if (opts.includes(type)) {
              cmd = {
                bugfix: ["git fetch", "git checkout ".concat(config.bugfix), "git pull", "git checkout ".concat(config.release), "git pull", {
                  cmd: "git merge --no-ff ".concat(config.bugfix),
                  config: {
                    slient: false,
                    again: false,
                    postmsg: opt.postmsg,
                    success: "".concat(config.bugfix, "\u5408\u5E76\u5230").concat(config.release, "\u6210\u529F"),
                    fail: "".concat(config.bugfix, "\u5408\u5E76\u5230").concat(config.release, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }],
                support: ["git fetch", "git checkout ".concat(config.support), "git pull", "git checkout ".concat(config.release), "git pull", {
                  cmd: "git merge --no-ff ".concat(config.support),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(config.support, "\u5408\u5E76\u5230").concat(config.release, "\u6210\u529F"),
                    fail: "".concat(config.support, "\u5408\u5E76\u5230").concat(config.release, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }, "git checkout ".concat(config.bugfix), "git pull", {
                  cmd: "git merge --no-ff ".concat(config.support),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(config.support, "\u5408\u5E76\u5230").concat(config.bugfix, "\u6210\u529F"),
                    fail: "".concat(config.support, "\u5408\u5E76\u5230").concat(config.bugfix, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }],
                release: ["git fetch", "git checkout ".concat(config.release), "git pull", "git checkout ".concat(config.master), "git pull", {
                  cmd: "git merge --no-ff ".concat(config.release),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(config.release, "\u5408\u5E76\u5230").concat(config.master, "\u6210\u529F"),
                    fail: "".concat(config.release, "\u5408\u5E76\u5230").concat(config.master, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }]
              };

              if (type === 'bugfix' && opt.prod) {
                cmd[type] = cmd[type].concat(["git checkout ".concat(config.master), "git pull", {
                  cmd: "git merge --no-ff ".concat(config.bugfix),
                  config: {
                    slient: false,
                    again: false,
                    success: "".concat(config.bugfix, "\u5408\u5E76\u5230").concat(config.master, "\u6210\u529F"),
                    fail: "".concat(config.bugfix, "\u5408\u5E76\u5230").concat(config.master, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                  }
                }, {
                  cmd: "git push",
                  config: {
                    slient: false,
                    again: true,
                    success: '推送成功',
                    fail: '推送失败，请根据提示处理'
                  }
                }]);

                if (opt.build) {
                  cmd[type] = cmd[type].concat([{
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

              if (type === 'release' && opt.build) {
                cmd[type] = cmd[type].concat([{
                  cmd: "gitm build ".concat(appName, " --env prod --app ").concat(opt.build === true ? 'all' : opt.build),
                  config: {
                    slient: true,
                    again: false,
                    success: '调起构建成功',
                    fail: '调起构建失败'
                  }
                }]);
              }

              if (type === 'release' && opt.combine) {
                if (opt.useRebase) {
                  cmd[type] = cmd[type].concat(["git checkout ".concat(config.release), "git pull", "git checkout ".concat(config.bugfix), {
                    cmd: "git pull origin ".concat(config.bugfix, " --rebase"),
                    config: {
                      slient: false,
                      again: true
                    }
                  }, {
                    cmd: "git rebase ".concat(config.release),
                    config: {
                      slient: false,
                      again: false,
                      postmsg: opt.postmsg,
                      success: "".concat(config.release, "\u540C\u6B65\u5230").concat(config.bugfix, "\u6210\u529F"),
                      fail: "".concat(config.release, "\u540C\u6B65\u5230").concat(config.bugfix, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                    }
                  }, {
                    cmd: "git push",
                    config: {
                      slient: false,
                      again: true,
                      success: '推送成功',
                      fail: '推送失败，请根据提示处理'
                    }
                  }]);
                } else {
                  cmd[type] = cmd[type].concat(["git checkout ".concat(config.release), "git pull", "git checkout ".concat(config.bugfix), "git pull", {
                    cmd: "git merge --no-ff ".concat(config.release),
                    config: {
                      slient: false,
                      again: false,
                      postmsg: opt.postmsg,
                      success: "".concat(config.release, "\u5408\u5E76\u5230").concat(config.bugfix, "\u6210\u529F"),
                      fail: "".concat(config.release, "\u5408\u5E76\u5230").concat(config.bugfix, "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
                    }
                  }, {
                    cmd: "git push",
                    config: {
                      slient: false,
                      again: true,
                      success: '推送成功',
                      fail: '推送失败，请根据提示处理'
                    }
                  }]);
                }
              }

              for (key in cmd) {
                cmd[key].push("git checkout ".concat(curBranch));
              }

              queue(cmd[type]);
            } else {
              sh.echo(error('type只允许输入：' + opts.join(',')));
              sh.exit(1);
            }

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}());
program.name('gitm admin').usage('<command> <type> [-m --mode [mode]]').command('update <type>').description('更新bugfix、release、support分支代码').option('--use-rebase', '是否使用rebase方式更新，默认merge', false).option('-m, --mode [mode]', '出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用', 0).option('--postmsg', '发送消息', false).action(function (type, opt) {
  var opts = ['bugfix', 'release', 'support'];
  var base = type === 'release' ? config.master : config.release,
      mode = '',
      status = getStatus();
  if (!status) sh.exit(1);

  if (opt.mode === 1) {
    mode = ' --strategy-option ours';
  } else if (opt.mode === 2) {
    mode = ' --strategy-option theirs';
  }

  if (opts.includes(type)) {
    var cmd = ["git fetch", "git checkout ".concat(base), "git pull", "git checkout ".concat(config[type]), {
      cmd: "git pull",
      config: {
        slient: false,
        again: true
      }
    }, {
      cmd: "git merge --no-ff ".concat(base).concat(mode),
      config: {
        slient: false,
        again: false,
        postmsg: opt.postmsg,
        success: "".concat(base, "\u540C\u6B65\u5230").concat(config[type], "\u6210\u529F"),
        fail: "".concat(base, "\u540C\u6B65\u5230").concat(config[type], "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
      }
    }, {
      cmd: "git push",
      config: {
        slient: false,
        again: true,
        success: '推送成功',
        fail: '推送失败，请根据提示处理'
      }
    }];

    if (opt.useRebase) {
      cmd = ["git fetch", "git checkout ".concat(base), "git pull", "git checkout ".concat(config[type]), {
        cmd: "git pull origin ".concat(config[type], " --rebase"),
        config: {
          slient: false,
          again: true
        }
      }, {
        cmd: "git rebase ".concat(base),
        config: {
          slient: false,
          again: false,
          postmsg: opt.postmsg,
          success: "".concat(base, "\u540C\u6B65\u5230").concat(config[type], "\u6210\u529F"),
          fail: "".concat(base, "\u540C\u6B65\u5230").concat(config[type], "\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406")
        }
      }, {
        cmd: "git push",
        config: {
          slient: false,
          again: true,
          success: '推送成功',
          fail: '推送失败，请根据提示处理'
        }
      }];
    }

    queue(cmd);
  } else {
    sh.echo(error('type只允许输入：' + opts.join(',')));
    sh.exit(1);
  }
});
program.name('gitm admin').usage('<command> <type>').command('clean <type>').description('构建清理工作').action(function (type) {
  var opts = ['bugfix', 'release', 'develop', 'master'];
  var status = getStatus();
  if (!status) sh.exit(1);

  if (opts.includes(type)) {
    var cmd = ["git fetch", "git checkout . -f", "git clean -fd", "git checkout ".concat(config.master), "git branch -D ".concat(config[type]), "git fetch", "git checkout ".concat(config[type]), "git pull"];
    if (type === 'master') cmd = ["git checkout .", "git clean -fd", "git checkout ".concat(config.master), "git clean -fd", "git fetch", "git pull"];
    queue(cmd);
  } else {
    sh.echo(error('type只允许输入：' + opts.join(',')));
    sh.exit(1);
  }
});
program.parse(process.argv);
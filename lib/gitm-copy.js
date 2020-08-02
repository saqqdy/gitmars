#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.for-each");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    warning = _require.warning,
    queue = _require.queue,
    getStatus = _require.getStatus,
    getCurrent = _require.getCurrent;

program.name('gitm copy').usage('<from> [commitid...] [-k] [-a]').arguments('<from> [commitid...]').description('cherry-pick易用版本，从某个分支拷贝某条记录合并到当前分支').option('-k, --key [keyword]', '模糊搜索commit信息关键词', '').option('-a, --author [author]', '提交者', '').action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(from, commitid, opts) {
    var status, cur, cmd, _cmd;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return getStatus();

          case 2:
            status = _context.sent;
            cur = getCurrent();
            if (!status) sh.exit(1);

            if (opts.key !== '' || opts.author !== '') {
              cmd = ["git checkout ".concat(from), "git log --grep=".concat(opts.key, " --author=").concat(opts.author)];
              sh.echo(warning('为确保copy准确，请尽量完整填写关键词'));
              queue(cmd).then(function (data) {
                var commits = [];

                if (data[1].code === 0) {
                  var logs = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || [],
                      cmds = ["git checkout ".concat(cur)];
                  logs.forEach(function (el) {
                    commits.push(el.replace(/(commit\s)|\n/g, ''));
                  });
                  commits.reverse();

                  if (commits.length > 0) {
                    cmds = cmds.concat([{
                      cmd: "git cherry-pick ".concat(commits.join(' ')),
                      config: {
                        slient: false,
                        again: false,
                        success: '记录合并成功',
                        fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
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
                    sh.echo('没有找到任何记录');
                  }

                  queue(cmds);
                } else {
                  sh.echo(data[1].err);
                }
              });
            } else {
              _cmd = [{
                cmd: "git cherry-pick ".concat(commitid.join(' ')),
                config: {
                  slient: false,
                  again: false,
                  success: '记录合并成功',
                  fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
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
              queue(_cmd);
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
"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.join");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.split");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.for-each");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require('fs');

var sh = require('shelljs');

var colors = require('colors');

var _require = require('./global'),
    pwd = _require.pwd,
    gitDir = _require.gitDir,
    appName = _require.appName,
    defaults = _require.defaults;

var config = require('./config');

var warning = function warning(txt) {
  return colors.yellow(txt);
};

var error = function error(txt) {
  return colors.red(txt);
};

var success = function success(txt) {
  return colors.green(txt);
};

var writeFile = function writeFile(url, data) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(url, data, function (err) {
      if (err) {
        reject(new Error('文件写入错误'));
      } else {
        resolve();
      }
    });
  });
};

var mapTemplate = function mapTemplate(tmp, data) {
  if (!tmp || !data) return null;
  var str = '' + tmp.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, function (a, b) {
    if (typeof data === 'function') {
      return data(b);
    }

    for (var k in data) {
      if (b === k) {
        return data[k];
      }
    }
  });
  return str;
};

var wait = function wait(list, fun) {
  if (list.length === 0) {
    fun();
    return;
  } else {
    fun(list[0], function () {
      var kill = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (kill) return;
      list.shift();
      wait(list, fun);
    });
  }
};

var queue = function queue(list) {
  return new Promise(function (resolve, reject) {
    var returns = [];
    if (list.length === 0) reject('指令名称不能为空');
    list = JSON.parse(JSON.stringify(list));
    wait(list, function (command, cb) {
      var cfg = {
        silent: true,
        postmsg: false,
        kill: true,
        again: false
      },
          cmd = command;

      if (command instanceof Object) {
        cfg = Object.assign(cfg, command.config || {});
        cmd = command.cmd;
      }

      if (!cmd) {
        resolve(returns);
      } else {
        sh.exec(cmd, cfg, function (code, out, err) {
          var msg = getCommandMessage(cmd);

          try {
            out = JSON.parse(out);
          } catch (err) {
            out = out.replace(/\n*$/g, '');
          }

          returns.push({
            code: code,
            out: out,
            err: err,
            cfg: cfg,
            cmd: cmd
          });
          if (code !== 0) setLog({
            command: command,
            code: code,
            out: out,
            err: err
          });

          if (code !== 0 && cfg.kill) {
            var rest = JSON.parse(JSON.stringify(list));

            if (!cfg.again) {
              rest.shift();
            } else if (cfg.again !== true) {
              rest.splice(0, 1, cfg.again);
            }

            cb(true);
            setCache(rest);
            cfg.silent && sh.echo(error(err));
            sh.echo(error(cfg.fail || msg.fail || '出错了！指令 ' + cmd + ' 执行失败，中断了进程'));
            cfg.postmsg && postMessage('出错了！指令 ' + cmd + ' 执行失败，中断了进程');
            rest.length > 0 && sh.echo(error('请处理相关问题之后输入gitm continue继续'));
            sh.exit(1);
          } else {
            if (code === 0) {
              var m = cfg.success || msg.success;

              if (m) {
                sh.echo(success(m));
                cfg.postmsg && postMessage(m);
              }
            } else {
              var _m = config.fail || msg.fail || '指令 ' + cmd + ' 执行失败';

              _m && sh.echo(warning(_m));
            }

            cb();
          }
        });
      }
    });
  });
};

var getCache = function getCache() {
  var arr = [];

  if (sh.test('-f', gitDir + '/.gitmarscommands')) {
    arr = sh.cat(gitDir + '/.gitmarscommands').stdout.split('\n')[0].replace(/(^\n*)|(\n*$)/g, '').replace(/\n{2,}/g, '\n').replace(/\r/g, '');
    arr = JSON.parse(decodeURIComponent(arr));
  }

  return arr;
};

var setCache = function setCache(rest) {
  sh.touch(gitDir + '/.gitmarscommands');
  sh.sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(rest)), gitDir + '/.gitmarscommands');
};

var setLog = function setLog(log) {
  sh.touch(gitDir + '/.gitmarslog');
  sh.sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(log)), gitDir + '/.gitmarslog');
};

var getStatus = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return queue(['gitm status']);

          case 2:
            data = _context.sent;

            if (!(data[0].out.indexOf('Changes to be committed') > -1 || data[0].out.indexOf('Changes not staged for commit') > -1)) {
              _context.next = 9;
              break;
            }

            sh.echo(error('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get');
            sh.exit(1);
            return _context.abrupt("return", false);

          case 9:
            if (!(data[0].out.indexOf('Untracked files') > -1)) {
              _context.next = 14;
              break;
            }

            sh.echo(warning('您有未加入版本的文件,') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get');
            return _context.abrupt("return", true);

          case 14:
            return _context.abrupt("return", true);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getStatus() {
    return _ref.apply(this, arguments);
  };
}();

var checkBranch = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
    var data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return queue(["gitm branch -k ".concat(name)]);

          case 2:
            data = _context2.sent;
            return _context2.abrupt("return", data[0].out.replace(/^\s+/, ''));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function checkBranch(_x) {
    return _ref2.apply(this, arguments);
  };
}();

var getCurrent = function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
    var data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return queue(['gitm branch -k \\*']);

          case 2:
            data = _context3.sent;
            return _context3.abrupt("return", data[0].out.replace(/^\*\s+/, ''));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getCurrent() {
    return _ref3.apply(this, arguments);
  };
}();

var getStashList = function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(key) {
    var data, list, arr;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return queue(['git stash list']);

          case 2:
            data = _context4.sent[0].out.replace(/^\*\s+/, '');
            list = data && data.split('\n') || [], arr = [];
            if (list.length > 10) sh.echo(warning("\u8BE5\u9879\u76EE\u4E0B\u4E00\u5171\u6709".concat(list.length, "\u6761\u6682\u5B58\u8BB0\u5F55\uFF0C\u5EFA\u8BAE\u5B9A\u671F\u6E05\u7406\uFF01")));

            try {
              list.forEach(function (item) {
                var msgArr = item.split(':'),
                    first = msgArr.shift();

                if (!key || key && key === msgArr[msgArr.length - 1].trim()) {
                  var m = first.match(/^stash@\{(\d+)\}$/);
                  if (msgArr.length > 1) msgArr.shift();
                  arr.push({
                    key: first,
                    index: +m[1],
                    msg: msgArr.join(':').trim()
                  });
                }
              });
            } catch (e) {}

            return _context4.abrupt("return", arr);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function getStashList(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

var getMessage = function getMessage(type) {
  var str = '',
      d = new Date();

  switch (type) {
    case 'time':
      str = d;
      break;

    case 'timeNum':
      str = d.getTime();
      break;

    case 'pwd':
      str = pwd;
      break;

    case 'project':
      str = appName;
      break;

    case 'user':
      str = config.user;
      break;

    default:
      break;
  }

  return str;
};

var postMessage = function postMessage(msg) {
  if (!config.msgTemplate) {
    sh.echo(error('请配置消息发送api地址'));
    return;
  }

  var message = mapTemplate(config.msgTemplate, function (key) {
    if (key === 'message') return msg;
    return getMessage(key);
  });
  message = message.replace(/\s/g, '');
  config.msgUrl && sh.exec("curl -i -H \"Content-Type: application/json\" -X POST -d '{\"envParams\":{\"error_msg\":\"'".concat(message, "'\"}}' \"").concat(config.msgUrl, "\""), {
    silent: true
  });
};

var getCommandMessage = function getCommandMessage(cmd) {
  var msg = {},
      arr = cmd.replace(/[\s]+/g, ' ').split(' ');
  if (arr.length < 2 || arr[0] !== 'git') return msg;

  switch (arr[1]) {
    case 'checkout':
      msg.success = '切换分支成功';
      msg.fail = '切换分支失败';
      break;

    case 'pull':
      msg.success = '拉取代码成功';
      msg.fail = '拉取代码失败';
      break;

    case 'fetch':
      msg.success = '抓取成功';
      msg.fail = '抓取失败';
      break;

    case 'commit':
      msg.success = '提交成功';
      msg.fail = '提交失败';
      break;

    case 'push':
      msg.success = '推送成功';
      msg.fail = '推送失败';
      break;

    case 'cherry-pick':
      msg.success = '同步提交记录成功';
      msg.fail = '同步提交记录失败';
      break;

    case 'merge':
      msg.success = 'merge分支成功';
      msg.fail = 'merge分支失败';
      break;

    case 'rebase':
      msg.success = 'rebase分支成功';
      msg.fail = 'rebase分支失败';
      break;

    case 'revert':
      msg.success = '撤销成功';
      msg.fail = '撤销失败';
      break;

    case 'clean':
      msg.success = '清理成功';
      msg.fail = '清理失败';
      break;

    default:
      break;
  }

  return msg;
};

var handleConfigOutput = function handleConfigOutput(name) {
  if (name === 'user') {
    return '请输入Git用户名(必填)';
  } else if (name === 'email') {
    return '请输入Git邮箱';
  } else if (name === 'msgUrl') {
    return '请输入云之家消息推送地址';
  } else if (name === 'msgTemplate') {
    return '请输入消息模板, 默认为：' + defaults[name];
  } else if (name === 'apolloConfig') {
    return '请配置apollo';
  }

  return '请输入' + name + '分支名称，默认为：' + defaults[name];
};

module.exports = {
  warning: warning,
  error: error,
  success: success,
  writeFile: writeFile,
  mapTemplate: mapTemplate,
  wait: wait,
  queue: queue,
  getCache: getCache,
  setCache: setCache,
  setLog: setLog,
  getStatus: getStatus,
  checkBranch: checkBranch,
  getCurrent: getCurrent,
  getStashList: getStashList,
  postMessage: postMessage,
  getCommandMessage: getCommandMessage,
  handleConfigOutput: handleConfigOutput
};
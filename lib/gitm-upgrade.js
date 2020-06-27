#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.function.name");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.split");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var program = require('commander');

var sh = require('shelljs');

var execa = require('execa');

var _require = require('./js/index'),
    queue = _require.queue,
    success = _require.success;

var ora = require('ora');

program.name('gitm upgrade').usage('[version]').description('升级gitmars').arguments('[version]').option('-m, --mirror', '是否使用淘宝镜像', false).action(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(version, opt) {
    var spinner, match, cmd, install, ver;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spinner = ora(success('正在安装请稍后')).start();
            match = version && version.match(/[0-9.]+$/) || null;
            cmd = "install -g gitmars@".concat(match ? match[0] : 'latest', " ").concat(opt.mirror ? '--registry=https://registry.npm.taobao.org' : '');
            _context.next = 5;
            return execa('npm', cmd.split(' '), {
              cwd: process.cwd()
            });

          case 5:
            install = _context.sent;
            _context.next = 8;
            return execa('gitm', ['-v'], {
              cwd: process.cwd()
            });

          case 8:
            ver = _context.sent;
            spinner.stop();
            sh.echo(install.stdout + "\n".concat(success('安装完成')));
            sh.echo(ver.stdout);

          case 12:
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
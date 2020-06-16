"use strict";

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("regenerator-runtime/runtime");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var apollo = require('node-apollo'),
    path = require('path'),
    fs = require('fs'),
    sh = require('shelljs');

var _require = require('./index'),
    error = _require.error,
    writeFile = _require.writeFile;

var _require2 = require('./global'),
    gitDir = _require2.gitDir;

var config = require('./config');

module.exports = function () {
  var _apolloConfig = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var now, apolloConfig, fileDate, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            now = new Date().getTime();

            if (!sh.test('-f', gitDir + '/buildConfig.json')) {
              _context.next = 5;
              break;
            }

            fileDate = parseInt(sh.cat(gitDir + '/buildConfig.txt').stdout);

            if (!(now - fileDate < 24 * 60 * 60 * 1000)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", require(gitDir + '/buildConfig.json'));

          case 5:
            if (config.apolloConfig) {
              _context.next = 9;
              break;
            }

            sh.echo(error('请配置apollo'));
            sh.exit(1);
            return _context.abrupt("return");

          case 9:
            try {
              apolloConfig = JSON.parse(config.apolloConfig);
            } catch (err) {
              apolloConfig = config.apolloConfig;
            }

            _context.next = 12;
            return apollo.remoteConfigService(apolloConfig);

          case 12:
            result = _context.sent;
            _context.next = 15;
            return writeFile(gitDir + '/buildConfig.txt', String(now));

          case 15:
            _context.next = 17;
            return writeFile(gitDir + '/buildConfig.json', JSON.stringify(result.content));

          case 17:
            return _context.abrupt("return", result.content);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  function apolloConfig() {
    return _apolloConfig.apply(this, arguments);
  }

  return apolloConfig;
}();
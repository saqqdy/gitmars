'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var colors = require('colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);

function warning(txt) {
  return colors__default['default'].yellow(txt);
}
function error(txt) {
  return colors__default['default'].red(txt);
}
function success(txt) {
  return colors__default['default'].green(txt);
}
function writeFile(url, data) {
  return new Promise((resolve, reject) => {
    fs__default['default'].writeFile(url, data, err => {
      if (err) {
        reject(new Error('文件写入错误'));
      } else {
        resolve(true);
      }
    });
  });
}
function createArgs(args) {
  let argArr = [];
  args.forEach(arg => {
    let str = arg.name;
    if (arg.variadic) str += '...';
    if (arg.required) str = '<' + str + '>';else str = '[' + str + ']';
    argArr.push(str);
  });
  return argArr.join(' ');
}
var tools = {
  warning,
  error,
  success,
  writeFile,
  createArgs
};

exports.createArgs = createArgs;
exports['default'] = tools;
exports.error = error;
exports.success = success;
exports.warning = warning;
exports.writeFile = writeFile;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const colors = require("colors");
function warning(txt) {
  return colors.yellow(txt);
}
function error(txt) {
  return colors.red(txt);
}
function success(txt) {
  return colors.green(txt);
}

exports.error = error;
exports.success = success;
exports.warning = warning;

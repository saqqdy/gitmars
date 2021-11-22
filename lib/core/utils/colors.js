'use strict';

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
module.exports = {
  warning,
  error,
  success
};

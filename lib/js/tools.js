'use strict';

const fs = require("fs");
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
function writeFile(url, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(url, data, (err) => {
      if (err) {
        reject(new Error("\u6587\u4EF6\u5199\u5165\u9519\u8BEF"));
      } else {
        resolve(true);
      }
    });
  });
}
function createArgs(args) {
  const argArr = [];
  args.forEach((arg) => {
    let str = arg.name;
    if (arg.variadic)
      str += "...";
    if (arg.required)
      str = "<" + str + ">";
    else
      str = "[" + str + "]";
    argArr.push(str);
  });
  return argArr.join(" ");
}
module.exports = {
  warning,
  error,
  success,
  writeFile,
  createArgs
};

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const sh = require("shelljs");
const { getCurrent } = require("../index");
function getAheadLogs() {
  const current = getCurrent();
  sh.exec("git fetch", { silent: true });
  const result = sh.exec(`git log origin/${current}..${current} --pretty=format:"%p"`, {
    silent: true
  }).stdout.replace(/\s+$/g, "");
  return result ? result.split("\n") : [];
}

exports["default"] = getAheadLogs;
exports.getAheadLogs = getAheadLogs;

'use strict';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const crossSpawn = require("cross-spawn");
const { debug } = require("./utils/debug");
function spawn(client, argv, options) {
  let len = argv.length;
  while (len--) {
    !argv[len] && argv.splice(len, 1);
  }
  const program = crossSpawn.sync(client, argv, __spreadValues({
    shell: process.platform === "win32"
  }, options));
  debug(client, argv);
  return {
    pid: program.pid,
    stdout: program.stdout ? program.stdout.toString().replace(/\s+$/, "") : "",
    stderr: program.stderr ? program.stderr.toString() : "",
    status: program.status,
    signal: program.signal,
    error: program.error
  };
}
function spawnSync(client, argv, options) {
  let len = argv.length;
  while (len--) {
    !argv[len] && argv.splice(len, 1);
  }
  const program = crossSpawn.sync(client, argv, __spreadValues({
    shell: process.platform === "win32"
  }, options));
  debug(client, argv);
  return {
    pid: program.pid,
    stdout: program.stdout ? program.stdout.toString().replace(/\s+$/, "") : "",
    stderr: program.stderr ? program.stderr.toString() : "",
    status: program.status,
    signal: program.signal,
    error: program.error
  };
}
module.exports = {
  spawnSync,
  spawn
};

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
const sh = require("shelljs");
const { defaults } = require("./global");
const gitRevParse = require("./gitRevParse");
const configFrom = require("./configFrom");
const { root } = gitRevParse();
const getConfig = () => {
  let config = {};
  if (configFrom === 1) {
    const str = sh.cat(root + "/.gitmarsrc").stdout.replace(/(^\n*)|(\n*$)/g, "").replace(/\n{2,}/g, "\n").replace(/\r/g, "").replace(/[^\S\x0a\x0d]/g, "");
    let arr = [];
    if (str)
      arr = str.split("\n");
    arr.forEach((el) => {
      el.replace(/^([a-zA-Z0-9]+)\=([\s\S]+)$/, (a, b, c) => {
        config[b] = c || null;
        return "";
      });
    });
  } else if (configFrom === 2) {
    config = require(root + "/gitmarsconfig.json");
  }
  return __spreadValues(__spreadValues({}, defaults), config);
};
module.exports = getConfig();

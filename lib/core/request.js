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
const https = require("https");
const { URL } = require("url");
function request(options) {
  const url = new URL(options.url);
  return new Promise((resolve, reject) => {
    const req = https.request(__spreadValues({
      hostname: url.hostname,
      port: url.port,
      path: `${url.pathname}${url.search}`,
      method: "GET"
    }, options), (res) => {
      res.on("data", (buf) => {
        const data = Buffer.from(buf).toString();
        let result = null;
        try {
          result = JSON.parse(data);
        } catch (e) {
        }
        if (result.code === 0) {
          resolve(result);
        } else {
          reject(result);
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}
module.exports = request;

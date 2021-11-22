'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function debug(...args) {
  if (["1", "true"].includes(process.env.HUSKY_DEBUG || "")) {
    console.info("gitmars:debug", ...args);
  }
}

exports.debug = debug;
exports["default"] = debug;

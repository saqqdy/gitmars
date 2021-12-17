'use strict';

(function(root) {
  const cmdConfig = {
    command: "suggest",
    short: "sg",
    args: [],
    options: [],
    validatorOpts: (val, opts, cb) => {
      cb();
    },
    validatorArgs: (val, opts, cb) => {
      cb();
    },
    transformOpts: (val, opts, cb) => {
      cb();
    },
    transformArgs: (val, opts, cb) => {
      cb();
    }
  };
  if (typeof exports === "object" && typeof module === "object")
    module.exports = cmdConfig;
  else if (typeof exports === "object")
    exports["cmdConfig"] = cmdConfig;
  else {
    if (!root.gitmarsCmdConfig)
      root.gitmarsCmdConfig = {};
    root.gitmarsCmdConfig["suggest"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

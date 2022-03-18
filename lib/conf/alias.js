'use strict';

(function(root) {
  const cmdConfig = {
    command: "alias",
    short: null,
    args: [
      {
        required: true,
        name: "action",
        variadic: false,
        description: "\u6267\u884C\u65B9\u6CD5"
      }
    ],
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
    root.gitmarsCmdConfig["alias"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

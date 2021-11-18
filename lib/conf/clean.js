'use strict';

(function(root) {
  const cmdConfig = {
    command: "clean",
    short: null,
    args: [],
    options: [
      {
        flags: "-f, --force",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-f",
        long: "--force",
        negate: false,
        description: "\u5F3A\u5236\u6E05\u7406",
        defaultValue: false
      }
    ],
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
    root.gitmarsCmdConfig["clean"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

'use strict';

(function(root) {
  const cmdConfig = {
    command: "upgrade",
    short: "ug",
    args: [
      {
        required: false,
        name: "version",
        variadic: false,
        validator: (val, opts, cb) => {
          if (/\s+/.test(val)) {
            cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
            return;
          }
          cb();
        },
        description: "\u7248\u672C\u53F7"
      }
    ],
    options: [
      {
        flags: "-m, --mirror",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-m",
        long: "--mirror",
        negate: false,
        description: "\u662F\u5426\u4F7F\u7528\u6DD8\u5B9D\u955C\u50CF",
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
    root.gitmarsCmdConfig["upgrade"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

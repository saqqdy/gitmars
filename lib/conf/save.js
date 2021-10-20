'use strict';

(function(root) {
  const cmdConfig = {
    command: "save",
    short: "sv",
    args: [
      {
        required: false,
        name: "message",
        variadic: false,
        validator: (val, opts, cb) => {
          if (/\s+/.test(val)) {
            cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
            return;
          }
          cb();
        },
        description: "\u5B58\u53D6\u5173\u952E\u5B57"
      }
    ],
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
        description: "\u6CA1\u6709\u7248\u672C\u7684\u6587\u4EF6\u4E5F\u6682\u5B58\uFF0C\u8FD9\u4F1A\u6267\u884Cgit add .",
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
    root.gitmarsCmdConfig["save"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

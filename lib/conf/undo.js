'use strict';

(function(root) {
  const cmdConfig = {
    command: "undo",
    short: "ud",
    args: [
      {
        required: false,
        name: "commitid",
        variadic: true,
        validator: (val, opts, cb) => {
          cb();
        },
        description: "\u9700\u8981\u64A4\u9500\u7684ID"
      }
    ],
    options: [
      {
        flags: "-b, --branch [branch]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-b",
        long: "--branch",
        negate: false,
        description: "\u9700\u8981\u64A4\u9500\u7684\u5206\u652F\u540D",
        defaultValue: ""
      },
      {
        flags: "-m, --mode [mode]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-m",
        long: "--mode",
        negate: false,
        description: "\u9488\u5BF9\u64A4\u9500\u4E00\u6B21merge\u8BB0\u5F55\uFF0C\u9700\u8981\u4F20\u5165\u7C7B\u578B\uFF1A1 = \u4FDD\u7559\u5F53\u524D\u5206\u652F\u4EE3\u7801\uFF0C2 = \u4FDD\u7559\u4F20\u5165\u4EE3\u7801",
        defaultValue: 1
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
    root.gitmarsCmdConfig["undo"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);
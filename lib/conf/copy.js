'use strict';

(function(root) {
  const cmdConfig = {
    command: "copy",
    short: "cp",
    args: [
      {
        required: false,
        name: "commitid",
        variadic: true,
        validator: (val, opts, cb) => {
          cb();
        },
        description: "\u63D0\u4EA4\u8BB0\u5F55ID"
      }
    ],
    options: [
      {
        flags: "-s, --source [source]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-s",
        long: "--source",
        negate: false,
        description: "\u62F7\u8D1D\u8BB0\u5F55\u7684\u6765\u6E90\u5206\u652F",
        defaultValue: ""
      },
      {
        flags: "-k, --key [keyword]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-k",
        long: "--key",
        negate: false,
        description: "\u6A21\u7CCA\u641C\u7D22commit\u4FE1\u606F\u5173\u952E\u8BCD",
        defaultValue: ""
      },
      {
        flags: "-a, --author [author]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-a",
        long: "--author",
        negate: false,
        description: "\u63D0\u4EA4\u8005",
        defaultValue: ""
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
    root.gitmarsCmdConfig["copy"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

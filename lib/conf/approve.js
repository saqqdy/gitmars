'use strict';

(function(root) {
  const cmdConfig = {
    command: "approve",
    short: "ap",
    args: [],
    options: [
      {
        flags: "--state [state]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--state",
        negate: false,
        description: "\u7B5B\u9009\u5408\u5E76\u8BF7\u6C42\u72B6\u6001\uFF0C\u5171\u67092\u79CD\uFF1Aopened\u3001closed\uFF0C\u4E0D\u4F20\u5219\u9ED8\u8BA4\u5168\u90E8",
        defaultValue: "opened",
        options: ["opened", "closed", "merged", "all"],
        value: "opened"
      },
      {
        flags: "--quiet",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--quiet",
        negate: false,
        description: "\u4E0D\u8981\u63A8\u9001\u6D88\u606F",
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
    root.gitmarsCmdConfig["approve"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

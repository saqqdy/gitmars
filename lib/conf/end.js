'use strict';

(function(root) {
  const cmdConfig = {
    command: "end",
    short: "ed",
    args: [
      {
        required: false,
        name: "type",
        variadic: false,
        description: "\u5206\u652F\u7C7B\u578B",
        options: ["feature", "bugfix", "support"],
        value: ""
      },
      {
        required: false,
        name: "name",
        variadic: false,
        description: "\u5206\u652F\u540D\u79F0(\u4E0D\u5E26feature/bugfix\u524D\u7F00)"
      }
    ],
    options: [
      {
        flags: "--no-combine",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--no-combine",
        negate: true,
        description: "\u4E0D\u5408\u5E76\u4E3B\u5E72\u5206\u652F\uFF08\u8BF7\u786E\u4FDD\u5206\u652F\u5DF2\u7ECF\u4E0A\u7EBF\uFF09",
        defaultValue: true,
        recommend: false
      },
      {
        flags: "--as-feature",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--as-feature",
        negate: false,
        description: "bug\u5206\u652F\u5408\u5E76\u5230release",
        recommend: false
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
    root.gitmarsCmdConfig["end"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

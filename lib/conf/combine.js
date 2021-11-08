'use strict';

(function(root) {
  const cmdConfig = {
    command: "combine",
    short: "cb",
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
        flags: "-d, --dev",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-d",
        long: "--dev",
        negate: false,
        description: "\u540C\u6B65\u5230dev\u73AF\u5883",
        defaultValue: false,
        value: true,
        recommend: true
      },
      {
        flags: "-p, --prod",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-p",
        long: "--prod",
        negate: false,
        description: "\u540C\u6B65\u5230prod\u73AF\u5883",
        defaultValue: false,
        value: false,
        recommend: false
      },
      {
        flags: "-b, --build [build]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-b",
        long: "--build",
        negate: false,
        description: "\u6784\u5EFA\u5E94\u7528",
        value: "all",
        recommend: true
      },
      {
        flags: "-m, --commit <commit>",
        required: true,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-m",
        long: "--commit",
        negate: false,
        description: "\u6267\u884Ccommit\uFF0C\u9700\u586B\u5199\u4FE1\u606F",
        defaultValue: "",
        recommend: false
      },
      {
        flags: "--description [description]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        long: "--description",
        negate: false,
        description: "\u672C\u6B21\u63D0\u4EA4\u7684\u539F\u56E0\u63CF\u8FF0",
        defaultValue: "",
        recommend: false
      },
      {
        flags: "-a, --add",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-a",
        long: "--add",
        negate: false,
        description: "\u6267\u884Cadd",
        defaultValue: false,
        recommend: false
      },
      {
        flags: "--no-bugfix",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--no-bugfix",
        negate: true,
        description: "bug\u5206\u652F\u5408\u5E76\u5230release\u65F6\u4E0D\u5408\u5E76\u5230bug\u5206\u652F",
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
      if (!val.includes("--dev") && !val.includes("--prod")) {
        cb(new Error("\u5408\u5E76dev\u6216\u8005prod\u5FC5\u987B\u81F3\u5C11\u9009\u4E00\u4E2A"));
        return;
      }
      if (val.includes("--add") && !val.includes("--commit") || !val.includes("--add") && val.includes("--commit")) {
        cb(new Error("add\u548Ccommit\u9700\u8981\u540C\u65F6\u9009\u62E9"));
        return;
      }
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
    root.gitmarsCmdConfig["combine"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

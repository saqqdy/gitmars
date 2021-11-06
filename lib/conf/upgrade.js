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
      },
      {
        flags: "-c, --client [client]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-c",
        long: "--client",
        negate: false,
        description: "\u7528\u4E8E\u88C5\u5305\u7684\u5BA2\u6237\u7AEF\u540D\u79F0",
        defaultValue: "npm",
        recommend: true,
        value: "npm"
      },
      {
        flags: "-r, --registry <registry>",
        required: true,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-r",
        long: "--registry",
        negate: false,
        description: "\u4F7F\u7528\u955C\u50CF\u5730\u5740",
        defaultValue: "",
        recommend: true,
        value: "https://registry.npm.taobao.org"
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

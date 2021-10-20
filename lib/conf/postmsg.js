'use strict';

(function(root) {
  const cmdConfig = {
    command: "postmsg",
    short: null,
    args: [
      {
        required: true,
        name: "message",
        variadic: false
      }
    ],
    options: [
      {
        flags: "-u, --url [url]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-u",
        long: "--url",
        negate: false,
        description: "\u63A8\u9001\u6D88\u606F\u7684api\u5730\u5740",
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
    root.gitmarsCmdConfig["postmsg"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

'use strict';

(function(root) {
  const cmdConfig = {
    command: "get",
    short: "gt",
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
      },
      {
        required: false,
        name: "index",
        variadic: false,
        description: "\u5E8F\u53F7"
      }
    ],
    options: [
      {
        flags: "-k, --keep [keep]",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-k",
        long: "--keep",
        negate: false,
        description: "\u4FDD\u7559\u6682\u5B58\u533A\u4E0D\u5220\u9664",
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
    root.gitmarsCmdConfig["get"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

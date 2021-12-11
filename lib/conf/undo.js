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
        flags: "--lastet [lastet]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--lastet",
        negate: false,
        description: "\u67E5\u8BE2\u5728\u67D0\u4E2A\u65F6\u95F4\u4E4B\u540E\u7684\u65E5\u5FD7\uFF0C\u586B\u5199\u683C\u5F0F\uFF1A10s/2m/2h/3d/4M/5y",
        defaultValue: "7d"
      },
      {
        flags: "--no-merges",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--no-merges",
        negate: true,
        description: "\u662F\u5426\u6392\u9664merge\u8BB0\u5F55",
        defaultValue: true,
        recommend: false
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
        defaultValue: null,
        options: [1, 2],
        value: null
      },
      {
        flags: "--limit [limit]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--limit",
        negate: false,
        description: "\u6700\u591A\u67E5\u8BE2\u7684\u65E5\u5FD7\u6761\u6570",
        defaultValue: 20
      },
      {
        flags: "--calc",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--calc",
        negate: false,
        description: "\u6E05\u7406\u5F53\u524D\u5206\u652F\u64A4\u9500\u5931\u8D25\u7684\u8BB0\u5F55",
        recommend: false
      },
      {
        flags: "--calcAll",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--calcAll",
        negate: false,
        description: "\u6E05\u7406\u6240\u6709\u5206\u652F\u64A4\u9500\u5931\u8D25\u7684\u8BB0\u5F55",
        recommend: false
      }
    ],
    validatorOpts: (val, opts, cb) => {
      if ((val.includes("--calc") || val.includes("--calcAll")) && val.length > 1) {
        cb(new Error("--calc\u548C--calcAll\u53EA\u80FD\u5355\u72EC\u4F7F\u7528"));
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
    root.gitmarsCmdConfig["undo"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

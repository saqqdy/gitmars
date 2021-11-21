'use strict';

(function(root) {
  const cmdConfig = {
    command: "cleanbranch",
    short: "clb",
    args: [
      {
        required: false,
        name: "branches",
        variadic: true,
        validator: (val, opts, cb) => {
          cb();
        },
        description: "\u6307\u5B9A\u8981\u6E05\u7406\u7684\u5206\u652F"
      }
    ],
    options: [
      {
        flags: "-l, --list",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-l",
        long: "--list",
        negate: false,
        description: "\u663E\u793A\u7B26\u5408\u6761\u4EF6\u7684\u5206\u652F\u5217\u8868",
        defaultValue: false
      },
      {
        flags: "-t, --type [type]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-t",
        long: "--type",
        negate: false,
        description: "\u5206\u652F\u7684\u7C7B\u578B\uFF0C\u5171\u67093\u79CD\uFF1Afeature\u3001bugfix\u3001support\uFF0C\u4E0D\u4F20\u5219\u9ED8\u8BA4\u5168\u90E8",
        defaultValue: null,
        options: ["feature", "bugfix", "support"],
        value: ""
      },
      {
        flags: "--target [target]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--target",
        negate: false,
        description: "\u9700\u8981\u68C0\u6D4B\u662F\u5426\u5408\u8FC7\u7684\u76EE\u6807\u5206\u652F\u540D\uFF0C\u4E0D\u4F20\u9ED8\u8BA4\u662Fdevelop\u548Crelease",
        defaultValue: null,
        value: ""
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
        description: "\u67E5\u8BE2\u5206\u652F\u7684\u5173\u952E\u8BCD",
        defaultValue: null
      },
      {
        flags: "--exclude [exclude]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--exclude",
        negate: false,
        description: "\u6392\u9664\u5173\u952E\u8BCD",
        defaultValue: "",
        value: ""
      },
      {
        flags: "--include [include]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--include",
        negate: false,
        description: "\u5305\u542B\u5173\u952E\u8BCD",
        defaultValue: "",
        value: ""
      },
      {
        flags: "-r, --remote",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-r",
        long: "--remote",
        negate: false,
        description: "\u662F\u5426\u6E05\u7406\u8FDC\u7A0B\u5206\u652F\uFF0C\u9ED8\u8BA4\u6E05\u7406\u672C\u5730\u5206\u652F",
        defaultValue: false
      },
      {
        flags: "-c, --confirm",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-c",
        long: "--confirm",
        negate: false,
        description: "\u786E\u8BA4\u5F00\u59CB\uFF0C\u4E3Atrue\u65F6\u4E0D\u663E\u793A\u786E\u8BA4\u6846",
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
    root.gitmarsCmdConfig["cleanbranch"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

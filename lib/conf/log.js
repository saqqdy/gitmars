'use strict';

(function(root) {
  const cmdConfig = {
    command: "log",
    short: "lg",
    args: [
      {
        required: false,
        name: "branch",
        variadic: false
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
        flags: "--json",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--json",
        negate: false,
        description: "\u662F\u5426\u4EE5json\u683C\u5F0F\u8F93\u51FA\u65E5\u5FD7\uFF0C\u9ED8\u8BA4\u8868\u683C\u65B9\u5F0F",
        defaultValue: false
      }
    ]
  };
  if (typeof exports === "object" && typeof module === "object")
    module.exports = cmdConfig;
  else if (typeof exports === "object")
    exports["cmdConfig"] = cmdConfig;
  else {
    if (!root.gitmarsCmdConfig)
      root.gitmarsCmdConfig = {};
    root.gitmarsCmdConfig["log"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

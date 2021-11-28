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
        optional: false,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--lastet",
        negate: false,
        description: "\u67E5\u8BE2\u5728\u67D0\u4E2A\u65F6\u95F4\u4E4B\u540E\u7684\u65E5\u5FD7\uFF0C\u586B\u5199\u683C\u5F0F\uFF1A10s/2m/2h/3d/4M/5y",
        defaultValue: "7d"
      },
      {
        flags: "--limit [limit]",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--limit",
        negate: false,
        description: "\u6700\u591A\u67E5\u8BE2\u7684\u65E5\u5FD7\u6761\u6570",
        defaultValue: 20
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

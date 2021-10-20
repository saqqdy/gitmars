'use strict';

(function(root) {
  const cmdConfig = {
    command: "hook",
    short: "hk",
    args: [
      {
        required: false,
        name: "command",
        variadic: false
      },
      {
        required: false,
        name: "args",
        variadic: true
      }
    ],
    options: [
      {
        flags: "--no-verify",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--no-verify",
        negate: true,
        description: "\u662F\u5426\u9700\u8981\u8DF3\u8FC7\u6821\u9A8C\u6743\u9650",
        defaultValue: false
      },
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
      },
      {
        flags: "-t, --type <type>",
        required: true,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-t",
        long: "--type",
        negate: false,
        description: "\u68C0\u6D4B\u7C7B\u578B",
        defaultValue: ""
      },
      {
        flags: "--branch [branch]",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--branch",
        negate: false,
        description: "\u8981\u67E5\u8BE2\u7684\u5206\u652F",
        defaultValue: ""
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
    root.gitmarsCmdConfig["hook"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

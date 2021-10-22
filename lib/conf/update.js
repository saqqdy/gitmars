'use strict';

(function(root) {
  const cmdConfig = {
    command: "update",
    short: "up",
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
        flags: "--use-merge",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--use-merge",
        negate: false,
        description: "\u4F7F\u7528merge\u65B9\u5F0F\u66F4\u65B0(\u9ED8\u8BA4merge)",
        defaultValue: true,
        value: true,
        recommend: true
      },
      {
        flags: "--use-rebase",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        long: "--use-rebase",
        negate: false,
        description: "\u4F7F\u7528rebase\u65B9\u5F0F\u66F4\u65B0(\u9ED8\u8BA4merge)",
        defaultValue: false,
        recommend: true
      },
      {
        flags: "-a --all",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-a",
        long: "--all",
        negate: false,
        description: "\u66F4\u65B0\u672C\u5730\u6240\u6709bugfix\u3001feature\u3001support\u5206\u652F",
        defaultValue: false,
        recommend: false
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
    root.gitmarsCmdConfig["update"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

'use strict';

(function(root) {
  const cmdConfig = {
    command: "build",
    short: "bd",
    args: [
      {
        required: true,
        name: "project",
        variadic: false,
        description: "\u9879\u76EE\u540D\u79F0"
      }
    ],
    options: [
      {
        flags: "-e, --env [env]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-e",
        long: "--env",
        negate: false,
        description: "\u6784\u5EFA\u73AF\u5883\uFF0C\u53EF\u9009dev\u3001prod\u3001bug\u3001all",
        defaultValue: "dev",
        recommend: true,
        options: ["dev", "prod", "bug", "all"],
        value: "dev"
      },
      {
        flags: "-a, --app [app]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-a",
        long: "--app",
        negate: false,
        description: "\u6784\u5EFA\u5E94\u7528",
        defaultValue: "all",
        recommend: true,
        value: "all"
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
    root.gitmarsCmdConfig["build"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

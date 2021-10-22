'use strict';

(function(root) {
  const cmdConfig = {
    command: "start",
    short: "st",
    args: [
      {
        required: true,
        name: "type",
        variadic: false,
        description: "\u5206\u652F\u7C7B\u578B"
      },
      {
        required: true,
        name: "name",
        variadic: false,
        description: "\u5206\u652F\u540D\u79F0(\u4E0D\u5E26feature/bugfix\u524D\u7F00)"
      }
    ],
    options: [
      {
        flags: "-t, --tag <tag>",
        required: true,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-t",
        long: "--tag",
        negate: false,
        description: "\u4ECEtag\u521B\u5EFA\u5206\u652F",
        defaultValue: "",
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
    root.gitmarsCmdConfig["start"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

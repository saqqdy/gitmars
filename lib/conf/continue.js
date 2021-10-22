'use strict';

(function(root) {
  const cmdConfig = {
    command: "continue",
    short: "ct",
    args: [],
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
        description: "\u663E\u793A\u6307\u4EE4\u961F\u5217",
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
    root.gitmarsCmdConfig["continue"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

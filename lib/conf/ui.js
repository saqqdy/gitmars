'use strict';

(function(root) {
  const cmdConfig = {
    command: "ui",
    short: null,
    args: [],
    options: [
      {
        flags: "-p, --port [port]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-p",
        long: "--port",
        negate: false,
        description: "\u6307\u5B9A\u7AEF\u53E3\u53F7",
        defaultValue: 3e3,
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
    root.gitmarsCmdConfig["ui"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

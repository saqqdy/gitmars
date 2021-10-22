'use strict';

(function(root) {
  const cmdConfig = {
    command: "run",
    short: "",
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
    options: []
  };
  if (typeof exports === "object" && typeof module === "object")
    module.exports = cmdConfig;
  else if (typeof exports === "object")
    exports["cmdConfig"] = cmdConfig;
  else {
    if (!root.gitmarsCmdConfig)
      root.gitmarsCmdConfig = {};
    root.gitmarsCmdConfig["run"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

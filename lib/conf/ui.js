'use strict';

(function(root) {
  const cmdConfig = {
    command: "ui",
    short: null,
    args: [],
    options: []
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

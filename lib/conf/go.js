'use strict';

(function(root) {
  const cmdConfig = {
    command: "go",
    short: "",
    args: [
      {
        required: false,
        name: "command",
        variadic: false,
        description: "\u6307\u4EE4\u540D\u79F0",
        options: [
          "combine",
          "end",
          "update",
          "build",
          "start",
          "admin.publish",
          "admin.update",
          "admin.create",
          "admin.clean",
          "branch",
          "copy",
          "get",
          "save",
          "cleanbranch",
          "clean",
          "revert",
          "link",
          "unlink",
          "postmsg"
        ],
        value: ""
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
    root.gitmarsCmdConfig["go"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

'use strict';

(function(root) {
  const cmdConfig = {
    command: "unlink",
    short: null,
    args: [
      {
        required: false,
        name: "name",
        variadic: false,
        validator: (val, opts, cb) => {
          if (/\s+/.test(val)) {
            cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
            return;
          }
          cb();
        },
        description: "\u5305\u7684\u540D\u79F0"
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
    root.gitmarsCmdConfig["unlink"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

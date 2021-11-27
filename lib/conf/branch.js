'use strict';

(function(root) {
  const cmdConfig = {
    command: "branch",
    short: "bh",
    args: [],
    options: [
      {
        flags: "-k, --key [keyword]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-k",
        long: "--key",
        negate: false,
        description: "\u67E5\u8BE2\u5206\u652F\u7684\u5173\u952E\u8BCD",
        defaultValue: null
      },
      {
        flags: "--exclude [exclude]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--exclude",
        negate: false,
        description: "\u6392\u9664\u5173\u952E\u8BCD",
        defaultValue: "",
        value: ""
      },
      {
        flags: "--include [include]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "",
        long: "--include",
        negate: false,
        description: "\u5305\u542B\u5173\u952E\u8BCD",
        defaultValue: "",
        value: ""
      },
      {
        flags: "-r, --remote",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-r",
        long: "--remote",
        negate: false,
        description: "\u662F\u5426\u67E5\u8BE2\u8FDC\u7A0B\u5206\u652F\uFF08deletes\u6A21\u5F0F\u4E0B\u6539\u7528\u4E8E\u5220\u9664\u8FDC\u7A0B\u5206\u652F\uFF09\u9ED8\u8BA4\u53EA\u67E5\u8BE2\u672C\u5730",
        defaultValue: false
      },
      {
        flags: "-t, --type [type]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-t",
        long: "--type",
        negate: false,
        description: "\u67E5\u8BE2\u5206\u652F\u7684\u7C7B\u578B\uFF0C\u5171\u67093\u79CD\uFF1Afeature\u3001bugfix\u3001support\uFF0C\u4E0D\u4F20\u5219\u67E5\u8BE2\u5168\u90E8",
        defaultValue: null,
        options: ["feature", "bugfix", "support"],
        value: ""
      },
      {
        flags: "-d, --delete [branch]",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-d",
        long: "--delete",
        negate: false,
        description: "\u5220\u9664\u5206\u652F",
        defaultValue: null
      },
      {
        flags: "-D, --forcedelete [branch]",
        required: false,
        optional: false,
        variadic: false,
        mandatory: false,
        short: "-D",
        long: "--forcedelete",
        negate: false,
        description: "\u5F3A\u884C\u5220\u9664\u5206\u652F",
        defaultValue: null
      },
      {
        flags: "-u, --upstream [upstream]",
        required: false,
        optional: true,
        variadic: false,
        mandatory: false,
        short: "-u",
        long: "--upstream",
        negate: false,
        description: "\u8BBE\u7F6E\u4E0E\u8FDC\u7A0B\u5206\u652F\u5173\u8054"
      }
    ],
    validatorOpts: (val, opts, cb) => {
      if (val.includes("--upstream") && (val.includes("--key") || val.includes("--remote") || val.includes("--type") || val.includes("--delete") || val.includes("--forcedelete"))) {
        cb(new Error("\u4F7F\u7528\u7ED1\u5B9A/\u53D6\u6D88\u7ED1\u5B9A\u8FDC\u7A0B\u5206\u652F\u529F\u80FD\u65F6\uFF0C\u4E0D\u80FD\u4E0E\u5176\u4ED6\u529F\u80FD\u6DF7\u7528"));
        return;
      }
      if ((val.includes("--delete") || val.includes("--forcedelete")) && (val.includes("--key") || val.includes("--type"))) {
        cb(new Error("\u4F7F\u7528\u5220\u9664\u5206\u652F\u529F\u80FD\u65F6\uFF0C\u4E0D\u80FD\u4E0E\u67E5\u8BE2\u5206\u652F\u529F\u80FD\u6DF7\u7528"));
        return;
      }
      cb();
    },
    validatorArgs: (val, opts, cb) => {
      cb();
    },
    transformOpts: (val, opts, cb) => {
      cb();
    },
    transformArgs: (val, opts, cb) => {
      cb();
    }
  };
  if (typeof exports === "object" && typeof module === "object")
    module.exports = cmdConfig;
  else if (typeof exports === "object")
    exports["cmdConfig"] = cmdConfig;
  else {
    if (!root.gitmarsCmdConfig)
      root.gitmarsCmdConfig = {};
    root.gitmarsCmdConfig["branch"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

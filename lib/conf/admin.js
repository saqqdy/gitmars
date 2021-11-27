'use strict';

(function(root) {
  const cmdConfig = {
    command: "admin",
    short: null,
    create: {
      command: "create",
      short: null,
      args: [
        {
          required: true,
          name: "type",
          variadic: false,
          validator: (val, opts, cb) => {
            if (/\s+/.test(val)) {
              cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
              return;
            }
            cb();
          },
          description: "\u5206\u652F\u7C7B\u578B"
        }
      ],
      options: [],
      validatorOpts: (val, opts, cb) => {
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
    },
    publish: {
      command: "publish",
      short: null,
      args: [
        {
          required: true,
          name: "type",
          variadic: false,
          validator: (val, opts, cb) => {
            if (/\s+/.test(val)) {
              cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
              return;
            }
            cb();
          },
          description: "\u5206\u652F\u7C7B\u578B",
          options: ["release", "bugfix"],
          value: ""
        }
      ],
      options: [
        {
          flags: "-c, --combine",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          short: "-c",
          long: "--combine",
          negate: false,
          description: "\u662F\u5426\u628Arelease\u4EE3\u7801\u540C\u6B65\u5230bug",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "--use-rebase",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          long: "--use-rebase",
          negate: false,
          description: "\u662F\u5426\u4F7F\u7528rebase\u65B9\u5F0F\u66F4\u65B0\uFF0C\u9ED8\u8BA4merge",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "-p, --prod",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          short: "-p",
          long: "--prod",
          negate: false,
          description: "\u53D1\u5E03bug\u5206\u652F\u65F6\uFF0C\u662F\u5426\u5408\u5E76bug\u5230master",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "-b, --build [build]",
          required: false,
          optional: true,
          variadic: false,
          mandatory: false,
          short: "-b",
          long: "--build",
          negate: false,
          description: "\u6784\u5EFA\u5E94\u7528",
          recommend: true
        },
        {
          flags: "--postmsg",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          long: "--postmsg",
          negate: false,
          description: "\u53D1\u9001\u6D88\u606F",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "--description [description]",
          required: false,
          optional: true,
          variadic: false,
          mandatory: false,
          long: "--description",
          negate: false,
          description: "\u672C\u6B21\u63D0\u4EA4\u7684\u539F\u56E0\u63CF\u8FF0",
          defaultValue: "",
          recommend: false
        }
      ],
      validatorOpts: (val, opts, cb) => {
        if (val.includes("--combine") && val.includes("--prod")) {
          cb(new Error("\u4E0D\u80FD\u540C\u65F6\u9009\u62E9\u201C\u628Arelease\u5408\u5E76\u5230bug\u201D\u548C\u201C\u5408\u5E76bug\u5230master\u201D"));
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
    },
    update: {
      command: "update",
      short: null,
      args: [
        {
          required: true,
          name: "type",
          variadic: false,
          validator: (val, opts, cb) => {
            if (/\s+/.test(val)) {
              cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
              return;
            }
            cb();
          },
          description: "\u5206\u652F\u7C7B\u578B"
        }
      ],
      options: [
        {
          flags: "--use-rebase",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          long: "--use-rebase",
          negate: false,
          description: "\u662F\u5426\u4F7F\u7528rebase\u65B9\u5F0F\u66F4\u65B0\uFF0C\u9ED8\u8BA4merge",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "-m, --mode [mode]",
          required: false,
          optional: true,
          variadic: false,
          mandatory: false,
          short: "-m",
          long: "--mode",
          negate: false,
          description: "\u51FA\u73B0\u51B2\u7A81\u65F6\uFF0C\u4FDD\u7559\u4F20\u5165\u4EE3\u7801\u8FD8\u662F\u4FDD\u7559\u5F53\u524D\u4EE3\u7801\uFF1B1=\u91C7\u7528\u5F53\u524D 2=\u91C7\u7528\u4F20\u5165\uFF1B\u9ED8\u8BA4\u4E3A 0=\u624B\u52A8\u5904\u7406\u3002\u672C\u53C2\u6570\u4E0D\u53EF\u4E0E--use-rebase\u540C\u65F6\u4F7F\u7528",
          defaultValue: 0,
          recommend: false
        },
        {
          flags: "--postmsg",
          required: false,
          optional: false,
          variadic: false,
          mandatory: false,
          long: "--postmsg",
          negate: false,
          description: "\u53D1\u9001\u6D88\u606F",
          defaultValue: false,
          recommend: false
        },
        {
          flags: "--description [description]",
          required: false,
          optional: true,
          variadic: false,
          mandatory: false,
          long: "--description",
          negate: false,
          description: "\u672C\u6B21\u63D0\u4EA4\u7684\u539F\u56E0\u63CF\u8FF0",
          defaultValue: "",
          recommend: false
        }
      ],
      validatorOpts: (val, opts, cb) => {
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
    },
    clean: {
      command: "clean",
      short: null,
      args: [
        {
          required: true,
          name: "type",
          variadic: false,
          validator: (val, opts, cb) => {
            if (/\s+/.test(val)) {
              cb(new Error("\u8BF7\u4E0D\u8981\u8F93\u5165\u7A7A\u683C"));
              return;
            }
            cb();
          },
          description: "\u5206\u652F\u7C7B\u578B"
        }
      ],
      options: [],
      validatorOpts: (val, opts, cb) => {
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
    }
  };
  if (typeof exports === "object" && typeof module === "object")
    module.exports = cmdConfig;
  else if (typeof exports === "object")
    exports["cmdConfig"] = cmdConfig;
  else {
    if (!root.gitmarsCmdConfig)
      root.gitmarsCmdConfig = {};
    root.gitmarsCmdConfig["admin"] = cmdConfig;
  }
})(typeof window !== "undefined" ? window : global);

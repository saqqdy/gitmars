'use strict';

var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const { warning } = require("../utils/colors");
const createPrompt = (command, { options, validator, transform }, type) => {
  if (type === "checkbox") {
    if (!options.length)
      return null;
    const promptOpt = {
      type,
      message: "\u8BF7\u9009\u62E9",
      name: command,
      choices: [],
      validate: (answer) => {
        if (validator) {
          let msg = true;
          validator(answer, options, (err) => {
            if (err)
              msg = err.message;
          });
          return msg;
        }
        return true;
      }
    };
    options.forEach((option) => {
      promptOpt.choices.push({
        name: option.description || "",
        value: option.long,
        checked: option.recommend || false
      });
    });
    return promptOpt;
  } else if (type === "input") {
    const list = [];
    options.forEach((_a) => {
      var _b = _a, { validator: childValidator, transformer } = _b, opts = __objRest(_b, ["validator", "transformer"]);
      if (childValidator)
        validator = childValidator;
      const cfg = {
        type: "input",
        name: opts.name,
        message: `${opts.description || "\u8BF7\u8F93\u5165\u53C2\u6570" + opts.name + "\u7684\u503C"}${!opts.required ? warning("(\u53EF\u4E0D\u586B" + ("defaultValue" in opts && opts.defaultValue !== "" ? '\uFF0C\u9ED8\u8BA4"' + opts.defaultValue + '"' : "") + ")") : ""}`,
        transformer: (val, answers, flags) => {
          if (!transformer) {
            return val;
          } else if (transformer instanceof Function) {
            return transformer(val, answers, flags, opts);
          }
        },
        validate: (val) => {
          let msg = true;
          if (!val && opts.required)
            msg = "\u8BF7\u586B\u5199" + opts.description;
          validator && msg === true && validator(val, opts, (err) => {
            if (err)
              msg = err.message;
          });
          return msg;
        }
      };
      if ("defaultValue" in opts && opts.defaultValue !== "")
        cfg.defaultValue = opts.defaultValue;
      list.push(cfg);
    });
    return list;
  }
};
module.exports = createPrompt;

#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const fs = require("fs");
const sh = require("shelljs");
const inquirer = require("inquirer");
const { getIsGitProject, getGitRevParse } = require("./core/git/index");
const { error, success } = require("./core/utils/index");
const { defaults } = require("./core/global");
if (!getIsGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
const { root } = getGitRevParse();
program.name("gitm init").usage("").description("\u8BBE\u7F6Egitmars\u7684\u914D\u7F6E\u9879").action(() => {
  const prompts = [];
  Object.keys(defaults).forEach((key) => {
    if (["master", "develop", "release", "bugfix", "support"].includes(key)) {
      prompts.push({
        type: "input",
        name: key,
        message: `\u8BF7\u8F93\u5165${key}\u5206\u652F\u540D\u79F0`,
        default: () => key,
        transformer: (val) => val.trim(),
        validate: (val) => /^\w+$/.test(val) ? true : "\u8BF7\u8F93\u5165\u53EF\u7528\u540D\u79F0"
      });
    } else if (key === "user") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165Git\u7528\u6237\u540D",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^\w+$/.test(val) ? true : "\u8BF7\u8F93\u5165\u53EF\u7528\u540D\u79F0"
      });
    } else if (key === "email") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165Git\u90AE\u7BB1",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val) ? true : "\u8BF7\u8F93\u5165\u6B63\u786E\u7684\u90AE\u7BB1"
      });
    } else if (key === "nameValidator") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165\u5206\u652F\u540D\u79F0\u547D\u540D\u89C4\u5219",
        transformer: (val) => val.trim()
      });
    } else if (key === "descriptionValidator") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165commit\u4FE1\u606F\u89C4\u5219",
        transformer: (val) => val.trim()
      });
    } else if (key === "msgTemplate") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165\u6D88\u606F\u6A21\u677F",
        default: () => "${message}\uFF1B\u9879\u76EE\uFF1A${project}\uFF1B\u8DEF\u5F84\uFF1A${pwd}",
        transformer: (val) => val.trim()
      });
    } else if (key === "msgUrl") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165\u6D88\u606F\u63A8\u9001\u5730\u5740",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^https?:\/\/[\S]*$/.test(val) ? true : "\u8BF7\u8F93\u5165\u7F51\u5740"
      });
    } else if (key === "apolloConfig") {
      prompts.push({
        type: "editor",
        name: key,
        message: "\u8BF7\u8F93\u5165apollo\u914D\u7F6E",
        default: () => `{
    "configServerUrl": "",
    "appId": "",
    "clusterName": "",
    "namespaceName": [],
    "apolloEnv": "",
    "token": ""
}`,
        validate: (val) => {
          try {
            val = JSON.parse(val);
            return true;
          } catch (e) {
            return "\u8BF7\u8F93\u5165json";
          }
        }
      });
    } else if (key === "hooks") {
      prompts.push({
        type: "editor",
        name: key,
        message: "\u8BF7\u8F93\u5165hooks\u914D\u7F6E",
        default: () => `{
    "pre-commit": "",
    "pre-push": ""
}`,
        validate: (val) => {
          try {
            val = JSON.parse(val);
            return !!val;
          } catch (e) {
            return "\u8BF7\u8F93\u5165json";
          }
        }
      });
    } else if (key === "api") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165\u67E5\u8BE2\u7528\u6237\u6743\u9650\u63A5\u53E3",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^https?:\/\/[\S]*$/.test(val) ? true : "\u8BF7\u8F93\u5165\u7F51\u5740"
      });
    } else if (key === "gitHost") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165git\u7F51\u5740",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^https?:\/\/[\S]*$/.test(val) ? true : "\u8BF7\u8F93\u5165\u7F51\u5740"
      });
    } else if (key === "gitID") {
      prompts.push({
        type: "input",
        name: key,
        message: "\u8BF7\u8F93\u5165git\u9879\u76EEID\uFF0C\u76EE\u524D\u4EC5\u652F\u6301gitlab",
        transformer: (val) => val.trim(),
        validate: (val) => val === "" || /^\d+$/.test(val) ? true : "\u8BF7\u8F93\u5165\u7F51\u5740"
      });
    }
  });
  inquirer.prompt(prompts).then((answers) => {
    try {
      answers.apolloConfig = JSON.parse(answers.apolloConfig);
      if (!answers.apolloConfig.configServerUrl || !answers.apolloConfig.token)
        answers.apolloConfig = "";
    } catch (e) {
      answers.apolloConfig = "";
    }
    try {
      let valid = false;
      answers.hooks = JSON.parse(answers.hooks);
      hooks:
        for (const k in answers.hooks) {
          if (answers.hooks[k]) {
            valid = true;
            break hooks;
          }
        }
      if (!valid)
        answers.hooks = "";
    } catch (e) {
      answers.hooks = "";
    }
    sh.echo(success("gitmars\u914D\u7F6E\u6210\u529F"));
    fs.writeFileSync(root + "/.gitmarsrc", JSON.stringify(answers, null, 4), "utf-8");
    fs.chmodSync(root + "/.gitmarsrc", 493);
  });
});
program.parse(process.argv);

'use strict';

const hookList = [
  "applypatch-msg",
  "pre-applypatch",
  "post-applypatch",
  "pre-commit",
  "pre-merge-commit",
  "prepare-commit-msg",
  "commit-msg",
  "post-commit",
  "pre-rebase",
  "post-checkout",
  "post-merge",
  "pre-push",
  "post-update",
  "push-to-checkout",
  "pre-auto-gc",
  "post-rewrite",
  "sendemail-validate"
];
const defaults = {
  master: "master",
  develop: "dev",
  release: "release",
  bugfix: "bug",
  support: "support",
  user: "",
  email: "",
  nameValidator: "",
  descriptionValidator: "",
  msgTemplate: "${message}\uFF1B\u9879\u76EE\uFF1A${project}\uFF1B\u8DEF\u5F84\uFF1A${pwd}",
  msgUrl: "",
  apolloConfig: "",
  hooks: "",
  api: "",
  gitHost: "",
  gitID: ""
};
module.exports = { hookList, defaults };

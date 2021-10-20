'use strict';

const fs = require("fs");
const path = require("path");
const sh = require("shelljs");
const { warning, compareVersion } = require("../index");
const { hookList } = require("../global");
const gitRevParse = require("../gitRevParse");
const getGitVersion = require("../getGitVersion");
const getHookComment = require("./getHookComment");
const getHookType = require("./getHookType");
const getHookShell = require("./getHookShell");
const getLocalShell = require("./getLocalShell");
const ciInfo = require("ci-info");
const getConfig = require("../getConfig");
const { gitHookDir, prefix } = gitRevParse();
const gitVersion = getGitVersion();
const config = getConfig();
function createHooks(dir = gitHookDir) {
  const writeHook = (filename, shell) => {
    fs.writeFileSync(filename, shell, "utf-8");
    fs.chmodSync(filename, 493);
  };
  const hooks = hookList.map((hookName) => path.join(dir, hookName));
  hooks.forEach((filename) => {
    const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`;
    const name = path.basename(filename);
    if (fs.existsSync(filename)) {
      const hook = fs.readFileSync(filename, "utf-8");
      if (getHookType.isGhooks(hook)) {
        console.info(`\u5408\u5E76\u5DF2\u5B58\u5728\u7684ghooks\u94A9\u5B50: ${name}`);
        return writeHook(filename, hookShell);
      }
      if (getHookType.isPreCommit(hook)) {
        console.info(`\u5408\u5E76\u5DF2\u5B58\u5728\u7684pre-commit\u94A9\u5B50: ${name}`);
        return writeHook(filename, hookShell);
      }
      if (getHookType.isGitmars(hook) || getHookType.isHusky(hook) || getHookType.isYorkie(hook)) {
        return writeHook(filename, hookShell);
      }
      console.info(`\u8DF3\u8FC7\u5DF2\u5B58\u5728\u7684\u7528\u6237git\u94A9\u5B50: ${name}`);
      return;
    }
    writeHook(filename, hookShell);
  });
}
function removeHooks(dir = gitHookDir) {
  const hooks = hookList.map((hookName) => path.join(dir, hookName));
  hooks.filter((filename) => {
    if (fs.existsSync(filename)) {
      const hook = fs.readFileSync(filename, "utf-8");
      return getHookType.isGitmars(hook);
    }
    return false;
  }).forEach((filename) => {
    fs.unlinkSync(filename);
  });
}
function createHookShell(dir = gitHookDir) {
  const filename = path.join(dir, "gitmars.sh");
  fs.writeFileSync(filename, getHookShell(), "utf-8");
  fs.chmodSync(filename, 493);
}
function removeHookShell(dir = gitHookDir) {
  const filename = path.join(dir, "gitmars.sh");
  if (fs.existsSync(filename))
    fs.unlinkSync(filename);
}
function createLocalShell(dir = gitHookDir, pmName, relativeUserPkgDir) {
  const filename = path.join(dir, "gitmars.local.sh");
  fs.writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), "utf-8");
  fs.chmodSync(filename, 493);
}
function removeLocalShell(dir = gitHookDir) {
  const filename = path.join(dir, "gitmars.local.sh");
  if (fs.existsSync(filename))
    fs.unlinkSync(filename);
}
function init() {
  const gitVersionIsNew = gitVersion && compareVersion(gitVersion, "2.13.0");
  if (ciInfo.isCI && config.skipCI) {
    console.info("\u6301\u7EED\u96C6\u6210\u73AF\u5883\uFF0C\u8DF3\u8FC7\u94A9\u5B50\u5B89\u88C5");
    return;
  }
  if (!fs.existsSync(gitHookDir)) {
    fs.mkdirSync(gitHookDir);
  }
  if (["1", "true"].includes(process.env.GITMARS_SKIP_HOOKS || "")) {
    sh.echo(warning("\u5DF2\u5B58\u5728\u73AF\u5883\u53D8\u91CFGITMARS_SKIP_HOOKS\uFF0C\u8DF3\u8FC7\u5B89\u88C5"));
    process.exit(0);
  }
  if (!gitVersionIsNew) {
    sh.echo(warning("Gitmars\u9700\u8981\u4F7F\u75282.13.0\u4EE5\u4E0A\u7248\u672C\u7684Git\uFF0C\u5F53\u524D\u7248\u672C\uFF1A" + gitVersion));
    process.exit(0);
  }
  createHooks(gitHookDir);
  createHookShell(gitHookDir);
  createLocalShell(gitHookDir, "yarn", prefix);
  console.info("gitmars hooks init down");
}
function remove() {
  removeHooks();
  removeHookShell();
  removeLocalShell();
  console.info("gitmars hooks removed");
}
module.exports = {
  init,
  remove,
  createHooks,
  removeHooks,
  createHookShell,
  removeHookShell,
  createLocalShell,
  removeLocalShell
};

'use strict';

const { spawnSync } = require("../spawn");
const checkGitDirEnv = require("./checkGitDirEnv");
const getConfig = require("../getConfig");
const config = getConfig();
function getCommand(cwd, hookName) {
  return config && config.hooks && config.hooks[hookName];
}
function runCommand(cwd, hookName, cmd, env) {
  console.info(`gitmars > ${hookName} (node ${process.version})`);
  const { status } = spawnSync("sh", ["-c", cmd], {
    cwd,
    env: Object.assign(Object.assign({}, process.env), env),
    stdio: "inherit"
  });
  if (status !== 0) {
    const noVerifyMessage = [
      "commit-msg",
      "pre-commit",
      "pre-rebase",
      "pre-push"
    ].includes(hookName) ? "(add --no-verify to bypass)" : "(cannot be bypassed with --no-verify due to Git specs)";
    console.info(`gitmars > ${hookName} hook failed ${noVerifyMessage}`);
  }
  if (status === 127) {
    return 1;
  }
  return status || 0;
}
function start([, , hookName = "", ...GITMARS_GIT_PARAMS], { cwd = process.cwd() } = {}) {
  const command = getCommand(cwd, hookName);
  const env = {};
  if (GITMARS_GIT_PARAMS === null || GITMARS_GIT_PARAMS === void 0 ? void 0 : GITMARS_GIT_PARAMS.length) {
    env.GITMARS_GIT_PARAMS = GITMARS_GIT_PARAMS.join(" ");
  }
  if (command) {
    return runCommand(cwd, hookName, command, env);
  }
  return 0;
}
async function run() {
  checkGitDirEnv();
  try {
    const status = await start(process.argv);
    process.exit(status);
  } catch (err) {
    console.info("Gitmars > \u672A\u77E5\u9519\u8BEF\uFF01\u8BF7\u8054\u7CFB\u5434\u5CF0", err);
    process.exit(1);
  }
}
module.exports = run;

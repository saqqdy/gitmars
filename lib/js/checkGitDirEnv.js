'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function debug(...args) {
  if (['1', 'true'].includes(process.env.HUSKY_DEBUG || '')) {
    console.info('gitmars:debug', ...args);
  }
}

function checkGitDirEnv() {
  if (process.env.GIT_DIR) {
    debug(`GIT_DIR 环境变量值为：${process.env.GIT_DIR}`);
    debug(`如果提示"fatal: not a git repository"，请检查 GIT_DIR 的值`);
  }
}

exports.checkGitDirEnv = checkGitDirEnv;
exports['default'] = checkGitDirEnv;

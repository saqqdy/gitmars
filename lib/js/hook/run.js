'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');
var fs = require('fs');
var sh = require('shelljs');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

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

function gitRevParse(cwd = process.cwd()) {
  const result = sh__default['default'].exec('git rev-parse --show-toplevel --show-prefix --git-common-dir --absolute-git-dir --show-cdup', {
    silent: true
  }).stdout.replace(/[\s]*$/g, '');
  const [root, prefix, gitCommonDir, gitDir, cdup = ''] = result.split('\n').map(s => s.trim()).map(slash__default['default']);
  return {
    prefix: prefix || '.',
    gitCommonDir,
    root,
    gitDir,
    gitHookDir: gitDir + '/hooks',
    cdup
  };
}

const defaults = {
  master: 'master',
  develop: 'dev',
  release: 'release',
  bugfix: 'bug',
  support: 'support',
  user: '',
  email: '',
  msgTemplate: '${message}；项目：${project}；路径：${pwd}',
  msgUrl: '',
  apolloConfig: '',
  hooks: '',
  api: '',
  gitHost: '',
  gitID: ''
};

function getConfig(pathName, moduleName = 'gitmars') {
  let info;

  if (!pathName) {
    let {
      root
    } = gitRevParse();

    try {
      pathName = root + '/gitmarsconfig.json';
      info = fs__default['default'].statSync(pathName);
    } catch (err) {
      pathName = root;
    }
  }

  const defaultSet = {
    skipCI: true
  };
  const explorer = cosmiconfig.cosmiconfigSync(moduleName);
  if (!info) info = fs__default['default'].statSync(pathName);

  if (info.isDirectory()) {
    const {
      config = {},
      filepath = ''
    } = explorer.search(pathName) || {};
    return Object.assign({}, defaults, defaultSet, config, {
      filepath
    });
  } else {
    const {
      config = {},
      filepath = ''
    } = explorer.load(pathName) || {};
    return Object.assign({}, defaults, defaultSet, config, {
      filepath
    });
  }
}

const config = getConfig();
function getCommand(cwd, hookName) {
  return config && config.hooks && config.hooks[hookName];
}
function runCommand(cwd, hookName, cmd, env) {
  console.info(`gitmars > ${hookName} (node ${process.version})`);
  const {
    status
  } = child_process.spawnSync('sh', ['-c', cmd], {
    cwd,
    env: Object.assign(Object.assign({}, process.env), env),
    stdio: 'inherit'
  });

  if (status !== 0) {
    const noVerifyMessage = ['commit-msg', 'pre-commit', 'pre-rebase', 'pre-push'].includes(hookName) ? '(add --no-verify to bypass)' : '(cannot be bypassed with --no-verify due to Git specs)';
    console.info(`gitmars > ${hookName} hook failed ${noVerifyMessage}`);
  }

  if (status === 127) {
    return 1;
  }

  return status || 0;
}
function start([,, hookName = '', ...GITMARS_GIT_PARAMS], {
  cwd = process.cwd()
} = {}) {
  const command = getCommand(cwd, hookName);
  const env = {};

  if (GITMARS_GIT_PARAMS === null || GITMARS_GIT_PARAMS === void 0 ? void 0 : GITMARS_GIT_PARAMS.length) {
    env.GITMARS_GIT_PARAMS = GITMARS_GIT_PARAMS.join(' ');
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
    console.info('Gitmars > 未知错误！请联系吴峰', err);
    process.exit(1);
  }
}

exports['default'] = run;
exports.getCommand = getCommand;
exports.runCommand = runCommand;
exports.start = start;

#!/usr/bin/env node
'use strict';

var commander = require('commander');
var sh = require('shelljs');
var fs = require('fs');
var colors = require('colors');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');
var path = require('path');
var ciInfo = require('ci-info');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var ciInfo__default = /*#__PURE__*/_interopDefaultLegacy(ciInfo);

const cmdConfig = {
  command: 'hook',
  short: 'hk',
  args: [{
    required: false,
    name: 'command',
    variadic: false
  }, {
    required: false,
    name: 'args',
    variadic: true
  }],
  options: [{
    flags: '--no-verify',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    long: '--no-verify',
    negate: true,
    description: '是否需要跳过校验权限',
    defaultValue: false
  }, {
    flags: '--latest [latest]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '',
    long: '--latest',
    negate: false,
    description: '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y',
    defaultValue: '7d'
  }, {
    flags: '--limit [limit]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '',
    long: '--limit',
    negate: false,
    description: '最多查询的日志条数',
    defaultValue: 20
  }, {
    flags: '-t, --type <type>',
    required: true,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-t',
    long: '--type',
    negate: false,
    description: '检测类型',
    defaultValue: ''
  }, {
    flags: '--branch [branch]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '',
    long: '--branch',
    negate: false,
    description: '要查询的分支',
    defaultValue: ''
  }]
};
const args = cmdConfig.args;
const options = cmdConfig.options;

function getGitConfig(cwd = process.cwd()) {
  const result = sh__default['default'].exec('git config --local --get remote.origin.url', {
    silent: true
  }).stdout.replace(/[\s]*$/g, '');
  const [gitUrl] = result.split('\n').map(s => s.trim()).map(slash__default['default']);
  return {
    gitUrl,
    appName: gitUrl.replace(/^[\s\S]+\/([a-z0-9A-Z-_]+)\.git$/, '$1')
  };
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

const hookList = ['applypatch-msg', 'pre-applypatch', 'post-applypatch', 'pre-commit', 'pre-merge-commit', 'prepare-commit-msg', 'commit-msg', 'post-commit', 'pre-rebase', 'post-checkout', 'post-merge', 'pre-push', 'post-update', 'push-to-checkout', 'pre-auto-gc', 'post-rewrite', 'sendemail-validate'];
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

function warning(txt) {
  return colors__default['default'].yellow(txt);
}
function error(txt) {
  return colors__default['default'].red(txt);
}
function success(txt) {
  return colors__default['default'].green(txt);
}
function getSeconds(str) {
  let match = String(str).match(/^(\d+)([a-zA-Z]+)$/),
      time;
  if (!match) return null;
  time = +match[1];

  switch (match[2]) {
    case 'm':
      time *= 60;
      break;

    case 'h':
      time *= 3600;
      break;

    case 'd':
      time *= 86400;
      break;

    case 'w':
      time *= 604800;
      break;

    case 'M':
      time *= 2592000;
      break;

    case 'y':
      time *= 31536000;
      break;
  }

  return parseInt(String(Date.now() / 1000 - time));
}
function getLogs(config = {}) {
  const {
    lastet,
    limit,
    branches
  } = config;
  const keys = ['%H', '%T', '%P', '%an', '%ae', '%al', '%aL', '%ad', '%ar', '%at', '%aI', '%as', '%cn', '%ce', '%cl', '%cL', '%cd', '%cr', '%ct', '%cI', '%cs', '%d', '%D', '%S', '%e', '%s'];
  const results = sh__default['default'].exec(`git log${limit ? ' -"' + limit + '"' : ''}${lastet ? ' --since="' + getSeconds(lastet) + '"' : ''}${branches ? ' --branches="*' + branches + '"' : ''} --date-order --pretty=format:"${keys.join(',=')}-end-"`, {
    silent: true
  }).stdout.replace(/[\r\n]+/g, '').replace(/-end-$/, '');
  let logList = [];
  results && results.split('-end-').forEach(log => {
    let args = log.split(',='),
        map = {};
    keys.forEach((key, i) => {
      map[key] = args[i];
    });
    logList.push(map);
  });
  return logList;
}
function getCurrent() {
  return sh__default['default'].exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout.replace(/[\n\s]*$/g, '');
}
function compareVersion(basicVer, compareVer) {
  if (basicVer === null) return null;
  basicVer = basicVer + '.';
  compareVer = compareVer + '.';
  let bStr = parseFloat(basicVer),
      cStr = parseFloat(compareVer),
      bStrNext = parseFloat(basicVer.replace(bStr + '.', '')) || 0,
      cStrNext = parseFloat(compareVer.replace(cStr + '.', '')) || 0;

  if (cStr > bStr) {
    return false;
  } else if (cStr < bStr) {
    return true;
  } else {
    if (bStrNext >= cStrNext) {
      return true;
    } else {
      return false;
    }
  }
}
function getBranchsFromID(commitID, remote = false) {
  const out = sh__default['default'].exec(`git branch ${remote ? '-r' : ''} --contains ${commitID} --format="%(refname:short)`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
  return out ? out.split('\n') : [];
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}

function createArgs(args) {
  let argArr = [];
  args.forEach(arg => {
    let str = arg.name;
    if (arg.variadic) str += '...';
    if (arg.required) str = '<' + str + '>';else str = '[' + str + ']';
    argArr.push(str);
  });
  return argArr.join(' ');
}

function getGitVersion() {
  let version = sh__default['default'].exec('git --version', {
    silent: true
  }).stdout.replace(/\s*$/g, '').match(/[\d.?]+/g);

  if (!version) {
    sh__default['default'].echo(warning('没有找到git'));
    sh__default['default'].exit(1);
    return;
  }

  version = version[0];
  return version;
}

function readPkg(dir) {
  if (!dir) {
    let {
      root
    } = gitRevParse();
    dir = root;
  }

  const pkgFile = path__default['default'].resolve(dir, 'package.json');
  const pkgStr = fs__default['default'].readFileSync(pkgFile, 'utf-8');
  return JSON.parse(pkgStr);
}

const {
  gitUrl
} = getGitConfig();
const {
  root
} = gitRevParse();

function getHookComment() {
  const {
    author,
    homepage: gitmarsHomepage,
    version: gitmarsVersion
  } = readPkg();
  const createdAt = new Date().toLocaleString();
  return `# Created by gitmars v${gitmarsVersion} (${gitmarsHomepage})
# author: ${author}
# At: ${createdAt}
# From: ${root} (${gitUrl})`;
}

Object.defineProperty(exports, '__esModule', {
  value: true
});
function isHusky(data) {
  return data.indexOf('# husky') > -1 || data.indexOf('#husky') > -1;
}
function isGitmars(data) {
  return data.indexOf('# gitmars') > -1;
}
function isYorkie(data) {
  return data.indexOf('#yorkie') > -1;
}
function isGhooks(data) {
  return data.indexOf('// Generated by ghooks. Do not edit this file.') > -1;
}
function isPreCommit(data) {
  return data.indexOf('./node_modules/pre-commit/hook') > -1;
}
var getHookType = {
  isHusky,
  isGitmars,
  isYorkie,
  isGhooks,
  isPreCommit
};

function getHookShell() {
  const pkg = readPkg();
  const hookShell = fs__default['default'].readFileSync(path__default['default'].join(__dirname, '../../sh/gitmars.sh'), 'utf-8').replace('gitmarsVersion="0.0.0"', `gitmarsVersion="${pkg.version}"`);
  return [getHookComment(), '', hookShell].join('\n');
}

const hookComment = getHookComment();

function getLocalShell(pmName, relativeUserPkgDir) {
  return `${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`;
}

const current = getCurrent();
const {
  gitHookDir,
  prefix
} = gitRevParse();
const gitVersion = getGitVersion();
const config$1 = getConfig();
function createHooks(dir = gitHookDir) {
  const writeHook = (filename, shell) => {
    fs__default['default'].writeFileSync(filename, shell, 'utf-8');
    fs__default['default'].chmodSync(filename, 0o0755);
  };

  const hooks = hookList.map(hookName => path__default['default'].join(dir, hookName));
  hooks.forEach(filename => {
    const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`;
    const name = path__default['default'].basename(filename);

    if (fs__default['default'].existsSync(filename)) {
      const hook = fs__default['default'].readFileSync(filename, 'utf-8');

      if (getHookType.isGhooks(hook)) {
        console.info(`合并已存在的ghooks钩子: ${name}`);
        return writeHook(filename, hookShell);
      }

      if (getHookType.isPreCommit(hook)) {
        console.info(`合并已存在的pre-commit钩子: ${name}`);
        return writeHook(filename, hookShell);
      }

      if (getHookType.isGitmars(hook) || getHookType.isHusky(hook) || getHookType.isYorkie(hook)) {
        return writeHook(filename, hookShell);
      }

      console.info(`跳过已存在的用户git钩子: ${name}`);
      return;
    }

    writeHook(filename, hookShell);
  });
}
function removeHooks(dir = gitHookDir) {
  const hooks = hookList.map(hookName => path__default['default'].join(dir, hookName));
  hooks.filter(filename => {
    if (fs__default['default'].existsSync(filename)) {
      const hook = fs__default['default'].readFileSync(filename, 'utf-8');
      return getHookType.isGitmars(hook);
    }

    return false;
  }).forEach(filename => {
    fs__default['default'].unlinkSync(filename);
  });
}
function createHookShell(dir = gitHookDir) {
  let filename = path__default['default'].join(dir, 'gitmars.sh');
  fs__default['default'].writeFileSync(filename, getHookShell(), 'utf-8');
  fs__default['default'].chmodSync(filename, 0o0755);
}
function removeHookShell(dir = gitHookDir) {
  const filename = path__default['default'].join(dir, 'gitmars.sh');
  if (fs__default['default'].existsSync(filename)) fs__default['default'].unlinkSync(filename);
}
function createLocalShell(dir = gitHookDir, pmName, relativeUserPkgDir) {
  let filename = path__default['default'].join(dir, 'gitmars.local.sh');
  fs__default['default'].writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), 'utf-8');
  fs__default['default'].chmodSync(filename, 0o0755);
}
function removeLocalShell(dir = gitHookDir) {
  const filename = path__default['default'].join(dir, 'gitmars.local.sh');
  if (fs__default['default'].existsSync(filename)) fs__default['default'].unlinkSync(filename);
}
function getIsMergedBranch(branch = current, targetBranch = 'dev') {
  const result = sh__default['default'].exec(`git branch --contains ${branch}`, {
    silent: true
  }).stdout.replace(/[\s]*$/g, '');
  return result.split('\n').includes(targetBranch);
}
function getIsUpdatedInTime({
  latest,
  limit,
  branch: branches
}) {
  let isUpdated = false,
      mainVers = [],
      currentVers = [];
  const mainLogs = getLogs({
    latest,
    limit,
    branches
  });
  const currentLogs = getLogs({
    latest,
    limit,
    branches: current
  });
  mainLogs.forEach(log => {
    mainVers.push(log['%H']);
  });
  currentLogs.forEach(log => {
    let arr = log['%P'] ? log['%P'].split(' ') : [];
    arr.forEach(item => {
      currentVers.push(item);
    });
  });

  mainVer: for (let ver of mainVers) {
    if (currentVers.includes(ver)) {
      isUpdated = true;
      break mainVer;
    }
  }

  return isUpdated;
}
function getIsMergeAction() {
  const currentLogs = getLogs({
    limit: 1,
    branches: current
  });
  let p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : [];
  return p.length > 1;
}
function getBehandLogs() {
  sh__default['default'].exec(`git fetch`, {
    silent: true
  });
  const result = sh__default['default'].exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, {
    silent: true
  }).stdout.replace(/[\s]*$/g, '');
  return result ? result.split('\n') : [];
}
function init() {
  const gitVersionIsNew = gitVersion && compareVersion(gitVersion, '2.13.0');

  if (ciInfo__default['default'].isCI && config$1.skipCI) {
    console.info('持续集成环境，跳过钩子安装');
    return;
  }

  if (!fs__default['default'].existsSync(gitHookDir)) {
    fs__default['default'].mkdirSync(gitHookDir);
  }

  if (['1', 'true'].includes(process.env.GITMARS_SKIP_HOOKS || '')) {
    sh__default['default'].echo(warning('已存在环境变量GITMARS_SKIP_HOOKS，跳过安装'));
    process.exit(0);
  }

  if (!gitVersionIsNew) {
    sh__default['default'].echo(warning('Gitmars需要使用2.13.0以上版本的Git，当前版本：' + gitVersion));
    process.exit(0);
  }

  createHooks(gitHookDir);
  createHookShell(gitHookDir);
  createLocalShell(gitHookDir, 'yarn', prefix);
  console.info('gitmars hooks init down');
}
function remove() {
  removeHooks();
  removeHookShell();
  removeLocalShell();
  console.info('gitmars hooks removed');
}

if (!isGitProject()) {
  sh__default['default'].echo(error('当前目录不是git项目目录'));
  sh__default['default'].exit(1);
}
const config = getConfig();
commander.program.name('gitm hook').usage('[command]').description('git hook钩子');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(async (command, args, opt) => {
  console.log('gitmars hooks is running');

  if (opt.noVerify) {
    sh__default['default'].exit(0);
    return;
  }

  if (command === 'init') {
    init();
  } else if (command === 'remove') {
    remove();
  } else {
    opt.type = opt.type ? opt.type.split(',') : [];
    const mainBranchs = [config.master, config.develop, config.release, config.support, config.bugfix];
    const current = getCurrent();
    current.split('/')[0];
    console.log(opt.type, process.env, process.argv, getBranchsFromID('2080d17e'));

    if (current !== config.develop && mainBranchs.includes(current) && opt.type.includes('1')) {
      const [command, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(' ') : [];

      if (command === 'merge') {
        const isMergedBranch = getIsMergedBranch(branch, config.develop);

        if (!isMergedBranch) {
          console.info(error('检测到你的分支没有合并过' + config.develop));
          sh__default['default'].exit(0);
        } else {
          console.info(success(branch + '合并过' + config.develop));
        }
      }
    }

    if (mainBranchs.includes(current) && opt.type.includes('2')) {
      const [command, branch] = process.env.GIT_REFLOG_ACTION ? process.env.GIT_REFLOG_ACTION.split(' ') : [];
      const branchPrefix = branch.split('/')[0];

      if (command === 'merge') {
        const isUpdatedInTime = getIsUpdatedInTime({
          latest: opt.latest,
          branch
        });

        if (!isUpdatedInTime) {
          console.info(error('检测到你1周内没有同步过主干' + branchPrefix + '分支代码'));
          sh__default['default'].exit(0);
        } else {
          console.info(success(branch + '一周内同步过主干分支代码'));
        }
      }
    }

    if (mainBranchs.includes(current) && opt.type.includes('3')) {
      const isMergeAction = getIsMergeAction();

      if (!isMergeAction) {
        console.info(error('检测到你直接在主干分支修改代码'));
        sh__default['default'].exit(0);
      } else {
        console.info(success('最后一条记录是merge记录'));
      }
    }

    if (mainBranchs.includes(current) && opt.type.includes('4')) {
      const behandLogs = getBehandLogs();

      if (!behandLogs.length) {
        console.info('你本地分支版本落后于远程分支，请先执行pull');
        sh__default['default'].exit(0);
      } else {
        console.info(success('本地版本没有落后远程，可直接push'));
      }
    }
  }

  sh__default['default'].exit(0);
});
commander.program.parse(process.argv);

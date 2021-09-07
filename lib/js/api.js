'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
var fs = require('fs');
var colors = require('colors');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

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

function error(txt) {
  return colors__default['default'].red(txt);
}
function getGitUser() {
  return sh__default['default'].exec(`git config user.name`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
}

function getUserToken() {
  const config = getConfig();

  if (!config.api) {
    sh__default['default'].echo(error('请配置用于请求权限的api接口地址，接收参数形式：url?name=git_user_name，返回data=token'));
    process.exit(1);
  }

  const user = getGitUser();

  if (!user) {
    sh__default['default'].echo(error('请设置本地git用户名'));
    process.exit(1);
  }

  let fetchData = sh__default['default'].exec(`curl -s ${config.api}?name=${user}`, {
    silent: true
  }).stdout,
      userInfo;

  try {
    fetchData = JSON.parse(fetchData);
    userInfo = fetchData.data || null;
  } catch (err) {
    userInfo = null;
  }

  if (!userInfo) {
    sh__default['default'].echo(error('没有找到用户，请联系管理员'));
    process.exit(1);
  } else if (!userInfo.token) {
    sh__default['default'].echo(error('请设置access_token'));
    process.exit(1);
  }

  return userInfo;
}

exports.getUserToken = getUserToken;

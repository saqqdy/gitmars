'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
var slash = require('slash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

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

const {
  root: root$1
} = gitRevParse();

const getConfigFrom = () => {
  if (sh__default['default'].test('-f', root$1 + '/.gitmarsrc')) {
    return 1;
  } else if (sh__default['default'].test('-f', root$1 + '/gitmarsconfig.json')) {
    return 2;
  }

  return 0;
};

var configFrom = getConfigFrom();

const {
  root
} = gitRevParse();

const getConfig = () => {
  let config = {};

  if (configFrom === 1) {
    let str = sh__default['default'].cat(root + '/.gitmarsrc').stdout.replace(/(^\n*)|(\n*$)/g, '').replace(/\n{2,}/g, '\n').replace(/\r/g, '').replace(/[^\S\x0a\x0d]/g, ''),
        arr = [];
    if (str) arr = str.split('\n');
    arr.forEach(el => {
      el.replace(/^([a-zA-Z0-9]+)\=([\s\S]+)$/, (a, b, c) => {
        config[b] = c || null;
      });
    });
  } else if (configFrom === 2) {
    config = require(root + '/gitmarsconfig.json');
  }

  return { ...defaults,
    ...config
  };
};

var config = getConfig();

exports['default'] = config;

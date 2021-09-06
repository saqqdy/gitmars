'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
var slash = require('slash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
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

const {
  root
} = gitRevParse();

const getConfigFrom = () => {
  if (sh__default['default'].test('-f', root + '/.gitmarsrc')) {
    return 1;
  } else if (sh__default['default'].test('-f', root + '/gitmarsconfig.json')) {
    return 2;
  }

  return 0;
};

var configFrom = getConfigFrom();

exports['default'] = configFrom;

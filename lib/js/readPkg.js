'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
var slash = require('slash');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

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

exports['default'] = readPkg;

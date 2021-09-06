'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
require('fs');
var colors = require('colors');
require('slash');
require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);

function warning(txt) {
  return colors__default['default'].yellow(txt);
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

exports['default'] = getGitVersion;

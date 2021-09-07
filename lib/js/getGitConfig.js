'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
var slash = require('slash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

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

exports['default'] = getGitConfig;

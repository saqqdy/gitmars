"use strict";

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

var sh = require('shelljs');

var pwd = sh.exec('git rev-parse --show-toplevel', {
  silent: true
}).stdout.replace(/[\n\s]*$/g, ''),
    gitDir = pwd + '/.git',
    gitUrl = sh.exec('git config --local --get remote.origin.url', {
  silent: true
}).stdout.replace(/[\n\s]*$/g, ''),
    appName = gitUrl.replace(/^[\s\S]+\/([a-z0-9A-Z-_]+)\.git$/, '$1'),
    system = sh.exec('uname -s', {
  silent: true
}).stdout || 'MINGW64_NT';
var defaults = {
  master: 'master',
  develop: 'dev',
  release: 'release',
  bugfix: 'bug',
  support: 'support',
  user: '',
  email: '',
  msgTemplate: '${message}；项目：${project}；路径：${pwd}',
  msgUrl: '',
  apolloConfig: ''
};
module.exports = {
  pwd: pwd,
  gitDir: gitDir,
  gitUrl: gitUrl,
  appName: appName,
  system: system,
  defaults: defaults
};
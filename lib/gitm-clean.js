'use strict';

var path = require('path');
var commander = require('commander');
var sh = require('shelljs');
require('fs');
var colors = require('colors');
var slash = require('slash');
require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
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

function warning(txt) {
  return colors__default['default'].yellow(txt);
}
function success(txt) {
  return colors__default['default'].green(txt);
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}

const cacheDir = path__default['default'].join(__dirname, '../cache');
const {
  root,
  gitDir
} = gitRevParse();
commander.program.name('gitm clean').description('清理gitmars缓存').option('-f, --force', '强制清理', false).action(opt => {
  if (isGitProject()) {
    sh__default['default'].rm(gitDir + '/.gitmarscommands', gitDir + '/.gitmarslog');

    if (opt.force) {
      sh__default['default'].echo(warning('您输入了--force，将同时清理本地gitmars配置文件'));
      sh__default['default'].rm(root + '/gitmarsconfig.json', root + '/.gitmarsrc');
    }
  } else {
    sh__default['default'].echo(warning('当前目录不是git项目目录'));
  }

  sh__default['default'].rm(cacheDir + '/buildConfig.json', cacheDir + '/buildConfig.txt');
  sh__default['default'].echo(success('清理完毕'));
});
commander.program.parse(process.argv);

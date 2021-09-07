#!/usr/bin/env node
'use strict';

var commander = require('commander');
var child_process = require('child_process');
var sh = require('shelljs');
require('fs');
var colors = require('colors');
require('slash');
require('cosmiconfig');
var ora = require('ora');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var ora__default = /*#__PURE__*/_interopDefaultLegacy(ora);

function success(txt) {
  return colors__default['default'].green(txt);
}

commander.program.name('gitm upgrade').usage('[version]').description('升级gitmars').arguments('[version]').option('-m, --mirror', '是否使用淘宝镜像', false).action(async (version, opt) => {
  const spinner = ora__default['default'](success('正在安装请稍后')).start();
  let match = version && version.match(/[0-9.]+$/) || null,
      cmdAdd = ['npm', ['install', '-g', `gitmars@${match ? match[0] : 'latest'}`]],
      cmdDel = ['npm', ['uninstall', '-g', 'gitmars']];
  if (opt.mirror) cmdAdd[1] = cmdAdd[1].concat(['-registry', 'https://registry.npm.taobao.org']);
  const uninstall = child_process.spawnSync(cmdDel[0], cmdDel[1], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });

  if (uninstall.status === 0) {
    console.warn('安装出错了');
    process.exit(0);
  }

  const install = child_process.spawnSync(cmdAdd[0], cmdAdd[1], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  child_process.spawnSync('gitm', ['-v'], {
    stdio: 'inherit',
    shell: process.platform === 'win32'
  });
  sh__default['default'].echo(`\n${success('安装完成')}`);
  spinner.stop();

  if (install.status === 0) {
    process.exit(0);
  } else {
    console.warn('安装出错了');
    process.exit(0);
  }
});
commander.program.parse(process.argv);

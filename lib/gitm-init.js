#!/usr/bin/env node
'use strict';

var commander = require('commander');
var fs = require('fs');
var sh = require('shelljs');
var inquirer = require('inquirer');
var colors = require('colors');
var slash = require('slash');
require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);
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

function error(txt) {
  return colors__default['default'].red(txt);
}
function success(txt) {
  return colors__default['default'].green(txt);
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}

if (!isGitProject()) {
  sh__default['default'].echo(error('当前目录不是git项目目录'));
  sh__default['default'].exit(1);
}
const {
  root
} = gitRevParse();
commander.program.name('gitm init').usage('').description('设置gitmars的配置项').action(() => {
  let prompts = [];
  Object.keys(defaults).forEach(key => {
    if (['master', 'develop', 'release', 'bugfix', 'support'].includes(key)) {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入${key}分支名称`,
        default: () => key,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => /^\w+$/.test(val) ? true : '请输入可用名称'
      });
    } else if (key === 'user') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入Git用户名`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^\w+$/.test(val) ? true : '请输入可用名称'
      });
    } else if (key === 'email') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入Git邮箱`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val) ? true : '请输入正确的邮箱'
      });
    } else if (key === 'msgTemplate') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入消息模板`,
        default: () => '${message}；项目：${project}；路径：${pwd}',
        transformer: (val, answers, flags) => val.trim()
      });
    } else if (key === 'msgUrl') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入云之家消息推送地址`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : '请输入网址'
      });
    } else if (key === 'apolloConfig') {
      prompts.push({
        type: 'editor',
        name: key,
        message: '请输入apollo配置',
        default: () => `{
    "configServerUrl": "",
    "appId": "",
    "clusterName": "",
    "namespaceName": [],
    "apolloEnv": "",
    "token": ""
}`,
        validate: val => {
          try {
            val = JSON.parse(val);
            return true;
          } catch (e) {
            return '请输入json';
          }
        }
      });
    } else if (key === 'hooks') {
      prompts.push({
        type: 'editor',
        name: key,
        message: '请输入hooks配置',
        default: () => `{
    "pre-commit": "",
    "pre-push": ""
}`,
        validate: val => {
          try {
            val = JSON.parse(val);
            return true;
          } catch (e) {
            return '请输入json';
          }
        }
      });
    } else if (key === 'api') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入查询用户权限接口`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : '请输入网址'
      });
    } else if (key === 'gitHost') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入git网址`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : '请输入网址'
      });
    } else if (key === 'gitID') {
      prompts.push({
        type: 'input',
        name: key,
        message: `请输入git项目ID，目前仅支持gitlab`,
        transformer: (val, answers, flags) => val.trim(),
        validate: val => val === '' || /^\d+$/.test(val) ? true : '请输入网址'
      });
    }
  });
  inquirer__default['default'].prompt(prompts).then(answers => {
    try {
      answers.apolloConfig = JSON.parse(answers.apolloConfig);
      if (!answers.apolloConfig.configServerUrl || !answers.apolloConfig.token) answers.apolloConfig = '';
    } catch (e) {
      answers.apolloConfig = '';
    }

    try {
      let valid = false;
      answers.hooks = JSON.parse(answers.hooks);

      hooks: for (let k in answers.hooks) {
        if (!!answers.hooks[k]) {
          valid = true;
          break hooks;
        }
      }

      if (!valid) answers.hooks = '';
    } catch (e) {
      answers.hooks = '';
    }

    sh__default['default'].echo(success('gitmars配置成功'));
    fs__default['default'].writeFileSync(root + '/.gitmarsrc', JSON.stringify(answers, null, 4), 'utf-8');
    fs__default['default'].chmodSync(root + '/.gitmarsrc', 0o0755);
  });
});
commander.program.parse(process.argv);

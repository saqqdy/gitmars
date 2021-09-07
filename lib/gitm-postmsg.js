#!/usr/bin/env node
'use strict';

var commander = require('commander');
var sh$1 = require('shelljs');
var path = require('path');
var fs = require('fs');
var colors = require('colors');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh$1);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

const cmdConfig = {
  command: 'postmsg',
  short: null,
  args: [{
    required: true,
    name: 'message',
    variadic: false
  }],
  options: [{
    flags: '-u, --url [url]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-u',
    long: '--url',
    negate: false,
    description: '推送消息的api地址',
    defaultValue: ''
  }],
  validatorOpts: (val, opts, cb) => {
    cb();
  },
  validatorArgs: (val, opts, cb) => {
    cb();
  },
  transformOpts: (val, opts, cb) => {
    cb();
  },
  transformArgs: (val, opts, cb) => {
    cb();
  }
};
const args = cmdConfig.args;
const options = cmdConfig.options;

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
function writeFile(url, data) {
  return new Promise((resolve, reject) => {
    fs__default['default'].writeFile(url, data, err => {
      if (err) {
        reject(new Error('文件写入错误'));
      } else {
        resolve(true);
      }
    });
  });
}

let apollo = require('node-apollo'),
    sh = require('shelljs');
const cacheDir = path__default['default'].join(__dirname, '../../cache');
async function apolloConfig() {
  let now = new Date().getTime(),
      config,
      apolloConfig,
      result;

  if (sh.test('-f', cacheDir + '/buildConfig.json')) {
    let fileDate = parseInt(sh.cat(cacheDir + '/buildConfig.txt').stdout);
    if (now - fileDate < 24 * 60 * 60 * 1000) return require(cacheDir + '/buildConfig.json');
  }

  config = getConfig();

  if (!config.apolloConfig) {
    sh.echo(error('请配置apollo'));
    sh.exit(0);
    return;
  }

  if (typeof config.apolloConfig === 'string') {
    try {
      apolloConfig = JSON.parse(config.apolloConfig);
    } catch {
      return;
    }
  } else {
    apolloConfig = config.apolloConfig;
  }

  result = await apollo.remoteConfigService(apolloConfig);
  await writeFile(cacheDir + '/buildConfig.txt', String(now));
  await writeFile(cacheDir + '/buildConfig.json', JSON.stringify(result.content));
  return result.content;
}

async function sendGroupMessage(message, cfg = {}) {
  const config = await apolloConfig();
  const {
    silent = true,
    url
  } = cfg;
  let urls = [];

  if (!config.gitNotificationGroupUrl && !url) {
    sh__default['default'].echo(error('没有配置群消息推送地址'));
    return;
  }

  if (url) urls = [url];else if (config.gitNotificationGroupUrl) {
    if (typeof config.gitNotificationGroupUrl === 'string') urls = [config.gitNotificationGroupUrl];else urls = config.gitNotificationGroupUrl;
  }
  message = message.replace(/\s/g, '');
  urls.forEach(() => {
    sh__default['default'].exec(`curl -i -H "Content-Type: application/json" -X POST -d "{\\"content\\":\\"${message}\\"}" "${url || config.gitNotificationGroupUrl}"`, {
      silent
    });
  });
}

function createArgs(args) {
  let argArr = [];
  args.forEach(arg => {
    let str = arg.name;
    if (arg.variadic) str += '...';
    if (arg.required) str = '<' + str + '>';else str = '[' + str + ']';
    argArr.push(str);
  });
  return argArr.join(' ');
}

function encodeUnicode(str) {
  let res = [];

  for (var i = 0; i < str.length; i++) {
    res[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
  }

  return '\\u' + res.join('\\u');
}

commander.program.name('gitm postmsg').usage('<message> [-u --url [url]]').description('发送群消息消息');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action((message, opt) => {
  sendGroupMessage(encodeUnicode(message), {
    url: opt.url || ''
  });
});
commander.program.parse(process.argv);

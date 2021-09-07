#!/usr/bin/env node
'use strict';

var commander = require('commander');
var fs = require('fs');
var colors = require('colors');
var sh$1 = require('shelljs');
var path = require('path');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh$1);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

const cmdConfig = {
  command: 'build',
  short: 'bd',
  args: [{
    required: true,
    name: 'project',
    variadic: false,
    description: '项目名称'
  }],
  options: [{
    flags: '-e, --env [env]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-e',
    long: '--env',
    negate: false,
    description: '构建环境，可选dev、prod、bug、all',
    defaultValue: 'dev',
    recommend: true
  }, {
    flags: '-a, --app [app]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-a',
    long: '--app',
    negate: false,
    description: '构建应用',
    defaultValue: 'all',
    recommend: true
  }]
};
const args = cmdConfig.args;
const options = cmdConfig.options;

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
function success(txt) {
  return colors__default['default'].green(txt);
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
function mapTemplate(tmp, data) {
  if (!tmp || !data) return null;
  let str = '' + tmp.replace(/\$\{([a-zA-Z0-9-_]+)\}/g, (a, b) => {
    if (typeof data === 'function') {
      return data(b);
    }

    for (let k in data) {
      if (b === k) {
        return data[k];
      }
    }
  });
  return str;
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

async function runJenkins({
  env,
  project,
  app = 'all'
}) {
  let buildConfig = await apolloConfig(),
      cfg = buildConfig[env],
      p,
      url;

  if (!cfg) {
    sh__default['default'].echo(error('请输入正确的环境名称'));
    sh__default['default'].exit(1);
    return;
  }

  p = cfg.list.find(el => el.name === project);

  if (!p) {
    sh__default['default'].echo(error('请输入正确的项目名称'));
    sh__default['default'].exit(1);
    return;
  }

  if (app && p.apps && !p.apps.includes(app)) {
    sh__default['default'].echo(error('请输入正确的应用名称'));
    sh__default['default'].exit(1);
    return;
  }

  if (!buildConfig.template) {
    sh__default['default'].echo(error('请配置Jenkins构建地址模板'));
    sh__default['default'].exit(1);
    return;
  }

  url = mapTemplate(p.apps && p.apps.length > 0 ? buildConfig.templateWithParam : buildConfig.template, {
    line: cfg.line,
    project: p.project,
    token: cfg.token,
    app
  });
  sh__default['default'].exec(`curl -u ${buildConfig.username}:${buildConfig.password} "${url}"`, {
    silent: true
  });
  sh__default['default'].echo(success('成功调起Jenkins构建'));
}

commander.program.name('gitm build').usage('<project>').description('构建Jenkins');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action((project, opt) => {
  runJenkins({
    env: opt.env,
    project,
    app: opt.app
  });
});
commander.program.parse(process.argv);

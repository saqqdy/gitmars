'use strict';

var commander = require('commander');
var sh = require('shelljs');
var slash = require('slash');
var fs = require('fs');
var colors = require('colors');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);

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
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}

if (!isGitProject()) {
  sh__default['default'].echo(error('当前目录不是git项目目录'));
  sh__default['default'].exit(1);
}
const config = getConfig();
commander.program.name('gitm config').usage('<option> [value]').command('set <option> [value]').description('设置gitmars的配置项').action(async (option, value) => {
  let {
    filepath
  } = config;

  if (!filepath) {
    const {
      root
    } = gitRevParse();
    filepath = root + '/.gitmarsrc';
  }

  if (value) {
    if (Object.keys(defaults).includes(option)) {
      config[option] = value;
      delete config.filepath;
      delete config.skipCI;
      await writeFile(filepath, JSON.stringify(config, null, 4));
      sh__default['default'].echo(success('保存成功'));
      sh__default['default'].exit(0);
    } else {
      sh__default['default'].echo(error('不支持' + option + '这个配置项'));
      sh__default['default'].exit(1);
    }
  } else {
    sh__default['default'].echo('请输入要配置的项');
    sh__default['default'].exit(1);
  }
});
commander.program.name('gitm config').usage('list [option]').command('list [option]').description('查询单个或全部gitmars的配置项').action(option => {
  if (option) {
    sh__default['default'].echo(success(config[option]));
  } else {
    sh__default['default'].echo(success(config));
  }

  sh__default['default'].exit(0);
});
commander.program.parse(process.argv);

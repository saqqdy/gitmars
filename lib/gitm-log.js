'use strict';

var commander = require('commander');
var sh = require('shelljs');
require('fs');
var colors = require('colors');
require('slash');
require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);

const cmdConfig = {
  command: 'log',
  short: 'lg',
  args: [{
    required: false,
    name: 'branche',
    variadic: false
  }],
  options: [{
    flags: '--latest [latest]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '',
    long: '--latest',
    negate: false,
    description: '查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y',
    defaultValue: '7d'
  }, {
    flags: '--limit [limit]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '',
    long: '--limit',
    negate: false,
    description: '最多查询的日志条数',
    defaultValue: 20
  }]
};
const args = cmdConfig.args;
const options = cmdConfig.options;

function error(txt) {
  return colors__default['default'].red(txt);
}
function getSeconds(str) {
  let match = String(str).match(/^(\d+)([a-zA-Z]+)$/),
      time;
  if (!match) return null;
  time = +match[1];

  switch (match[2]) {
    case 'm':
      time *= 60;
      break;

    case 'h':
      time *= 3600;
      break;

    case 'd':
      time *= 86400;
      break;

    case 'w':
      time *= 604800;
      break;

    case 'M':
      time *= 2592000;
      break;

    case 'y':
      time *= 31536000;
      break;
  }

  return parseInt(String(Date.now() / 1000 - time));
}
function getLogs(config = {}) {
  const {
    lastet,
    limit,
    branches
  } = config;
  const keys = ['%H', '%T', '%P', '%an', '%ae', '%al', '%aL', '%ad', '%ar', '%at', '%aI', '%as', '%cn', '%ce', '%cl', '%cL', '%cd', '%cr', '%ct', '%cI', '%cs', '%d', '%D', '%S', '%e', '%s'];
  const results = sh__default['default'].exec(`git log${limit ? ' -"' + limit + '"' : ''}${lastet ? ' --since="' + getSeconds(lastet) + '"' : ''}${branches ? ' --branches="*' + branches + '"' : ''} --date-order --pretty=format:"${keys.join(',=')}-end-"`, {
    silent: true
  }).stdout.replace(/[\r\n]+/g, '').replace(/-end-$/, '');
  let logList = [];
  results && results.split('-end-').forEach(log => {
    let args = log.split(',='),
        map = {};
    keys.forEach((key, i) => {
      map[key] = args[i];
    });
    logList.push(map);
  });
  return logList;
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
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

if (!isGitProject()) {
  sh__default['default'].echo(error('当前目录不是git项目目录'));
  sh__default['default'].exit(1);
}

commander.program.name('gitm log').usage('[branche]').description('日志查询');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(async (branche, opt) => {
  const logs = getLogs({
    lastet: opt.lastet,
    limit: opt.limit,
    branches: branche
  });
  console.log(logs);
  sh__default['default'].exit(1);
});
commander.program.parse(process.argv);

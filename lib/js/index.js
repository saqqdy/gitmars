'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var fs = require('fs');
var sh = require('shelljs');
var colors = require('colors');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
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

function warning(txt) {
  return colors__default['default'].yellow(txt);
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
function wait(list, fun) {
  if (list.length === 0) {
    fun();
    return;
  } else {
    fun(list[0], (kill = false) => {
      if (kill) return;
      list.shift();
      wait(list, fun);
    });
  }
}
function queue(list) {
  return new Promise((resolve, reject) => {
    let returns = [];
    if (list.length === 0) reject('指令名称不能为空');
    list = JSON.parse(JSON.stringify(list));
    wait(list, (command, cb) => {
      let cfg = {
        silent: true,
        postmsg: false,
        kill: true,
        again: false
      },
          cmd = command;

      if (command instanceof Object) {
        cfg = Object.assign(cfg, command.config || {});
        cmd = command.cmd;
      }

      if (!cmd) {
        resolve(returns);
      } else {
        sh__default['default'].exec(cmd, cfg, (code, out, err) => {
          let msg = getCommandMessage(cmd);

          try {
            out = JSON.parse(out);
          } catch (err) {
            out = out.replace(/\n*$/g, '');
          }

          returns.push({
            code,
            out,
            err,
            cfg,
            cmd
          });
          if (code !== 0) setLog({
            command,
            code,
            out,
            err
          });

          if (code !== 0 && cfg.kill) {
            let rest = JSON.parse(JSON.stringify(list));

            if (!cfg.again) {
              rest.shift();
            } else if (cfg.again !== true) {
              rest.splice(0, 1, cfg.again);
            }

            cb(true);
            setCache(rest);
            cfg.silent && sh__default['default'].echo(error(err));
            sh__default['default'].echo(error(cfg.fail || msg.fail || '出错了！指令 ' + cmd + ' 执行失败，中断了进程'));
            cfg.postmsg && postMessage('出错了！指令 ' + cmd + ' 执行失败，中断了进程');
            rest.length > 0 && sh__default['default'].echo(error('请处理相关问题之后输入gitm continue继续'));
            sh__default['default'].exit(1);
          } else {
            if (code === 0) {
              let m = cfg.success || msg.success;

              if (m) {
                sh__default['default'].echo(success(m));
                cfg.postmsg && postMessage(m);
              }
            } else {
              let m = cfg.fail || msg.fail || '指令 ' + cmd + ' 执行失败';
              m && sh__default['default'].echo(warning(m));
            }

            cb();
          }
        });
      }
    });
  });
}
function getCache() {
  const {
    gitDir
  } = gitRevParse();
  let arr = [];

  if (sh__default['default'].test('-f', gitDir + '/.gitmarscommands')) {
    arr = sh__default['default'].cat(gitDir + '/.gitmarscommands').stdout.split('\n')[0].replace(/(^\n*)|(\n*$)/g, '').replace(/\n{2,}/g, '\n').replace(/\r/g, '');
    arr = JSON.parse(decodeURIComponent(arr));
  }

  return arr;
}
function setCache(rest) {
  const {
    gitDir
  } = gitRevParse();
  sh__default['default'].touch(gitDir + '/.gitmarscommands');
  sh__default['default'].sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(rest)), gitDir + '/.gitmarscommands');
}
function setLog(log) {
  const {
    gitDir
  } = gitRevParse();
  sh__default['default'].touch(gitDir + '/.gitmarslog');
  sh__default['default'].sed('-i', /[\s\S\n\r\x0a\x0d]*/, encodeURIComponent(JSON.stringify(log)), gitDir + '/.gitmarslog');
}
function getStatusInfo(config = {}) {
  const {
    silent = true
  } = config;
  const out = sh__default['default'].exec('git status -s --no-column', {
    silent
  }).stdout.replace(/(^\s+|\n*$)/g, '');
  let list = out ? out.replace(/\n(\s+)/g, '\n').split('\n') : [],
      sum = {
    A: [],
    D: [],
    M: [],
    '??': []
  };
  if (list.length === 0) return sum;
  list.forEach(str => {
    let arr = str.trim().replace(/\s+/g, ' ').split(' '),
        type = arr.splice(0, 1);
    if (!sum[type]) sum[type] = [];
    sum[type].push(arr.join(' '));
  });
  return sum;
}
function getStatus() {
  let sum = getStatusInfo({
    silent: false
  });

  if (sum.A.length > 0 || sum.D.length > 0 || sum.M.length > 0) {
    sh__default['default'].echo(error('您还有未提交的文件，请处理后再继续') + '\n如果需要暂存文件请执行: gitm save\n恢复时执行：gitm get');
    sh__default['default'].exit(1);
    return false;
  } else if (sum['??'].length > 0) {
    sh__default['default'].echo(warning('您有未加入版本的文件,') + '\n如果需要暂存文件请执行: gitm save --force\n恢复时执行：gitm get');
  }

  return true;
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
const checkBranch = async name => {
  const data = await queue([`gitm branch -k ${name}`]);
  return data[0].out.replace(/^\s+/, '');
};
function getCurrent() {
  return sh__default['default'].exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout.replace(/[\n\s]*$/g, '');
}
async function searchBranch(key, type, remote = false) {
  const data = (await queue([`gitm branch${key ? ' -k ' + key : ''}${type ? ' -t ' + type : ''}${remote ? ' -r' : ''}`]))[0].out.replace(/^\*\s+/, '');
  let arr = data ? data.split('\n') : [];
  arr = arr.map(el => el.trim());
  return arr;
}
function searchBranchs(opt = {}) {
  let {
    path,
    key,
    type,
    remote = false
  } = opt;
  if (!path) path = sh__default['default'].pwd().stdout;
  const data = sh__default['default'].exec(`git ls-remote${remote ? ' --refs' : ' --heads'} --quiet --sort="version:refname" ${path}`, {
    silent: true
  }).stdout.replace(/\n*$/g, '');
  let arr = data ? data.split('\n') : [],
      map = {
    heads: [],
    tags: [],
    others: []
  };

  for (let el of arr) {
    let match = el.match(/^\w+[\s]+refs\/(heads|remotes|tags)\/([\w-\/]+)$/);
    if (!match) continue;

    switch (match[1]) {
      case 'heads':
        map.heads.push(match[2]);
        break;

      case 'remotes':
        map.heads.push(match[2]);
        break;

      case 'tags':
        map.tags.push(match[2]);
        break;

      default:
        map.others.push(match[2]);
        break;
    }
  }

  if (type && ['bugfix', 'feature', 'support'].includes(type)) {
    map.heads = map.heads.filter(el => el.indexOf('/' + type + '/') > -1);
  }

  if (key) {
    map.heads = map.heads.filter(el => el.indexOf(key) > -1);
  }

  return map.heads;
}
function filterBranch(key, types = [], remote = false) {
  if (typeof types === 'string') types = types.split(',');
  const out = sh__default['default'].exec(`git branch${remote ? ' -a' : ''}`, {
    silent: true
  }).stdout.replace(/(^\s+|[\n\r]*$)/g, '').replace(/\*\s+/, '');
  let list = out ? out.replace(/\n(\s+)/g, '\n').split('\n') : [];
  list = list.filter(el => {
    let result = true;
    if (key && !el.includes(key)) result = false;

    if (result && types.length > 0) {
      result = false;

      type: for (const type of types) {
        if (el.includes(type)) {
          result = true;
          break type;
        }
      }
    }

    return result;
  });
  return list;
}
async function getStashList(key) {
  const data = (await queue(['git stash list']))[0].out.replace(/^\*\s+/, '');
  let list = data && data.split('\n') || [],
      arr = [];
  if (list.length > 10) sh__default['default'].echo(warning(`该项目下一共有${list.length}条暂存记录，建议定期清理！`));

  try {
    list.forEach(item => {
      let msgArr = item.split(':'),
          first = msgArr.shift();

      if (!key || key && key === msgArr[msgArr.length - 1].trim()) {
        let m = first.match(/^stash@\{(\d+)\}$/);
        if (msgArr.length > 1) msgArr.shift();
        arr.push({
          key: first,
          index: +m[1],
          msg: msgArr.join(':').trim()
        });
      }
    });
  } catch (e) {}

  return arr;
}
function getMessage(type) {
  const {
    root
  } = gitRevParse();
  const {
    appName
  } = getGitConfig();
  const config = getConfig();
  let str = '',
      d = new Date();

  switch (type) {
    case 'time':
      str = d;
      break;

    case 'timeNum':
      str = d.getTime();
      break;

    case 'pwd':
      str = root;
      break;

    case 'project':
      str = appName;
      break;

    case 'user':
      str = config.user;
      break;
  }

  return str;
}
function postMessage(msg = '') {
  const config = getConfig();

  if (!config.msgTemplate) {
    sh__default['default'].echo(error('请配置消息发送api模板地址'));
    return;
  }

  let message = mapTemplate(config.msgTemplate, key => {
    if (key === 'message') return msg;
    return getMessage(key);
  });
  config.msgUrl && sendMessage(message);
}
function sendMessage(message = '', cfg = {}) {
  const config = getConfig();
  const {
    silent = true
  } = cfg;

  if (!config.msgUrl) {
    sh__default['default'].echo(error('请配置消息推送地址'));
    return;
  }

  message = message.replace(/\s/g, '');
  config.msgUrl && sh__default['default'].exec(`curl -i -H "Content-Type: application/json" -X POST -d '{"envParams":{"error_msg":"'${message}'"}}' "${config.msgUrl}"`, {
    silent
  });
}
function getCommandMessage(cmd) {
  let msg = {},
      arr = cmd.replace(/[\s]+/g, ' ').split(' ');
  if (arr.length < 2 || arr[0] !== 'git') return msg;

  switch (arr[1]) {
    case 'checkout':
      msg.success = '切换分支成功';
      msg.fail = '切换分支失败';
      break;

    case 'pull':
      msg.success = '拉取代码成功';
      msg.fail = '拉取代码失败';
      break;

    case 'fetch':
      msg.success = '抓取成功';
      msg.fail = '抓取失败';
      break;

    case 'commit':
      msg.success = '提交成功';
      msg.fail = '提交失败';
      break;

    case 'push':
      msg.success = '推送成功';
      msg.fail = '推送失败';
      break;

    case 'cherry-pick':
      msg.success = '同步提交记录成功';
      msg.fail = '同步提交记录失败';
      break;

    case 'merge':
      msg.success = 'merge分支成功';
      msg.fail = 'merge分支失败';
      break;

    case 'rebase':
      msg.success = 'rebase分支成功';
      msg.fail = 'rebase分支失败';
      break;

    case 'revert':
      msg.success = '撤销成功';
      msg.fail = '撤销失败';
      break;

    case 'clean':
      msg.success = '清理成功';
      msg.fail = '清理失败';
      break;
  }

  return msg;
}
function compareVersion(basicVer, compareVer) {
  if (basicVer === null) return null;
  basicVer = basicVer + '.';
  compareVer = compareVer + '.';
  let bStr = parseFloat(basicVer),
      cStr = parseFloat(compareVer),
      bStrNext = parseFloat(basicVer.replace(bStr + '.', '')) || 0,
      cStrNext = parseFloat(compareVer.replace(cStr + '.', '')) || 0;

  if (cStr > bStr) {
    return false;
  } else if (cStr < bStr) {
    return true;
  } else {
    if (bStrNext >= cStrNext) {
      return true;
    } else {
      return false;
    }
  }
}
function getBranchsFromID(commitID, remote = false) {
  const out = sh__default['default'].exec(`git branch ${remote ? '-r' : ''} --contains ${commitID} --format="%(refname:short)`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
  return out ? out.split('\n') : [];
}
function getGitUser() {
  return sh__default['default'].exec(`git config user.name`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
}
function getGitEmail() {
  return sh__default['default'].exec(`git config user.email`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}
var index = {
  warning,
  error,
  success,
  writeFile,
  mapTemplate,
  getSeconds,
  wait,
  queue,
  getCache,
  setCache,
  setLog,
  getStatusInfo,
  getStatus,
  getLogs,
  checkBranch,
  getCurrent,
  searchBranch,
  searchBranchs,
  filterBranch,
  getStashList,
  postMessage,
  sendMessage,
  getCommandMessage,
  compareVersion,
  getBranchsFromID,
  getGitUser,
  getGitEmail,
  isGitProject
};

exports.checkBranch = checkBranch;
exports.compareVersion = compareVersion;
exports['default'] = index;
exports.error = error;
exports.filterBranch = filterBranch;
exports.getBranchsFromID = getBranchsFromID;
exports.getCache = getCache;
exports.getCommandMessage = getCommandMessage;
exports.getCurrent = getCurrent;
exports.getGitEmail = getGitEmail;
exports.getGitUser = getGitUser;
exports.getLogs = getLogs;
exports.getMessage = getMessage;
exports.getSeconds = getSeconds;
exports.getStashList = getStashList;
exports.getStatus = getStatus;
exports.getStatusInfo = getStatusInfo;
exports.isGitProject = isGitProject;
exports.mapTemplate = mapTemplate;
exports.postMessage = postMessage;
exports.queue = queue;
exports.searchBranch = searchBranch;
exports.searchBranchs = searchBranchs;
exports.sendMessage = sendMessage;
exports.setCache = setCache;
exports.setLog = setLog;
exports.success = success;
exports.wait = wait;
exports.warning = warning;
exports.writeFile = writeFile;

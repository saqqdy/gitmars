#!/usr/bin/env node
'use strict';

var commander = require('commander');
var sh = require('shelljs');
var fs = require('fs');
var colors = require('colors');
var slash = require('slash');
var cosmiconfig = require('cosmiconfig');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var slash__default = /*#__PURE__*/_interopDefaultLegacy(slash);

const cmdConfig = {
  command: 'copy',
  short: 'cp',
  args: [{
    required: true,
    name: 'from',
    variadic: false,
    validator: (val, opts, cb) => {
      if (/\s+/.test(val)) {
        cb(new Error('请不要输入空格'));
        return;
      }

      cb();
    },
    description: '来源分支'
  }, {
    required: false,
    name: 'commitid',
    variadic: true,
    validator: (val, opts, cb) => {
      cb();
    },
    description: '提交记录ID'
  }],
  options: [{
    flags: '-k, --key [keyword]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-k',
    long: '--key',
    negate: false,
    description: '模糊搜索commit信息关键词',
    defaultValue: ''
  }, {
    flags: '-a, --author [author]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-a',
    long: '--author',
    negate: false,
    description: '提交者',
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
function getCurrent() {
  return sh__default['default'].exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout.replace(/[\n\s]*$/g, '');
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

commander.program.name('gitm copy').usage('<from> [commitid...] [-k] [-a]').description('cherry-pick易用版本，从某个分支拷贝某条记录合并到当前分支');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action((from, commitid, opts) => {
  let status = getStatus(),
      cur = getCurrent();
  if (!status) sh__default['default'].exit(1);

  if (opts.key !== '' || opts.author !== '') {
    let cmd = [`git checkout ${from}`, `git log --grep=${opts.key} --author=${opts.author}`];
    sh__default['default'].echo(warning('为确保copy准确，请尽量完整填写关键词'));
    queue(cmd).then(data => {
      let commits = [];

      if (data[1].code === 0) {
        let logs = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || [],
            cmds = [`git checkout ${cur}`];
        logs.forEach(el => {
          commits.push(el.replace(/(commit\s)|\n/g, ''));
        });
        commits.reverse();

        if (commits.length > 0) {
          cmds = cmds.concat([{
            cmd: `git cherry-pick ${commits.join(' ')}`,
            config: {
              slient: false,
              again: false,
              success: '记录合并成功',
              fail: `合并失败，请根据提示处理`
            }
          }, {
            cmd: `git push`,
            config: {
              slient: false,
              again: true,
              success: '推送成功',
              fail: '推送失败，请根据提示处理'
            }
          }]);
        } else {
          sh__default['default'].echo('没有找到任何记录');
        }

        queue(cmds);
      } else {
        sh__default['default'].echo(data[1].err);
      }
    });
  } else {
    let cmd = [{
      cmd: `git cherry-pick ${commitid.join(' ')}`,
      config: {
        slient: false,
        again: false,
        success: '记录合并成功',
        fail: `合并失败，请根据提示处理`
      }
    }, {
      cmd: `git push`,
      config: {
        slient: false,
        again: true,
        success: '推送成功',
        fail: '推送失败，请根据提示处理'
      }
    }];
    queue(cmd);
  }
});
commander.program.parse(process.argv);

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
  command: 'get',
  short: 'gt',
  args: [{
    required: false,
    name: 'message',
    variadic: false,
    validator: (val, opts, cb) => {
      if (/\s+/.test(val)) {
        cb(new Error('请不要输入空格'));
        return;
      }

      cb();
    },
    description: '存取关键字'
  }, {
    required: false,
    name: 'index',
    variadic: false,
    description: '序号'
  }],
  options: [{
    flags: '-k, --keep [keep]',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-k',
    long: '--keep',
    negate: false,
    description: '保留暂存区不删除',
    defaultValue: false
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
function getCurrent() {
  return sh__default['default'].exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout.replace(/[\n\s]*$/g, '');
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

commander.program.name('gitm get').usage('[message] [index]').description('恢复暂存区文件');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(async (message, index, opt) => {
  if (!message) message = getCurrent();
  let list = await getStashList(message);
  if (list.length === 0) sh__default['default'].echo(warning(`该分支没有暂存任何文件！`));
  if (index === undefined && list.length > 1) sh__default['default'].echo(warning(`该分支下有${list.length}条暂存记录，默认恢复最近的一条记录`));
  if (list.length > 2) sh__default['default'].echo(warning(`该分支下有${list.length}条暂存记录，建议定期清理不必要的暂存记录！`));
  queue([{
    cmd: `git stash ${opt.keep ? 'apply' : 'pop'} ${list[index || 0].key}`,
    config: {
      again: opt.keep ? false : `git stash drop ${list[index || 0].key}`,
      success: '文件恢复成功',
      fail: '恢复失败，请检查冲突'
    }
  }]);
});
commander.program.parse(process.argv);

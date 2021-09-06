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
  command: 'update',
  short: 'up',
  args: [{
    required: false,
    name: 'type',
    variadic: false,
    description: '分支类型'
  }, {
    required: false,
    name: 'name',
    variadic: false,
    description: '分支名称(不带feature/bugfix前缀)'
  }],
  options: [{
    flags: '--use-merge',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    long: '--use-merge',
    negate: false,
    description: '使用merge方式更新(默认merge)',
    defaultValue: true,
    recommend: true
  }, {
    flags: '--use-rebase',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    long: '--use-rebase',
    negate: false,
    description: '使用rebase方式更新(默认merge)',
    defaultValue: false,
    recommend: true
  }, {
    flags: '-a --all',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-a',
    long: '--all',
    negate: false,
    description: '更新本地所有bugfix、feature、support分支',
    defaultValue: false,
    recommend: false
  }]
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
const config = getConfig();
commander.program.name('gitm update').usage('[type] [name]').description('更新bug任务分支、更新feature功能开发分支、框架调整分支support');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action((type, name, opt) => {
  const allow = ['bugfix', 'feature', 'support'];
  const deny = [defaults.master, defaults.develop, defaults.release, defaults.bugfix, defaults.support];
  let status = getStatus(),
      cmds = [],
      branchList = [];
  if (!status) sh__default['default'].exit(1);

  if (opt.all) {
    if (!type) type = allow;
    branchList = filterBranch('', type);
  } else if (!type || !name) {
    const current = getCurrent();
    [type, name] = current.split('/');

    if (!name) {
      deny.includes(type) && sh__default['default'].echo(error(`骚年，你在${type}分支执行这个指令是什么骚操作？`));
      sh__default['default'].exit(1);
    }

    if (!allow.includes(type)) {
      sh__default['default'].echo(error('type只允许输入：' + JSON.stringify(allow)));
      sh__default['default'].exit(1);
    }

    branchList = [].concat(current);
  } else if (!allow.includes(type)) {
    sh__default['default'].echo(error('type只允许输入：' + JSON.stringify(allow)));
    sh__default['default'].exit(1);
  } else {
    branchList = [type + '/' + name];
  }

  branchList.forEach(branch => {
    [type, name] = branch.split('/');
    let base = type === 'bugfix' ? config.bugfix : type === 'support' ? config.master : config.release,
        cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout ${type}/${name}`];

    if (opt.useRebase) {
      cmd.push({
        cmd: `git rebase ${base}`,
        config: {
          slient: false,
          again: false,
          success: `${base}更新到${type}/${name}成功`,
          fail: `${base}更新到${type}/${name}出错了，请根据提示处理`
        }
      });
    } else {
      cmd.push({
        cmd: `git merge --no-ff ${base}`,
        config: {
          slient: false,
          again: false,
          success: `${base}同步到${type}/${name}成功`,
          fail: `${base}同步到${type}/${name}出错了，请根据提示处理`
        }
      });
    }

    cmds = cmds.concat(cmd);
  });
  queue(cmds);
});
commander.program.parse(process.argv);

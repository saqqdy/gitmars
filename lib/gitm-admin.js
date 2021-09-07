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
  command: 'admin',
  short: null,
  create: {
    command: 'create',
    short: null,
    args: [{
      required: true,
      name: 'type',
      variadic: false,
      validator: (val, opts, cb) => {
        if (/\s+/.test(val)) {
          cb(new Error('请不要输入空格'));
          return;
        }

        cb();
      },
      description: '分支类型'
    }],
    options: [],
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
  },
  publish: {
    command: 'publish',
    short: null,
    args: [{
      required: true,
      name: 'type',
      variadic: false,
      validator: (val, opts, cb) => {
        if (/\s+/.test(val)) {
          cb(new Error('请不要输入空格'));
          return;
        }

        cb();
      },
      description: '分支类型'
    }],
    options: [{
      flags: '-c, --combine',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      short: '-c',
      long: '--combine',
      negate: false,
      description: '是否把release代码同步到bug',
      defaultValue: false,
      recommend: false
    }, {
      flags: '--use-rebase',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      long: '--use-rebase',
      negate: false,
      description: '是否使用rebase方式更新，默认merge',
      defaultValue: false,
      recommend: false
    }, {
      flags: '-p, --prod',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      short: '-p',
      long: '--prod',
      negate: false,
      description: '发布bug分支时，是否合并bug到master',
      defaultValue: false,
      recommend: false
    }, {
      flags: '-b, --build [build]',
      required: false,
      optional: true,
      variadic: false,
      mandatory: false,
      short: '-b',
      long: '--build',
      negate: false,
      description: '构建应用',
      recommend: true
    }, {
      flags: '--postmsg',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      long: '--postmsg',
      negate: false,
      description: '发送消息',
      defaultValue: false,
      recommend: false
    }],
    validatorOpts: (val, opts, cb) => {
      if (val.includes('--combine') && val.includes('--prod')) {
        cb(new Error('不能同时选择“把release合并到bug”和“合并bug到master”'));
        return;
      }

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
  },
  update: {
    command: 'update',
    short: null,
    args: [{
      required: true,
      name: 'type',
      variadic: false,
      validator: (val, opts, cb) => {
        if (/\s+/.test(val)) {
          cb(new Error('请不要输入空格'));
          return;
        }

        cb();
      },
      description: '分支类型'
    }],
    options: [{
      flags: '--use-rebase',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      long: '--use-rebase',
      negate: false,
      description: '是否使用rebase方式更新，默认merge',
      defaultValue: false,
      recommend: false
    }, {
      flags: '-m, --mode [mode]',
      required: false,
      optional: true,
      variadic: false,
      mandatory: false,
      short: '-m',
      long: '--mode',
      negate: false,
      description: '出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用',
      defaultValue: 0,
      recommend: false
    }, {
      flags: '--postmsg',
      required: false,
      optional: false,
      variadic: false,
      mandatory: false,
      long: '--postmsg',
      negate: false,
      description: '发送消息',
      defaultValue: false,
      recommend: false
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
  },
  clean: {
    command: 'clean',
    short: null,
    args: [{
      required: true,
      name: 'type',
      variadic: false,
      validator: (val, opts, cb) => {
        if (/\s+/.test(val)) {
          cb(new Error('请不要输入空格'));
          return;
        }

        cb();
      },
      description: '分支类型'
    }],
    options: [],
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
  }
};
const create = cmdConfig.create;
const publish = cmdConfig.publish;
const update = cmdConfig.update;
const clean = cmdConfig.clean;

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
const checkBranch = async name => {
  const data = await queue([`gitm branch -k ${name}`]);
  return data[0].out.replace(/^\s+/, '');
};
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
function getGitUser() {
  return sh__default['default'].exec(`git config user.name`, {
    silent: true
  }).stdout.replace(/(^\s+|\n*$)/g, '');
}
function isGitProject() {
  return sh__default['default'].exec(`git rev-parse --is-inside-work-tree`, {
    silent: true
  }).stdout.includes('true');
}

function getUserToken() {
  const config = getConfig();

  if (!config.api) {
    sh__default['default'].echo(error('请配置用于请求权限的api接口地址，接收参数形式：url?name=git_user_name，返回data=token'));
    process.exit(1);
  }

  const user = getGitUser();

  if (!user) {
    sh__default['default'].echo(error('请设置本地git用户名'));
    process.exit(1);
  }

  let fetchData = sh__default['default'].exec(`curl -s ${config.api}?name=${user}`, {
    silent: true
  }).stdout,
      userInfo;

  try {
    fetchData = JSON.parse(fetchData);
    userInfo = fetchData.data || null;
  } catch (err) {
    userInfo = null;
  }

  if (!userInfo) {
    sh__default['default'].echo(error('没有找到用户，请联系管理员'));
    process.exit(1);
  } else if (!userInfo.token) {
    sh__default['default'].echo(error('请设置access_token'));
    process.exit(1);
  }

  return userInfo;
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
const {
  appName
} = getGitConfig();
const config = getConfig();
const {
  token,
  level,
  nickname = ''
} = config.api ? getUserToken() : {};
const program = new commander.Command();

if (create.args.length > 0) {
  const _program = program.name('gitm admin').usage('<command> <type>').description('创建bugfix、release、develop和support分支').command('create ' + createArgs(create.args));

  create.options.forEach(o => {
    _program.option(o.flags, o.description, o.defaultValue);
  });

  _program.action(async type => {
    const opts = ['bugfix', 'release', 'develop', 'support'];
    let base = type === 'release' ? config.master : config.release,
        status = getStatus(),
        hasBase = await checkBranch(base),
        exits = await checkBranch(config[type]);
    if (!status) sh__default['default'].exit(1);

    if (!hasBase) {
      sh__default['default'].echo(error(base + '分支不存在，请先创建' + base + '分支'));
      sh__default['default'].exit(1);
    }

    if (exits) {
      sh__default['default'].echo(error(config[type] + '分支已存在，不需要重复创建'));
      sh__default['default'].exit(1);
    }

    if (opts.includes(type)) {
      let cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout -b ${config[type]} ${base}`];
      queue(cmd).then(data => {
        if (data[3].code === 0) {
          sh__default['default'].echo(`${config[type]}分支创建成功，该分支基于${base}创建，您当前已经切换到${config[type]}\n需要发版时，记得执行: ${success('gitm admin publish ' + config[type])}`);
        }
      });
    } else {
      sh__default['default'].echo(error('type只允许输入：' + opts.join(',')));
      sh__default['default'].exit(1);
    }
  });
}

if (publish.args.length > 0) {
  const _program = program.name('gitm admin').usage('<command> <type>').description('发布bugfix、release、support分支').command('publish ' + createArgs(publish.args));

  publish.options.forEach(o => {
    _program.option(o.flags, o.description, o.defaultValue);
  });

  _program.action(async (type, opt) => {
    const opts = ['bugfix', 'release', 'support'];
    let status = getStatus(),
        curBranch = await getCurrent();
    if (!status) sh__default['default'].exit(1);

    if (opts.includes(type)) {
      let cmd = !level || level < 3 ? {
        bugfix: [`git fetch`, `git checkout ${config.bugfix}`, `git pull`, `git checkout ${config.release}`, `git pull`, {
          cmd: `git merge --no-ff ${config.bugfix}`,
          config: {
            slient: false,
            again: false,
            postmsg: opt.postmsg,
            success: `${config.bugfix}合并到${config.release}成功`,
            fail: `${config.bugfix}合并到${config.release}出错了，请根据提示处理`
          }
        }, {
          cmd: `git push`,
          config: {
            slient: false,
            again: true,
            success: '推送成功',
            fail: '推送失败，请根据提示处理'
          }
        }],
        support: [`git fetch`, `git checkout ${config.support}`, `git pull`, `git checkout ${config.release}`, `git pull`, {
          cmd: `git merge --no-ff ${config.support}`,
          config: {
            slient: false,
            again: false,
            success: `${config.support}合并到${config.release}成功`,
            fail: `${config.support}合并到${config.release}出错了，请根据提示处理`
          }
        }, {
          cmd: `git push`,
          config: {
            slient: false,
            again: true,
            success: '推送成功',
            fail: '推送失败，请根据提示处理'
          }
        }, `git checkout ${config.bugfix}`, `git pull`, {
          cmd: `git merge --no-ff ${config.support}`,
          config: {
            slient: false,
            again: false,
            success: `${config.support}合并到${config.bugfix}成功`,
            fail: `${config.support}合并到${config.bugfix}出错了，请根据提示处理`
          }
        }, {
          cmd: `git push`,
          config: {
            slient: false,
            again: true,
            success: '推送成功',
            fail: '推送失败，请根据提示处理'
          }
        }],
        release: [`git fetch`, `git checkout ${config.release}`, `git pull`, `git checkout ${config.master}`, `git pull`, {
          cmd: `git merge --no-ff ${config.release}`,
          config: {
            slient: false,
            again: false,
            success: `${config.release}合并到${config.master}成功`,
            fail: `${config.release}合并到${config.master}出错了，请根据提示处理`
          }
        }, {
          cmd: `git push`,
          config: {
            slient: false,
            again: true,
            success: '推送成功',
            fail: '推送失败，请根据提示处理'
          }
        }]
      } : {
        bugfix: [{
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.bugfix}\\",\\"target_branch\\":\\"${config.release}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.bugfix}' into '${config.release}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            slient: false,
            again: true,
            success: '成功创建合并请求',
            fail: '创建合并请求出错了，请根据提示处理'
          }
        }, `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.release}分支的merge请求"`],
        support: [{
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.support}\\",\\"target_branch\\":\\"${config.release}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.support}' into '${config.release}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            slient: false,
            again: true,
            success: '成功创建合并请求',
            fail: '创建合并请求出错了，请根据提示处理'
          }
        }, `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.release}分支的merge请求"`, {
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.support}\\",\\"target_branch\\":\\"${config.bugfix}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.support}' into '${config.bugfix}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            slient: false,
            again: true,
            success: '成功创建合并请求',
            fail: '创建合并请求出错了，请根据提示处理'
          }
        }, `gitm postmsg "${nickname}在${appName}项目提交了${config.support}分支合并到${config.bugfix}分支的merge请求"`],
        release: [{
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.release}\\",\\"target_branch\\":\\"${config.master}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.release}' into '${config.master}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            slient: false,
            again: true,
            success: '成功创建合并请求',
            fail: '创建合并请求出错了，请根据提示处理'
          }
        }, `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.master}分支的merge请求"`]
      };

      if (type === 'bugfix' && opt.prod) {
        cmd[type] = cmd[type].concat(!level || level < 3 ? [`git checkout ${config.master}`, `git pull`, {
          cmd: `git merge --no-ff ${config.bugfix}`,
          config: {
            slient: false,
            again: false,
            success: `${config.bugfix}合并到${config.master}成功`,
            fail: `${config.bugfix}合并到${config.master}出错了，请根据提示处理`
          }
        }, {
          cmd: `git push`,
          config: {
            slient: false,
            again: true,
            success: '推送成功',
            fail: '推送失败，请根据提示处理'
          }
        }] : [{
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.bugfix}\\",\\"target_branch\\":\\"${config.master}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.bugfix}' into '${config.master}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            slient: false,
            again: true,
            success: '成功创建合并请求',
            fail: '创建合并请求出错了，请根据提示处理'
          }
        }, `gitm postmsg "${nickname}在${appName}项目提交了${config.bugfix}分支合并到${config.master}分支的merge请求"`]);

        if (opt.build && (!level || level < 3)) {
          cmd[type] = cmd[type].concat([{
            cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? 'all' : opt.build}`,
            config: {
              slient: true,
              again: false,
              success: '调起构建成功',
              fail: '调起构建失败'
            }
          }]);
        }
      }

      if (type === 'release' && opt.build && (!level || level < 3)) {
        cmd[type] = cmd[type].concat([{
          cmd: `gitm build ${appName} --env prod --app ${opt.build === true ? 'all' : opt.build}`,
          config: {
            slient: true,
            again: false,
            success: '调起构建成功',
            fail: '调起构建失败'
          }
        }]);
      }

      if (type === 'release' && opt.combine) {
        if (opt.useRebase) {
          cmd[type] = cmd[type].concat([`git checkout ${config.release}`, `git pull`, `git checkout ${config.bugfix}`, {
            cmd: `git pull origin ${config.bugfix} --rebase`,
            config: {
              slient: false,
              again: true
            }
          }, {
            cmd: `git rebase ${config.release}`,
            config: {
              slient: false,
              again: false,
              postmsg: opt.postmsg,
              success: `${config.release}同步到${config.bugfix}成功`,
              fail: `${config.release}同步到${config.bugfix}出错了，请根据提示处理`
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
          cmd[type] = cmd[type].concat(!level || level < 3 ? [`git checkout ${config.release}`, `git pull`, `git checkout ${config.bugfix}`, `git pull`, {
            cmd: `git merge --no-ff ${config.release}`,
            config: {
              slient: false,
              again: false,
              postmsg: opt.postmsg,
              success: `${config.release}合并到${config.bugfix}成功`,
              fail: `${config.release}合并到${config.bugfix}出错了，请根据提示处理`
            }
          }, {
            cmd: `git push`,
            config: {
              slient: false,
              again: true,
              success: '推送成功',
              fail: '推送失败，请根据提示处理'
            }
          }] : [{
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${config.release}\\",\\"target_branch\\":\\"${config.bugfix}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${config.release}' into '${config.bugfix}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              slient: false,
              again: true,
              success: '成功创建合并请求',
              fail: '创建合并请求出错了，请根据提示处理'
            }
          }, `gitm postmsg "${nickname}在${appName}项目提交了${config.release}分支合并到${config.bugfix}分支的merge请求"`]);
        }
      }

      for (let key in cmd) {
        cmd[key].push(`git checkout ${curBranch}`);
      }

      queue(cmd[type]);
    } else {
      sh__default['default'].echo(error('type只允许输入：' + opts.join(',')));
      sh__default['default'].exit(1);
    }
  });
}

if (update.args.length > 0) {
  const _program = program.name('gitm admin').usage('<command> <type> [-m --mode [mode]]').description('更新bugfix、release、support分支代码').command('update ' + createArgs(update.args));

  update.options.forEach(o => {
    _program.option(o.flags, o.description, o.defaultValue);
  });

  _program.action((type, opt) => {
    const opts = ['bugfix', 'release', 'support'];
    let base = type === 'release' ? config.master : config.release,
        mode = '',
        status = getStatus();
    if (!status) sh__default['default'].exit(1);

    if (opt.mode === 1) {
      mode = ' --strategy-option ours';
    } else if (opt.mode === 2) {
      mode = ' --strategy-option theirs';
    }

    if (opts.includes(type)) {
      let cmd = !level || level < 3 ? [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout ${config[type]}`, {
        cmd: `git pull`,
        config: {
          slient: false,
          again: true
        }
      }, {
        cmd: `git merge --no-ff ${base}${mode}`,
        config: {
          slient: false,
          again: false,
          postmsg: opt.postmsg,
          success: `${base}同步到${config[type]}成功`,
          fail: `${base}同步到${config[type]}出错了，请根据提示处理`
        }
      }, {
        cmd: `git push`,
        config: {
          slient: false,
          again: true,
          success: '推送成功',
          fail: '推送失败，请根据提示处理'
        }
      }] : [{
        cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\\"source_branch\\":\\"${base}\\",\\"target_branch\\":\\"${config[type]}\\",\\"private_token\\":\\"${token}\\",\\"title\\":\\"Merge branch '${base}' into '${config[type]}'\\"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
        config: {
          slient: false,
          again: true,
          success: '成功创建合并请求',
          fail: '创建合并请求出错了，请根据提示处理'
        }
      }, `gitm postmsg "${nickname}在${appName}项目提交了${base}分支合并到${config[type]}分支的merge请求"`];

      if (opt.useRebase) {
        cmd = [`git fetch`, `git checkout ${base}`, `git pull`, `git checkout ${config[type]}`, {
          cmd: `git pull origin ${config[type]} --rebase`,
          config: {
            slient: false,
            again: true
          }
        }, {
          cmd: `git rebase ${base}`,
          config: {
            slient: false,
            again: false,
            postmsg: opt.postmsg,
            success: `${base}同步到${config[type]}成功`,
            fail: `${base}同步到${config[type]}出错了，请根据提示处理`
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
      }

      queue(cmd);
    } else {
      sh__default['default'].echo(error('type只允许输入：' + opts.join(',')));
      sh__default['default'].exit(1);
    }
  });
}

if (clean.args.length > 0) {
  const _program = program.name('gitm admin').usage('<command> <type>').description('构建清理工作').command('clean ' + createArgs(clean.args));

  clean.options.forEach(o => {
    _program.option(o.flags, o.description, o.defaultValue);
  });

  _program.action(type => {
    const opts = ['bugfix', 'release', 'develop', 'master'];
    let status = getStatus();
    if (!status) sh__default['default'].exit(1);

    if (opts.includes(type)) {
      let cmd = [`git fetch`, `git checkout . -f`, `git clean -fd`, `git checkout ${config.master}`, `git branch -D ${config[type]}`, `git fetch`, `git checkout ${config[type]}`, `git pull`];
      if (type === 'master') cmd = [`git checkout .`, `git clean -fd`, `git checkout ${config.master}`, `git clean -fd`, `git fetch`, `git pull`];
      queue(cmd);
    } else {
      sh__default['default'].echo(error('type只允许输入：' + opts.join(',')));
      sh__default['default'].exit(1);
    }
  });
}

program.parse(process.argv);

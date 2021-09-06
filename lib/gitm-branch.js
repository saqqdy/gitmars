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
  command: 'branch',
  short: 'bh',
  args: [],
  options: [{
    flags: '-k, --key [keyword]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-k',
    long: '--key',
    negate: false,
    description: '查询分支的关键词',
    defaultValue: null
  }, {
    flags: '-r, --remote',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-r',
    long: '--remote',
    negate: false,
    description: '是否查询远程分支（这个参数不用于删除分支）默认只查询本地',
    defaultValue: false
  }, {
    flags: '-t, --type [type]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-t',
    long: '--type',
    negate: false,
    description: '查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部',
    defaultValue: null
  }, {
    flags: '-d, --delete [branch]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-d',
    long: '--delete',
    negate: false,
    description: '删除分支',
    defaultValue: null
  }, {
    flags: '-D, --forcedelete [branch]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-D',
    long: '--forcedelete',
    negate: false,
    description: '强行删除分支',
    defaultValue: null
  }, {
    flags: '-u, --upstream [upstream]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-u',
    long: '--upstream',
    negate: false,
    description: '设置与远程分支关联'
  }],
  validatorOpts: (val, opts, cb) => {
    if (val.includes('--upstream') && (val.includes('--key') || val.includes('--remote') || val.includes('--type') || val.includes('--delete') || val.includes('--forcedelete'))) {
      cb(new Error('使用绑定/取消绑定远程分支功能时，不能与其他功能混用'));
      return;
    }

    if ((val.includes('--delete') || val.includes('--forcedelete')) && (val.includes('--key') || val.includes('--type'))) {
      cb(new Error('使用删除分支功能时，不能与查询分支功能混用'));
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

commander.program.name('gitm branch').usage('[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [-r --remote [remote]] [-D --forcedelete [branch]]').description('分支查询、删除（注意该指令不用于创建分支，如需创建分支请走start流程）');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(opt => {
  let cmd = [];

  if (opt.delete) {
    const id = sh__default['default'].exec(`git rev-parse --verify ${opt.delete}`, {
      silent: true
    }).stdout.replace(/[\s]*$/g, '');
    if (/^[a-z0-9]+$/.test(id)) cmd.push(`git branch -d ${opt.delete}`);
    if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`);
  } else if (opt.forcedelete) {
    const id = sh__default['default'].exec(`git rev-parse --verify ${opt.delete}`, {
      silent: true
    }).stdout.replace(/[\s]*$/g, '');
    if (/^[a-z0-9]+$/.test(id)) cmd.push(`git branch -D ${opt.forcedelete}`);
    if (opt.remote) cmd.push(`git push origin --delete ${opt.delete}`);
  } else if (opt.upstream) {
    if (typeof opt.upstream === 'string') {
      cmd.push(`git branch --set-upstream-to origin/${opt.upstream}`);
    } else {
      cmd.push(`git branch --unset-upstream`);
    }
  } else {
    cmd.push(`git branch -a`);
    queue(cmd).then(data => {
      data.forEach((el, index) => {
        if (index === 0 && el.code === 0) {
          let list = el.out && el.out.split('\n') || [];
          list = list.filter(el => {
            let fit = true;

            if (opt.key) {
              fit = fit && el.indexOf(opt.key) > -1;
            }

            if (opt.type) {
              fit = fit && el.indexOf(opt.type) > -1;
            }

            if (opt.remote) {
              fit = fit && el.indexOf('remotes/origin') > -1;
            } else {
              fit = fit && el.indexOf('remotes/origin') === -1;
            }

            return fit;
          });
          sh__default['default'].echo(list.join('\n'));
        }
      });
    });
    return;
  }

  queue(cmd);
});
commander.program.parse(process.argv);

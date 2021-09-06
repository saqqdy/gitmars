'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sh = require('shelljs');
require('fs');
var colors = require('colors');
require('slash');
require('cosmiconfig');
var inquirer = require('inquirer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);
var colors__default = /*#__PURE__*/_interopDefaultLegacy(colors);
var inquirer__default = /*#__PURE__*/_interopDefaultLegacy(inquirer);

function warning(txt) {
  return colors__default['default'].yellow(txt);
}
function getCurrent() {
  return sh__default['default'].exec('git symbolic-ref --short -q HEAD', {
    silent: true
  }).stdout.replace(/[\n\s]*$/g, '');
}

const createPrompt = (command, {
  options,
  validator,
  transform
}, type) => {
  if (type === 'checkbox') {
    if (!options.length) return null;
    let promptOpt = {
      type,
      message: '请选择',
      name: command,
      choices: [],
      validate: answer => {
        if (validator) {
          let msg = true;
          validator(answer, options, err => {
            if (err) msg = err.message;
          });
          return msg;
        }

        return true;
      }
    };
    options.forEach(option => {
      promptOpt.choices.push({
        name: option.description,
        value: option.long,
        checked: option.recommend
      });
    });
    return promptOpt;
  } else if (type === 'input') {
    let list = [];
    options.forEach(({
      validator: childValidator,
      transformer,
      ...opts
    }) => {
      if (childValidator) validator = childValidator;
      let cfg = {
        type: 'input',
        name: opts.name,
        message: `${opts.description || '请输入参数' + opts.name + '的值'}${!opts.required ? warning('(可不填' + (!['', undefined].includes(opts.defaultValue) ? '，默认"' + opts.defaultValue + '"' : '') + ')') : ''}`,
        transformer: (val, answers, flags) => {
          if (!transformer) {
            return val;
          } else if (transformer instanceof Function) {
            return transformer(val, answers, flags, opts);
          }
        },
        validate: val => {
          let msg = true;
          if (!val && opts.required) msg = '请填写' + opts.description;
          validator && msg === true && validator(val, opts, err => {
            if (err) msg = err.message;
          });
          return msg;
        }
      };
      if (opts.defaultValue !== '') cfg.defaultValue = opts.defaultValue;
      list.push(cfg);
    });
    return list;
  }
};

const getCommand = async ({
  command,
  args,
  options,
  validatorOpts,
  validatorArgs,
  transformOpts,
  transformArgs
}) => {
  let params = [],
      needInput = [];

  if (options.length > 0) {
    const needStep1 = options.some(option => !option.optional && !option.required || !option.recommend);

    if (needStep1) {
      const answer1 = await inquirer__default['default'].prompt(createPrompt(command, {
        options,
        validator: validatorOpts,
        transform: transformOpts
      }, 'checkbox'));
      const {
        [command]: selection
      } = answer1;
      selection.forEach(prop => {
        let option = options.find(opt => opt.long === prop);

        if (option.optional || option.required) {
          needInput.push({
            required: option.required,
            name: option.long,
            variadic: false,
            defaultValue: option.defaultValue,
            description: option.description
          });
        } else {
          params.push(prop);
        }
      });
    } else {
      needInput = options.map(option => {
        return {
          required: option.required,
          name: option.long,
          variadic: false,
          defaultValue: option.defaultValue,
          description: option.description
        };
      });
    }
  }

  if (args.length > 0) {
    const answer2 = await inquirer__default['default'].prompt(createPrompt(command, {
      options: args,
      validator: validatorArgs,
      transform: transformArgs
    }, 'input'));
    params = [].concat(Object.values(answer2)).concat(params);
  }

  if (needInput.length > 0) {
    const answer3 = await inquirer__default['default'].prompt(createPrompt(command, {
      options: needInput
    }, 'input'));
    let arr = Object.entries(answer3).map(item => {
      if (item[1] !== '') item[1] = '"' + item[1] + '"';
      return item;
    });
    params = params.concat(arr.flat(Infinity));
  }

  return Promise.resolve(`${params.join(' ').replace(/\s+/g, ' ').trim()}`);
};

const cleanConfig = (config, sets = {}) => {
  const {
    delOptions = [],
    requiredOptions = [],
    delArgs = [],
    requiredArgs = []
  } = sets;

  if (delOptions.length) {
    let len = config.options.length;

    while (len--) {
      if (delOptions.includes(config.options[len].long)) {
        config.options.splice(len, 1);
      }
    }
  }

  if (delArgs.length) {
    let len = config.args.length;

    while (len--) {
      if (delArgs.includes(config.args[len].name)) {
        config.args.splice(len, 1);
      }
    }
  }

  if (requiredOptions.length) {
    let len = config.options.length;

    while (len--) {
      if (requiredOptions.includes(config.options[len].long)) {
        config.options[len].required = true;
      }
    }
  }

  if (requiredArgs.length) {
    let len = config.args.length;

    while (len--) {
      if (requiredArgs.includes(config.args[len].name)) {
        config.args[len].required = true;
      }
    }
  }

  return config;
};

const cmdConfig$d = {
  command: 'combine',
  short: 'cb',
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
    flags: '-d, --dev',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-d',
    long: '--dev',
    negate: false,
    description: '同步到dev环境',
    defaultValue: false,
    value: true,
    recommend: true
  }, {
    flags: '-p, --prod',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-p',
    long: '--prod',
    negate: false,
    description: '同步到prod环境',
    defaultValue: false,
    value: false,
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
    value: 'all',
    recommend: true
  }, {
    flags: '-m, --commit <commit>',
    required: true,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-m',
    long: '--commit',
    negate: false,
    description: '执行commit，需填写信息',
    defaultValue: '',
    recommend: false
  }, {
    flags: '-a, --add',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-a',
    long: '--add',
    negate: false,
    description: '执行add',
    defaultValue: false,
    recommend: false
  }, {
    flags: '--no-bugfix',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    long: '--no-bugfix',
    negate: true,
    description: 'bug分支合并到release时不合并到bug分支',
    defaultValue: true,
    recommend: false
  }, {
    flags: '--as-feature',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    long: '--as-feature',
    negate: false,
    description: 'bug分支合并到release',
    recommend: false
  }],
  validatorOpts: (val, opts, cb) => {
    if (!val.includes('--dev') && !val.includes('--prod')) {
      cb(new Error('合并dev或者prod必须至少选一个'));
      return;
    }

    if (val.includes('--add') && !val.includes('--commit') || !val.includes('--add') && val.includes('--commit')) {
      cb(new Error('add和commit需要同时选择'));
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
cmdConfig$d.args;
cmdConfig$d.options;

const cmdConfig$c = {
  command: 'end',
  short: 'ed',
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
  options: []
};
cmdConfig$c.args;
cmdConfig$c.options;

const cmdConfig$b = {
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
cmdConfig$b.args;
cmdConfig$b.options;

const cmdConfig$a = {
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
cmdConfig$a.args;
cmdConfig$a.options;

const cmdConfig$9 = {
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
cmdConfig$9.args;
cmdConfig$9.options;

const cmdConfig$8 = {
  command: 'start',
  short: 'st',
  args: [{
    required: true,
    name: 'type',
    variadic: false,
    description: '分支类型'
  }, {
    required: true,
    name: 'name',
    variadic: false,
    description: '分支名称(不带feature/bugfix前缀)'
  }],
  options: []
};
cmdConfig$8.args;
cmdConfig$8.options;

const cmdConfig$7 = {
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
cmdConfig$7.args;
cmdConfig$7.options;

const cmdConfig$6 = {
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
cmdConfig$6.args;
cmdConfig$6.options;

const cmdConfig$5 = {
  command: 'save',
  short: 'sv',
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
  }],
  options: [{
    flags: '-f, --force',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-f',
    long: '--force',
    negate: false,
    description: '没有版本的文件也暂存，这会执行git add .',
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
cmdConfig$5.args;
cmdConfig$5.options;

const cmdConfig$4 = {
  command: 'revert',
  short: 'rt',
  args: [{
    required: false,
    name: 'commitid',
    variadic: false,
    validator: (val, opts, cb) => {
      cb();
    },
    description: '需要撤销的ID'
  }],
  options: [{
    flags: '-n, --number [number]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-n',
    long: '--number',
    negate: false,
    description: '撤销最后一次提交（或者撤销倒数第n次提交）',
    defaultValue: ''
  }, {
    flags: '-m, --mode [mode]',
    required: false,
    optional: true,
    variadic: false,
    mandatory: false,
    short: '-m',
    long: '--mode',
    negate: false,
    description: '针对撤销一次merge记录，需要传入类型：1 = 保留当前分支代码，2 = 保留传入代码',
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
cmdConfig$4.args;
cmdConfig$4.options;

const cmdConfig$3 = {
  command: 'link',
  short: null,
  args: [{
    required: false,
    name: 'name',
    variadic: false,
    validator: (val, opts, cb) => {
      if (/\s+/.test(val)) {
        cb(new Error('请不要输入空格'));
        return;
      }

      cb();
    },
    description: '包的名称'
  }],
  options: []
};
cmdConfig$3.args;
cmdConfig$3.options;

const cmdConfig$2 = {
  command: 'unlink',
  short: null,
  args: [{
    required: false,
    name: 'name',
    variadic: false,
    validator: (val, opts, cb) => {
      if (/\s+/.test(val)) {
        cb(new Error('请不要输入空格'));
        return;
      }

      cb();
    },
    description: '包的名称'
  }],
  options: []
};
cmdConfig$2.args;
cmdConfig$2.options;

const cmdConfig$1 = {
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
cmdConfig$1.args;
cmdConfig$1.options;

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
const update$1 = cmdConfig.update;
const clean = cmdConfig.clean;

const current = getCurrent();
const branchPrefix = current.split('/')[0];
const functionBuanchs = ['feature', 'bugfix', 'support'];
const start = async () => {
  const config = cleanConfig(cmdConfig$8);
  const command = 'gitm start ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const combine = async () => {
  let delOptions = [],
      delArgs = [],
      requiredOptions = [],
      requiredArgs = [];

  if (!functionBuanchs.includes(branchPrefix)) {
    delOptions = ['--as-feature', '--no-bugfix'];
    requiredArgs = ['type', 'name'];
  } else {
    delArgs = ['type', 'name'];

    switch (branchPrefix) {
      case 'feature':
        delOptions = ['--as-feature'];
        break;

      case 'support':
        delOptions = ['--as-feature'];
        break;
    }
  }

  const config = cleanConfig(cmdConfig$d, {
    delOptions,
    requiredOptions,
    delArgs,
    requiredArgs
  });
  const command = 'gitm combine ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const end = async () => {
  let delArgs = [],
      requiredArgs = [];

  if (!functionBuanchs.includes(branchPrefix)) {
    requiredArgs = ['type', 'name'];
  } else {
    delArgs = ['type', 'name'];
  }

  const config = cleanConfig(cmdConfig$c, {
    delArgs,
    requiredArgs
  });
  const command = 'gitm end ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const update = async () => {
  let delArgs = [],
      requiredArgs = [];

  if (!functionBuanchs.includes(branchPrefix)) {
    requiredArgs = ['type', 'name'];
  } else {
    delArgs = ['type', 'name'];
  }

  const config = cleanConfig(cmdConfig$b, {
    delArgs,
    requiredArgs
  });
  const command = 'gitm update ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const branch = async () => {
  const config = cleanConfig(cmdConfig$a);
  const command = 'gitm branch ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const build = async () => {
  const config = cleanConfig(cmdConfig$9);
  const command = 'gitm build ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const copy = async () => {
  const config = cleanConfig(cmdConfig$7);
  const command = 'gitm copy ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const get = async () => {
  const config = cleanConfig(cmdConfig$6);
  const command = 'gitm get ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const save = async () => {
  const config = cleanConfig(cmdConfig$5);
  const command = 'gitm save ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const revert = async () => {
  const config = cleanConfig(cmdConfig$4);
  const command = 'gitm revert ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const link = async () => {
  const config = cleanConfig(cmdConfig$3);
  const command = 'gitm link ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const unlink = async () => {
  const config = cleanConfig(cmdConfig$2);
  const command = 'gitm unlink ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const postmsg = async () => {
  const config = cleanConfig(cmdConfig$1);
  const command = 'gitm postmsg ' + (await getCommand(config));
  sh__default['default'].exec(command);
};
const admin = {
  create: async () => {
    const config = cleanConfig(create);
    const command = 'gitm admin create ' + (await getCommand(config));
    sh__default['default'].exec(command);
  },
  publish: async () => {
    const config = cleanConfig(publish);
    const command = 'gitm admin publish ' + (await getCommand(config));
    sh__default['default'].exec(command);
  },
  update: async () => {
    const config = cleanConfig(update$1);
    const command = 'gitm admin update ' + (await getCommand(config));
    sh__default['default'].exec(command);
  },
  clean: async () => {
    const config = cleanConfig(clean);
    const command = 'gitm admin clean ' + (await getCommand(config));
    sh__default['default'].exec(command);
  }
};

exports.admin = admin;
exports.branch = branch;
exports.build = build;
exports.combine = combine;
exports.copy = copy;
exports.end = end;
exports.get = get;
exports.link = link;
exports.postmsg = postmsg;
exports.revert = revert;
exports.save = save;
exports.start = start;
exports.unlink = unlink;
exports.update = update;

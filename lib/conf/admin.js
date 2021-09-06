'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.clean = clean;
exports.create = create;
exports['default'] = cmdConfig;
exports.publish = publish;
exports.update = update;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

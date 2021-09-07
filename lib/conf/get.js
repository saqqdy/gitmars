'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

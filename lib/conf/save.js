'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cmdConfig = {
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
const args = cmdConfig.args;
const options = cmdConfig.options;

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cmdConfig = {
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
const args = cmdConfig.args;
const options = cmdConfig.options;

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

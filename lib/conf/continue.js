'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cmdConfig = {
  command: 'continue',
  short: 'ct',
  args: [],
  options: [{
    flags: '-l, --list',
    required: false,
    optional: false,
    variadic: false,
    mandatory: false,
    short: '-l',
    long: '--list',
    negate: false,
    description: '显示指令队列',
    defaultValue: false
  }]
};
const args = cmdConfig.args;
const options = cmdConfig.options;

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

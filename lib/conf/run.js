'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cmdConfig = {
  command: 'run',
  short: '',
  args: [{
    required: false,
    name: 'command',
    variadic: false
  }, {
    required: false,
    name: 'args',
    variadic: true
  }],
  options: []
};
const args = cmdConfig.args;
const options = cmdConfig.options;

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

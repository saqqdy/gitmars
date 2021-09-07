'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const cmdConfig = {
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
const args = cmdConfig.args;
const options = cmdConfig.options;

exports.args = args;
exports['default'] = cmdConfig;
exports.options = options;

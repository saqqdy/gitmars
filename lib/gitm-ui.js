'use strict';

var commander = require('commander');
var path = require('path');
var sh = require('shelljs');
require('fs');
require('colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);

const cmdConfig = {
  command: 'ui',
  short: null,
  args: [],
  options: []
};
const args = cmdConfig.args;
const options = cmdConfig.options;

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

commander.program.name('gitm ui').usage('<name> <path>').description('链接本地包');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(opt => {
  process.chdir(path__default['default'].join(__dirname, '../server'));
  sh__default['default'].exec(`npm run server:start`);
});
commander.program.parse(process.argv);

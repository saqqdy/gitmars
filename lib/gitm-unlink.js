'use strict';

var commander = require('commander');
var sh = require('shelljs');
require('fs');
require('colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);

const cmdConfig = {
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

commander.program.name('gitm unlink').usage('[name]').description('解除本地包链接');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(name => {
  let isLink = sh__default['default'].test('-L', `./node_modules/${name}`),
      isExist = sh__default['default'].test('-e', `./node_modules/${name}_bak`),
      npmClient = sh__default['default'].which('yarn') ? 'yarn' : 'npm';

  if (!name) {
    sh__default['default'].exec(`${npmClient} unlink`, {
      silent: true
    });
    sh__default['default'].echo('处理完成');
    sh__default['default'].exit(0);
  } else if (isLink) {
    sh__default['default'].exec(`${npmClient} unlink ${name}`, {
      silent: true
    });
  } else {
    sh__default['default'].echo('没有找到软链，请确认输入正确名称');
  }

  if (isExist) {
    sh__default['default'].mv(`./node_modules/${name}_bak`, `./node_modules/${name}`);
  }

  sh__default['default'].echo('处理完成');
});
commander.program.parse(process.argv);

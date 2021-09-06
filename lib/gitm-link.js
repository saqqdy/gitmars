'use strict';

var commander = require('commander');
var sh = require('shelljs');
require('fs');
require('colors');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);

const cmdConfig = {
  command: 'link',
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

commander.program.name('gitm link').usage('[name]').description('链接本地包');
if (args.length > 0) commander.program.arguments(createArgs(args));
options.forEach(o => {
  commander.program.option(o.flags, o.description, o.defaultValue);
});
commander.program.action(name => {
  let isLink = sh__default['default'].test('-L', `./node_modules/${name}`),
      isExist = sh__default['default'].test('-e', `./node_modules/${name}`),
      npmClient = sh__default['default'].which('yarn') ? 'yarn' : 'npm';

  if (!name) {
    const {
      code
    } = sh__default['default'].exec(`${npmClient} link`, {
      silent: true
    });
    if (code === 0) sh__default['default'].echo('处理完成');else sh__default['default'].echo(`出错了`);
    sh__default['default'].exit(0);
  } else if (isLink) {
    sh__default['default'].rm('-rf', `./node_modules/${name}`);
  } else if (isExist) {
    sh__default['default'].mv(`./node_modules/${name}`, `./node_modules/${name}_bak`);
  }

  const {
    code
  } = sh__default['default'].exec(`${npmClient} link ${name}`, {
    silent: true
  });
  if (code === 0) sh__default['default'].echo('处理完成');else sh__default['default'].echo(`处理失败，${name}软链不存在，请进入本地${name}根目录执行：gitm link`);
});
commander.program.parse(process.argv);

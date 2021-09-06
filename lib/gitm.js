'use strict';

var commander = require('commander');
var sh = require('shelljs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var sh__default = /*#__PURE__*/_interopDefaultLegacy(sh);

var name = "gitmars";
var description = "一个高度定制化的git工作流工具";
var version = "2.4.0";
var scripts = {
  "docs:dev": "vuepress dev docs",
  "docs:build": "vuepress build docs",
  "docs:deploy": "GH=1 sh script/deploy-docs.sh",
  "server:start": "node server/bin/www",
  "server:watch": "nodemon server/bin/www",
  "server:super": "supervisor server/bin/www",
  lib: "sh script/lib.sh",
  "build:docs": "sh script/docs.sh",
  "build:ui": "sh script/build-ui.sh",
  build: "rimraf lib es && rollup -c",
  "build:umd": "webpack --config webpack.config.js",
  "build:types": "run-s build-temp-types roll-types",
  "build-temp-types": "tsc --emitDeclarationOnly --outDir temp/ -p src/",
  "patch-types": "node script/patchTypes",
  "roll-types": "api-extractor run && rimraf temp",
  dev: "rollup -c -w",
  dist: "run-s eslint prettier build build:umd build:types docs prettier:docs",
  docs: "rimraf docs && typedoc",
  eslint: "eslint --fix --ext .ts,.js",
  prettier: "prettier --write \"**/*.{js,ts,json,md}\"",
  "prettier:docs": "prettier --write \"**/*.md\""
};
var main = "lib/gitm.js";
var bin = {
  gitm: "lib/gitm.js"
};
var files = ["bin", "cache", "lib", "server", "typings"];
var directories = {
  bin: "bin",
  es: "es",
  lib: "lib",
  src: "src",
  cache: "cache",
  server: "server",
  typings: "typings"
};
var dependencies = {
  "ci-info": "^3.2.0",
  colors: "^1.4.0",
  commander: "8.1.0",
  "cookie-parser": "^1.4.5",
  cosmiconfig: "^7.0.0",
  debug: "^4.3.2",
  express: "^4.17.1",
  hbs: "^4.1.2",
  "http-errors": "^1.8.0",
  inquirer: "^8.1.2",
  "js-cool": "^2.1.1",
  lowdb: "^1.0.0",
  morgan: "^1.10.0",
  "node-apollo": "^1.2.1",
  "node-pty": "^0.10.1",
  ora: "6.0.0",
  os: "^0.1.2",
  shelljs: "^0.8.4",
  slash: "^3.0.0",
  "socket.io": "4.2.0",
  "text-table": "^0.2.0",
  tracer: "1.1.5",
  uuid: "^8.3.2"
};
var devDependencies = {
  "@babel/plugin-transform-runtime": "^7.15.0",
  "@babel/preset-env": "^7.15.4",
  "@babel/preset-typescript": "^7.15.0",
  "@microsoft/api-extractor": "^7.18.7",
  "@rollup/plugin-babel": "^5.3.0",
  "@rollup/plugin-commonjs": "^20.0.0",
  "@rollup/plugin-json": "^4.1.0",
  "@rollup/plugin-node-resolve": "^13.0.4",
  "@saqqdy/prettier-config": "^1.0.4",
  "@types/inquirer": "^7.3.3",
  "@types/node": "14.17.3",
  "@types/shelljs": "^0.8.9",
  "@typescript-eslint/eslint-plugin": "^4.30.0",
  "@typescript-eslint/parser": "^4.30.0",
  "@vssue/api-github-v3": "^1.4.7",
  "@vssue/vuepress-plugin-vssue": "^1.4.7",
  "@vuepress/plugin-back-to-top": "^1.8.2",
  "@vuepress/plugin-medium-zoom": "^1.8.2",
  "babel-eslint": "^10.1.0",
  esbuild: "^0.12.24",
  eslint: "^7.32.0",
  "eslint-config-prettier": "^8.3.0",
  "eslint-config-sets": "^1.5.0",
  "eslint-plugin-jsdoc": "^36.0.7",
  "eslint-plugin-tsdoc": "^0.2.14",
  less: "^4.1.1",
  "less-loader": "7.3.0",
  "npm-run-all": "^4.1.5",
  prettier: "^2.3.2",
  "progress-bar-webpack-plugin": "^2.1.0",
  rimraf: "^3.0.2",
  "rollup-plugin-terser": "^7.0.2",
  "rollup-plugin-typescript2": "^0.30.0",
  "rollup-plugin-visualizer": "^5.5.2",
  typedoc: "^0.21.9",
  "typedoc-plugin-markdown": "^3.10.4",
  typescript: "^4.4.2",
  "uglify-js": "3.14.1",
  vuepress: "^1.8.2",
  "vuepress-plugin-container": "^2.1.4",
  "vuepress-plugin-smooth-scroll": "^0.0.10",
  webpack: "^5.51.1",
  "webpack-cli": "^4.8.0",
  "webpack-merge": "^5.8.0",
  "webpack-node-externals": "^3.0.0"
};
var repository = {
  type: "git",
  url: "git+https://github.com/saqqdy/gitmars.git"
};
var keywords = ["gitmars", "git", "tool"];
var author = "saqqdy <www.saqqdy.com>";
var license = "ISC";
var bugs = {
  url: "https://github.com/saqqdy/gitmars/issues"
};
var homepage = "https://www.saqqdy.com/gitmars";
var set = {
  name: name,
  description: description,
  version: version,
  scripts: scripts,
  main: main,
  bin: bin,
  files: files,
  directories: directories,
  dependencies: dependencies,
  devDependencies: devDependencies,
  repository: repository,
  keywords: keywords,
  author: author,
  license: license,
  bugs: bugs,
  homepage: homepage
};

if (!sh__default['default'].which('git')) {
  sh__default['default'].echo('gitmars只能在git环境下执行，请先安装git');
  sh__default['default'].exit(1);
}

commander.program.version('	\n' + ' e88~~   ,e,   d8                                         \n' + 'd888      "  _d88__ 888-~88e-~88e   /~~~8e  888-~  d88~ \n' + '8888 __  888  888   888  888  888       88b 888    C888   \n' + '8888   | 888  888   888  888  888  e88~-888 888     Y88b  \n' + 'Y888   | 888  888   888  888  888 C888  888 888      888D \n' + ' "88__/  888  "88_/ 888  888  888  "88_-888 888    _88P  \n' + '                                                          \n' + `v${set.version}, powered by saqqdy\n`, '-v, --version', '查看gitmars版本');
commander.program.name('gitm').usage('[command] options').command('init', '初始化gitmars配置').command('config [options]', '查看/设置gitmars的配置项').command('combine', '分支阶段提测').alias('cb').command('start <type> <name>', '创建bugfix分支、创建/合并release分支').alias('st').command('end <type> <name>', '完成开发某项功能').alias('ed').command('update <type> <name>', '更新bug任务分支、更新feature功能开发分支').alias('up').command('branch', '列出分支列表').alias('bh').command('save', '暂存当前分支文件').alias('sv').command('get', '恢复暂存区最近一次暂存的文件').alias('gt').command('copy <id>', '简化git的cherry-pick操作').alias('cp').command('merge <name>', '合并代码').alias('mg').command('continue', '继续未完成的操作').alias('ct').command('revert', '撤销提交').alias('rt').command('upgrade', '升级gitmars').alias('ug').command('build', '构建Jenkins').alias('bd').command('ui', '启动网页版gitmars').command('unlink', '解除软链接').command('link', '软链接').command('clean', '清除缓存').command('postmsg', '推送云之家消息').command('permission', '提交权限').command('hook', 'git钩子指令').command('undo', '撤回主干分支上的提交').alias('ud').command('redo', '恢复撤回的代码重新上线').alias('rd').command('run', 'git钩子运行指令').command('log', '查询日志').command('go', '智能猜测你要执行的动作').command('admin <command>', '管理员功能，包含对发版分支bugfix、release的操作');
commander.program.on('--help', function () {
  sh__default['default'].echo('使用案例:');
  sh__default['default'].echo('  $ gitm init');
  sh__default['default'].echo('  $ gitm --help');
  sh__default['default'].echo('  $ gitm -h');
});
commander.program.on('command:*', function (types, opts) {
  let cmd = ['init', 'config', 'combine', 'cb', 'start', 'st', 'end', 'ed', 'update', 'up', 'branch', 'bh', 'save', 'sv', 'get', 'gt', 'copy', 'cp', 'merge', 'mg', 'continue', 'ct', 'revert', 'rt', 'upgrade', 'ug', 'build', 'bd', 'ui', 'unlink', 'link', 'clean', 'postmsg', 'permission', 'hook', 'undo', 'ud', 'redo', 'rd', 'run', 'log', 'go', 'admin'];

  if (!cmd.includes(types[0])) {
    let arr = [].concat(types).concat(opts);
    sh__default['default'].exec('git ' + arr.join(' '), {
      silent: false
    });
  }
});
commander.program.parse(process.argv);

#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.index-of");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.split");

require("core-js/modules/web.dom-collections.for-each");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    queue = _require.queue;

program.name('gitm branch').usage('[-k --key [keyword]] [-t --type [type]] [-d --delete [branch]] [-r --remote [remote]] [-D --forcedelete [branch]]').description('分支查询、删除（注意该指令不用于创建分支，如需创建分支请走start流程）').option('-k, --key [keyword]', '查询分支的关键词', null).option('-r, --remote', '是否查询远程分支（这个参数不用于删除分支）默认只查询本地', false).option('-t, --type [type]', '查询分支的类型，共有3种：feature、bugfix、support，不传则查询全部', null).option('-d, --delete [branch]', '删除分支', null).option('-D, --forcedelete [branch]', '强行删除分支', null).option('-u, --upstream [upstream]', '设置与远程分支关联').action(function (opt) {
  var cmd = [];

  if (opt.delete) {
    cmd.push("git branch -d ".concat(opt.delete));
  } else if (opt.forcedelete) {
    cmd.push("git branch -D ".concat(opt.forcedelete));
  } else if (opt.upstream) {
    if (typeof opt.upstream === 'string') {
      cmd.push("git branch --set-upstream-to origin/".concat(opt.upstream));
    } else {
      cmd.push("git branch --unset-upstream");
    }
  } else {
    cmd.push("git branch -a");
    queue(cmd).then(function (data) {
      data.forEach(function (el, index) {
        if (index === 0 && el.code === 0) {
          var list = el.out && el.out.split('\n') || [];
          list = list.filter(function (el) {
            var fit = true;

            if (opt.key) {
              fit = fit && el.indexOf(opt.key) > -1;
            }

            if (opt.type) {
              fit = fit && el.indexOf(opt.type) > -1;
            }

            if (opt.remote) {
              fit = fit && el.indexOf('remotes/origin') > -1;
            } else {
              fit = fit && el.indexOf('remotes/origin') === -1;
            }

            return fit;
          });
          sh.echo(list.join('\n'));
        }
      });
    });
    return;
  }

  queue(cmd);
});
program.parse(process.argv);
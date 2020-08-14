#!/usr/bin/env node
"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.join");

require("core-js/modules/es.function.name");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.match");

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.for-each");

var program = require('commander');

var sh = require('shelljs');

var _require = require('./js/index'),
    warning = _require.warning,
    queue = _require.queue,
    getStatus = _require.getStatus,
    getCurrent = _require.getCurrent;

program.name('gitm copy').usage('<from> [commitid...] [-k] [-a]').arguments('<from> [commitid...]').description('cherry-pick易用版本，从某个分支拷贝某条记录合并到当前分支').option('-k, --key [keyword]', '模糊搜索commit信息关键词', '').option('-a, --author [author]', '提交者', '').action(function (from, commitid, opts) {
  var status = getStatus(),
      cur = getCurrent();
  if (!status) sh.exit(1);

  if (opts.key !== '' || opts.author !== '') {
    var cmd = ["git checkout ".concat(from), "git log --grep=".concat(opts.key, " --author=").concat(opts.author)];
    sh.echo(warning('为确保copy准确，请尽量完整填写关键词'));
    queue(cmd).then(function (data) {
      var commits = [];

      if (data[1].code === 0) {
        var logs = data[1].out.match(/(commit\s[a-z0-9]*\n+)/g) || [],
            cmds = ["git checkout ".concat(cur)];
        logs.forEach(function (el) {
          commits.push(el.replace(/(commit\s)|\n/g, ''));
        });
        commits.reverse();

        if (commits.length > 0) {
          cmds = cmds.concat([{
            cmd: "git cherry-pick ".concat(commits.join(' ')),
            config: {
              slient: false,
              again: false,
              success: '记录合并成功',
              fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }, {
            cmd: "git push",
            config: {
              slient: false,
              again: true,
              success: '推送成功',
              fail: '推送失败，请根据提示处理'
            }
          }]);
        } else {
          sh.echo('没有找到任何记录');
        }

        queue(cmds);
      } else {
        sh.echo(data[1].err);
      }
    });
  } else {
    var _cmd = [{
      cmd: "git cherry-pick ".concat(commitid.join(' ')),
      config: {
        slient: false,
        again: false,
        success: '记录合并成功',
        fail: "\u5408\u5E76\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
      }
    }, {
      cmd: "git push",
      config: {
        slient: false,
        again: true,
        success: '推送成功',
        fail: '推送失败，请根据提示处理'
      }
    }];
    queue(_cmd);
  }
});
program.parse(process.argv);
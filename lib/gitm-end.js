#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/end");
const {
  error,
  queue,
  getStatus,
  getCurrent,
  searchBranch,
  isGitProject
} = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getConfig = require("./js/getConfig");
const getGitConfig = require("./js/getGitConfig");
const getUserToken = require("./js/api");
const { defaults } = require("./js/global");
const config = getConfig();
const { appName } = getGitConfig();
program.name("gitm end").usage("[type] [name]").description("\u5408\u5E76bugfix\u4EFB\u52A1\u5206\u652F\u3001\u5408\u5E76feature\u529F\u80FD\u5F00\u53D1\u5206\u652F\uFF0C\u5408\u5E76\u5B8C\u6210\u540E\u5C06\u5220\u9664\u5BF9\u5E94\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (type, name, opt) => {
  const allow = ["bugfix", "feature", "support"];
  const deny = [
    defaults.master,
    defaults.develop,
    defaults.release,
    defaults.bugfix,
    defaults.support
  ];
  const {
    token,
    level,
    nickname = ""
  } = config.api ? getUserToken() : {};
  const status = getStatus();
  if (!status)
    sh.exit(1);
  if (!type) {
    [type, name] = getCurrent().split("/");
    if (!name) {
      deny.includes(type) && sh.echo(error(`\u9A9A\u5E74\uFF0C\u4F60\u5728${type}\u5206\u652F\u6267\u884C\u8FD9\u4E2A\u6307\u4EE4\u662F\u4EC0\u4E48\u9A9A\u64CD\u4F5C\uFF1F`));
      sh.exit(1);
    }
  } else if (!name) {
    if (allow.includes(type)) {
      sh.echo("\u8BF7\u8F93\u5165\u5206\u652F\u540D\u79F0");
      sh.exit(1);
    }
    const branchs = await searchBranch(type);
    if (branchs.length === 1) {
      [type, name] = branchs[0].split("/");
    } else {
      sh.echo(branchs.length > 1 ? `\u67E5\u8BE2\u5230\u591A\u6761\u540D\u79F0\u5305\u542B${type}\u7684\u5206\u652F\uFF0C\u8BF7\u8F93\u5165\u5206\u652F\u7C7B\u578B` : error("\u5206\u652F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u6B63\u786E\u8F93\u5165"));
      sh.exit(1);
    }
  }
  const isRemoteBranchExist = sh.exec(`git rev-parse --verify origin/${type}/${name}`, {
    silent: true
  }).code === 0;
  if (allow.includes(type) && name) {
    const base = opt.asFeature ? config.release : type === "bugfix" ? config.bugfix : config.release;
    let cmd = [];
    if (opt.combine) {
      cmd = [
        "git fetch",
        `git checkout ${config.develop}`,
        "git pull",
        {
          cmd: `git merge --no-ff ${type}/${name}`,
          config: {
            again: false,
            success: `${type}/${name}\u5408\u5E76\u5230${config.develop}\u6210\u529F`,
            fail: `${type}/${name}\u5408\u5E76\u5230${config.develop}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
          }
        },
        {
          cmd: "git push",
          config: {
            again: true,
            success: "\u63A8\u9001\u6210\u529F",
            fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        },
        `git checkout ${type}/${name}`
      ];
    }
    if (type === "support") {
      cmd = cmd.concat(!level || level < 3 ? [
        "git fetch",
        `git checkout ${config.bugfix}`,
        "git pull",
        {
          cmd: `git merge --no-ff ${type}/${name}`,
          config: {
            again: false,
            success: `${type}/${name}\u5408\u5E76\u5230${config.bugfix}\u6210\u529F`,
            fail: `${type}/${name}\u5408\u5E76\u5230${config.bugfix}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
          }
        },
        {
          cmd: "git push",
          config: {
            again: true,
            success: "\u63A8\u9001\u6210\u529F",
            fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        },
        `git checkout ${type}/${name}`
      ] : [
        {
          cmd: `git push --set-upstream origin ${type}/${name}`,
          config: {
            again: true,
            success: "\u63A8\u9001\u8FDC\u7A0B\u5E76\u5173\u8054\u8FDC\u7A0B\u5206\u652F\u6210\u529F",
            fail: "\u63A8\u9001\u8FDC\u7A0B\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        },
        {
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${config.bugfix}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            again: true,
            success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
            fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        },
        `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${type}/${name}\u5206\u652F\u5408\u5E76\u5230${config.bugfix}\u5206\u652F\u7684merge\u8BF7\u6C42"`
      ]);
    }
    if (!opt.combine) {
      cmd = cmd.concat([
        `git checkout ${config.develop}`,
        `git branch -D ${type}/${name}`
      ]);
      if (isRemoteBranchExist) {
        cmd = cmd.concat([
          {
            cmd: `git push origin --delete ${type}/${name}`,
            config: {
              again: true,
              success: "\u6210\u529F\u5220\u9664\u8FDC\u7A0B\u5206\u652F",
              fail: "\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"
            }
          }
        ]);
      }
    } else {
      if (!level || level < 3) {
        cmd = cmd.concat([
          "git fetch",
          `git checkout ${base}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${type}/${name}`,
            config: {
              again: false,
              success: `${type}/${name}\u5408\u5E76\u5230${base}\u6210\u529F`,
              fail: `${type}/${name}\u5408\u5E76\u5230${base}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `git checkout ${config.develop}`,
          `git branch -D ${type}/${name}`
        ]);
        if (isRemoteBranchExist) {
          cmd = cmd.concat([
            {
              cmd: `git push origin --delete ${type}/${name}`,
              config: {
                again: true,
                success: "\u6210\u529F\u5220\u9664\u8FDC\u7A0B\u5206\u652F",
                fail: "\u5220\u9664\u5931\u8D25\uFF0C\u8BF7\u8054\u7CFB\u7BA1\u7406\u5458"
              }
            }
          ]);
        }
      } else {
        cmd = cmd.concat([
          {
            cmd: `git push --set-upstream origin ${type}/${name}`,
            config: {
              again: true,
              success: "\u63A8\u9001\u8FDC\u7A0B\u5E76\u5173\u8054\u8FDC\u7A0B\u5206\u652F\u6210\u529F",
              fail: "\u63A8\u9001\u8FDC\u7A0B\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${base}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${base}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${type}/${name}\u5206\u652F\u5408\u5E76\u5230${base}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ]);
      }
    }
    queue(cmd);
  } else {
    sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(allow)));
    sh.exit(1);
  }
});
program.parse(process.argv);

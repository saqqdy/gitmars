#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { red } = require("colors");
const { options, args } = require("./conf/end");
const getType = require("js-cool/lib/getType");
const { queue } = require("./core/queue");
const getIsGitProject = require("./core/git/getIsGitProject");
const getCurrentBranch = require("./core/git/getCurrentBranch");
const getGitConfig = require("./core/git/getGitConfig");
const getIsMergedTargetBranch = require("./core/git/getIsMergedTargetBranch");
const getIsBranchOrCommitExist = require("./core/git/getIsBranchOrCommitExist");
const checkGitStatus = require("./core/git/checkGitStatus");
const searchBranches = require("./core/git/searchBranches");
const { createArgs } = require("./core/utils/command");
const { isNeedUpgrade, upgradeGitmars } = require("./core/versionControl");
if (!getIsGitProject()) {
  sh.echo(red("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  process.exit(1);
}
const getConfig = require("./core/getConfig");
const getUserToken = require("./core/api/getUserToken");
const { defaults } = require("./core/global");
const config = getConfig();
const { appName } = getGitConfig();
const mergeRequestModule = require.resolve(__dirname + "/core/api/mergeRequest");
program.name("gitm end").usage("[type] [name] [--description [description]] [--as-feature] [--no-combine]").description("\u5408\u5E76bugfix\u4EFB\u52A1\u5206\u652F\u3001\u5408\u5E76feature\u529F\u80FD\u5F00\u53D1\u5206\u652F\uFF0C\u5408\u5E76\u5B8C\u6210\u540E\u5C06\u5220\u9664\u5BF9\u5E94\u5206\u652F");
if (args.length > 0)
  program.arguments(createArgs(args));
options.forEach((o) => {
  program.option(o.flags, o.description, o.defaultValue);
});
program.action(async (type, name, opt) => {
  const userInfoApi = config.apis && config.apis.userInfo || config.api;
  const needUpgrade = await isNeedUpgrade();
  needUpgrade && upgradeGitmars();
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
  } = userInfoApi ? await getUserToken() : {};
  const status = checkGitStatus();
  let _nameArr = [], isDescriptionCorrect = true;
  if (!status)
    process.exit(1);
  if (config.descriptionValidator) {
    const reg = getType(config.descriptionValidator) === "regexp" ? config.descriptionValidator : new RegExp(config.descriptionValidator);
    isDescriptionCorrect = opt.description && reg.test(opt.description);
  }
  if (!type) {
    [type, ..._nameArr] = getCurrentBranch().split("/");
    name = _nameArr.join("/");
    if (!name) {
      deny.includes(type) && sh.echo(red(`\u9A9A\u5E74\uFF0C\u4F60\u5728${type}\u5206\u652F\u6267\u884C\u8FD9\u4E2A\u6307\u4EE4\u662F\u4EC0\u4E48\u9A9A\u64CD\u4F5C\uFF1F`));
      process.exit(1);
    }
  } else if (!name) {
    if (allow.includes(type)) {
      sh.echo("\u8BF7\u8F93\u5165\u5206\u652F\u540D\u79F0");
      process.exit(1);
    }
    const branches = searchBranches({ type });
    if (branches.length === 1) {
      [type, ..._nameArr] = branches[0].split("/");
      name = _nameArr.join("/");
    } else {
      sh.echo(branches.length > 1 ? `\u67E5\u8BE2\u5230\u591A\u6761\u540D\u79F0\u5305\u542B${type}\u7684\u5206\u652F\uFF0C\u8BF7\u8F93\u5165\u5206\u652F\u7C7B\u578B` : red("\u5206\u652F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u6B63\u786E\u8F93\u5165"));
      process.exit(1);
    }
  }
  const isRemoteBranchExist = getIsBranchOrCommitExist(`${type}/${name}`, true);
  if (allow.includes(type) && name) {
    const base = opt.asFeature ? config.release : type === "bugfix" ? config.bugfix : config.release;
    let cmd = [];
    const isNeedCombineDevelop = !getIsMergedTargetBranch(`${type}/${name}`, config.develop, true);
    const isNeedCombineBase = !getIsMergedTargetBranch(`${type}/${name}`, base, true);
    const isNeedCombineBugfix = !getIsMergedTargetBranch(`${type}/${name}`, config.bugfix, true);
    if (opt.combine && isNeedCombineDevelop) {
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
    if (type === "support" && opt.combine && isNeedCombineBugfix) {
      if (!level || level < 3) {
        cmd = cmd.concat([
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
        ]);
      } else {
        if (!isDescriptionCorrect) {
          sh.echo(red("\u63D0\u4EA4\u7684\u539F\u56E0\u63CF\u8FF0\u4E0D\u7B26\u5408\u89C4\u8303"));
          process.exit(1);
        }
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
            cmd: {
              module: mergeRequestModule,
              entry: "createMergeRequest",
              options: {
                source_branch: `${type}/${name}`,
                target_branch: config.bugfix,
                token,
                description: opt.description
              }
            },
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${type}/${name}\u5206\u652F\u5408\u5E76\u5230${config.bugfix}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ]);
      }
    }
    if (!opt.combine || !isNeedCombineBase) {
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
        if (!isDescriptionCorrect) {
          sh.echo(red("\u63D0\u4EA4\u7684\u539F\u56E0\u63CF\u8FF0\u4E0D\u7B26\u5408\u89C4\u8303"));
          process.exit(1);
        }
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
            cmd: {
              module: mergeRequestModule,
              entry: "createMergeRequest",
              options: {
                source_branch: `${type}/${name}`,
                target_branch: base,
                token,
                description: opt.description
              }
            },
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
    sh.echo(red("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(allow)));
    process.exit(1);
  }
});
program.parse(process.argv);

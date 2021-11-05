#!/usr/bin/env node
'use strict';

const { program } = require("commander");
const sh = require("shelljs");
const { options, args } = require("./conf/combine");
const {
  error,
  warning,
  queue,
  getStatus,
  getCurrent,
  searchBranch,
  isGitProject
} = require("./js/index");
const getIsMergedTargetBranch = require("./js/branch/getIsMergedTargetBranch");
const getIsUpdatedInTime = require("./js/branch/getIsUpdatedInTime");
const { createArgs } = require("./js/tools");
const { defaults } = require("./js/global");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getUserToken = require("./js/api");
const getGitConfig = require("./js/getGitConfig");
const getConfig = require("./js/getConfig");
const { appName } = getGitConfig();
const config = getConfig();
program.name("gitm combine").usage("[type] [name] [-d --dev] [-p --prod] [-b --build [app]] [-a --add] [-m --commit <commit>] [--as-feature] [--no-bugfix]").description("\u5408\u5E76bugfix\u4EFB\u52A1\u5206\u652F\u3001\u5408\u5E76feature\u529F\u80FD\u5F00\u53D1\u5206\u652F\u3001\u5408\u5E76support\u5206\u652F");
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
  const status = !opt.add && opt.commit === "" ? getStatus() : true;
  let _nameArr = [];
  if (!opt.dev && !opt.prod) {
    sh.echo("\u8BF7\u8F93\u5165\u9700\u8981\u540C\u6B65\u5230\u7684\u73AF\u5883");
    sh.exit(1);
  }
  if (!status)
    sh.exit(1);
  if (opt.commit === true) {
    sh.echo(error("\u8BF7\u8F93\u5165\u8981\u63D0\u4EA4\u7684message"));
    sh.exit(1);
  }
  if (!type) {
    [type, ..._nameArr] = getCurrent().split("/");
    name = _nameArr.join("/");
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
      [type, _nameArr] = branchs[0].split("/");
      name = _nameArr.join("/");
    } else {
      sh.echo(branchs.length > 1 ? `\u67E5\u8BE2\u5230\u591A\u6761\u540D\u79F0\u5305\u542B${type}\u7684\u5206\u652F\uFF0C\u8BF7\u8F93\u5165\u5206\u652F\u7C7B\u578B` : error("\u5206\u652F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u6B63\u786E\u8F93\u5165"));
      sh.exit(1);
    }
  }
  if (allow.includes(type) && name) {
    const base = type === "bugfix" ? config.bugfix : config.release;
    let cmd = [];
    if (!getIsUpdatedInTime({ lastet: "7d", limit: 100, branch: base })) {
      sh.echo(warning("\u68C0\u6D4B\u5230\u8BE5\u5206\u652F\u5DF2\u7ECF\u8D85\u8FC71\u5468\u6CA1\u6709\u540C\u6B65\u8FC7\u4E3B\u5E72\u4EE3\u7801\u4E86\uFF0C\u8BF7\u6BCF\u5468\u81F3\u5C11\u540C\u6B65\u4E00\u6B21\uFF0C\u6267\u884C\uFF1Agitm update"));
    }
    if (opt.add) {
      cmd = cmd.concat(["git add ."]);
    }
    if (opt.commit) {
      cmd = cmd.concat([`git commit -m "${opt.commit}"`]);
    }
    if (opt.dev) {
      cmd = cmd.concat([
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
      ]);
      if (opt.build) {
        cmd = cmd.concat([
          {
            cmd: `gitm build ${appName} --env dev --app ${opt.build === true ? "all" : opt.build}`,
            config: {
              again: false,
              success: "\u8C03\u8D77\u6784\u5EFA\u6210\u529F",
              fail: "\u8C03\u8D77\u6784\u5EFA\u5931\u8D25"
            }
          }
        ]);
      }
    }
    if (opt.prod) {
      if (!opt.dev && !getIsMergedTargetBranch(`${type}/${name}`, config.develop, true)) {
        sh.echo(warning(`\u68C0\u6D4B\u5230\u4F60\u7684\u5206\u652F\u6CA1\u6709\u5408\u5E76\u8FC7${config.develop}\uFF0C\u8BF7\u5148\u5408\u5E76\u5230${config.develop}\u5206\u652F`));
        sh.exit(1);
      } else {
        if (!opt.noBugfix && !opt.asFeature) {
          cmd = cmd.concat(!level || level < 3 ? [
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
        if (type === "bugfix" && opt.asFeature) {
          cmd = cmd.concat(!level || level < 3 ? [
            "git fetch",
            `git checkout ${config.release}`,
            "git pull",
            {
              cmd: `git merge --no-ff ${type}/${name}`,
              config: {
                again: false,
                success: `${type}/${name}\u5408\u5E76\u5230${config.release}\u6210\u529F`,
                fail: `${type}/${name}\u5408\u5E76\u5230${config.release}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
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
              cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${type}/${name}\u005c",\u005c"target_branch\u005c":\u005c"${config.release}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${type}/${name}' into '${config.release}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
              config: {
                again: true,
                success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
                fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            },
            `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${type}/${name}\u5206\u652F\u5408\u5E76\u5230${config.release}\u5206\u652F\u7684merge\u8BF7\u6C42"`
          ]);
        }
        if (type === "support" && opt.noBugfix) {
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
        if (opt.build && (!level || level < 3)) {
          if (type === "bugfix") {
            cmd = cmd.concat([
              {
                cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? "all" : opt.build}`,
                config: {
                  again: false,
                  success: "\u8C03\u8D77\u6784\u5EFA\u6210\u529F",
                  fail: "\u8C03\u8D77\u6784\u5EFA\u5931\u8D25"
                }
              }
            ]);
          }
          if (type === "support" && opt.noBugfix) {
            cmd = cmd.concat([
              {
                cmd: `gitm build ${appName} --env bug --app ${opt.build === true ? "all" : opt.build}`,
                config: {
                  again: false,
                  success: "\u8C03\u8D77\u6784\u5EFA\u6210\u529F",
                  fail: "\u8C03\u8D77\u6784\u5EFA\u5931\u8D25"
                }
              }
            ]);
          }
        }
      }
    }
    queue(cmd);
  } else {
    sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + JSON.stringify(allow)));
    sh.exit(1);
  }
});
program.parse(process.argv);

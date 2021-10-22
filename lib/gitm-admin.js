#!/usr/bin/env node
'use strict';

const { Command } = require("commander");
const sh = require("shelljs");
const { create, publish, update, clean } = require("./conf/admin");
const getUserToken = require("./js/api");
const {
  error,
  success,
  queue,
  getStatus,
  checkBranch,
  getCurrent,
  isGitProject
} = require("./js/index");
const { createArgs } = require("./js/tools");
if (!isGitProject()) {
  sh.echo(error("\u5F53\u524D\u76EE\u5F55\u4E0D\u662Fgit\u9879\u76EE\u76EE\u5F55"));
  sh.exit(1);
}
const getGitConfig = require("./js/getGitConfig");
const getConfig = require("./js/getConfig");
const { appName } = getGitConfig();
const config = getConfig();
const {
  token,
  level,
  nickname = ""
} = config.api ? getUserToken() : {};
const program = new Command();
if (create.args.length > 0) {
  const _program = program.name("gitm admin").usage("<command> <type>").description("\u521B\u5EFAbugfix\u3001release\u3001develop\u548Csupport\u5206\u652F").command("create " + createArgs(create.args));
  create.options.forEach((o) => {
    _program.option(o.flags, o.description, o.defaultValue);
  });
  _program.action(async (type) => {
    const opts = ["bugfix", "release", "develop", "support"];
    const base = type === "release" ? config.master : config.release;
    const status = getStatus();
    const hasBase = await checkBranch(base);
    const exits = await checkBranch(config[type]);
    if (!status)
      sh.exit(1);
    if (!hasBase) {
      sh.echo(error(base + "\u5206\u652F\u4E0D\u5B58\u5728\uFF0C\u8BF7\u5148\u521B\u5EFA" + base + "\u5206\u652F"));
      sh.exit(1);
    }
    if (exits) {
      sh.echo(error(config[type] + "\u5206\u652F\u5DF2\u5B58\u5728\uFF0C\u4E0D\u9700\u8981\u91CD\u590D\u521B\u5EFA"));
      sh.exit(1);
    }
    if (opts.includes(type)) {
      const cmd = [
        "git fetch",
        `git checkout ${base}`,
        "git pull",
        `git checkout -b ${config[type]} ${base}`
      ];
      queue(cmd).then((data) => {
        if (data[3].code === 0) {
          sh.echo(`${config[type]}\u5206\u652F\u521B\u5EFA\u6210\u529F\uFF0C\u8BE5\u5206\u652F\u57FA\u4E8E${base}\u521B\u5EFA\uFF0C\u60A8\u5F53\u524D\u5DF2\u7ECF\u5207\u6362\u5230${config[type]}
\u9700\u8981\u53D1\u7248\u65F6\uFF0C\u8BB0\u5F97\u6267\u884C: ${success("gitm admin publish " + config[type])}`);
        }
      });
    } else {
      sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + opts.join(",")));
      sh.exit(1);
    }
  });
}
if (publish.args.length > 0) {
  const _program = program.name("gitm admin").usage("<command> <type>").description("\u53D1\u5E03bugfix\u3001release\u3001support\u5206\u652F").command("publish " + createArgs(publish.args));
  publish.options.forEach((o) => {
    _program.option(o.flags, o.description, o.defaultValue);
  });
  _program.action(async (type, opt) => {
    const opts = ["bugfix", "release", "support"];
    const status = getStatus();
    const curBranch = await getCurrent();
    if (!status)
      sh.exit(1);
    if (opts.includes(type)) {
      const cmd = !level || level < 3 ? {
        bugfix: [
          "git fetch",
          `git checkout ${config.bugfix}`,
          "git pull",
          `git checkout ${config.release}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${config.bugfix}`,
            config: {
              again: false,
              postmsg: opt.postmsg,
              success: `${config.bugfix}\u5408\u5E76\u5230${config.release}\u6210\u529F`,
              fail: `${config.bugfix}\u5408\u5E76\u5230${config.release}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }
        ],
        support: [
          "git fetch",
          `git checkout ${config.support}`,
          "git pull",
          `git checkout ${config.release}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${config.support}`,
            config: {
              again: false,
              success: `${config.support}\u5408\u5E76\u5230${config.release}\u6210\u529F`,
              fail: `${config.support}\u5408\u5E76\u5230${config.release}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
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
          `git checkout ${config.bugfix}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${config.support}`,
            config: {
              again: false,
              success: `${config.support}\u5408\u5E76\u5230${config.bugfix}\u6210\u529F`,
              fail: `${config.support}\u5408\u5E76\u5230${config.bugfix}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }
        ],
        release: [
          "git fetch",
          `git checkout ${config.release}`,
          "git pull",
          `git checkout ${config.master}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${config.release}`,
            config: {
              again: false,
              success: `${config.release}\u5408\u5E76\u5230${config.master}\u6210\u529F`,
              fail: `${config.release}\u5408\u5E76\u5230${config.master}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }
        ]
      } : {
        bugfix: [
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"target_branch\u005c":\u005c"${config.release}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.bugfix}' into '${config.release}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.bugfix}\u5206\u652F\u5408\u5E76\u5230${config.release}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ],
        support: [
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.support}\u005c",\u005c"target_branch\u005c":\u005c"${config.release}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.support}' into '${config.release}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.support}\u5206\u652F\u5408\u5E76\u5230${config.release}\u5206\u652F\u7684merge\u8BF7\u6C42"`,
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.support}\u005c",\u005c"target_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.support}' into '${config.bugfix}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.support}\u5206\u652F\u5408\u5E76\u5230${config.bugfix}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ],
        release: [
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.release}\u005c",\u005c"target_branch\u005c":\u005c"${config.master}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.release}' into '${config.master}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.release}\u5206\u652F\u5408\u5E76\u5230${config.master}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ]
      };
      if (type === "bugfix" && opt.prod) {
        cmd[type] = cmd[type].concat(!level || level < 3 ? [
          `git checkout ${config.master}`,
          "git pull",
          {
            cmd: `git merge --no-ff ${config.bugfix}`,
            config: {
              again: false,
              success: `${config.bugfix}\u5408\u5E76\u5230${config.master}\u6210\u529F`,
              fail: `${config.bugfix}\u5408\u5E76\u5230${config.master}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }
        ] : [
          {
            cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"target_branch\u005c":\u005c"${config.master}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.bugfix}' into '${config.master}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
            config: {
              again: true,
              success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
              fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          },
          `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.bugfix}\u5206\u652F\u5408\u5E76\u5230${config.master}\u5206\u652F\u7684merge\u8BF7\u6C42"`
        ]);
        if (opt.build && (!level || level < 3)) {
          cmd[type] = cmd[type].concat([
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
      if (type === "release" && opt.build && (!level || level < 3)) {
        cmd[type] = cmd[type].concat([
          {
            cmd: `gitm build ${appName} --env prod --app ${opt.build === true ? "all" : opt.build}`,
            config: {
              again: false,
              success: "\u8C03\u8D77\u6784\u5EFA\u6210\u529F",
              fail: "\u8C03\u8D77\u6784\u5EFA\u5931\u8D25"
            }
          }
        ]);
      }
      if (type === "release" && opt.combine) {
        if (opt.useRebase) {
          cmd[type] = cmd[type].concat([
            `git checkout ${config.release}`,
            "git pull",
            `git checkout ${config.bugfix}`,
            {
              cmd: `git pull origin ${config.bugfix} --rebase`,
              config: { again: true }
            },
            {
              cmd: `git rebase ${config.release}`,
              config: {
                again: false,
                postmsg: opt.postmsg,
                success: `${config.release}\u540C\u6B65\u5230${config.bugfix}\u6210\u529F`,
                fail: `${config.release}\u540C\u6B65\u5230${config.bugfix}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
              }
            },
            {
              cmd: "git push",
              config: {
                again: true,
                success: "\u63A8\u9001\u6210\u529F",
                fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            }
          ]);
        } else {
          cmd[type] = cmd[type].concat(!level || level < 3 ? [
            `git checkout ${config.release}`,
            "git pull",
            `git checkout ${config.bugfix}`,
            "git pull",
            {
              cmd: `git merge --no-ff ${config.release}`,
              config: {
                again: false,
                postmsg: opt.postmsg,
                success: `${config.release}\u5408\u5E76\u5230${config.bugfix}\u6210\u529F`,
                fail: `${config.release}\u5408\u5E76\u5230${config.bugfix}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
              }
            },
            {
              cmd: "git push",
              config: {
                again: true,
                success: "\u63A8\u9001\u6210\u529F",
                fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            }
          ] : [
            {
              cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${config.release}\u005c",\u005c"target_branch\u005c":\u005c"${config.bugfix}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${config.release}' into '${config.bugfix}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
              config: {
                again: true,
                success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
                fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
              }
            },
            `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${config.release}\u5206\u652F\u5408\u5E76\u5230${config.bugfix}\u5206\u652F\u7684merge\u8BF7\u6C42"`
          ]);
        }
      }
      let key;
      for (key in cmd) {
        cmd[key].push(`git checkout ${curBranch}`);
      }
      queue(cmd[type]);
    } else {
      sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + opts.join(",")));
      sh.exit(1);
    }
  });
}
if (update.args.length > 0) {
  const _program = program.name("gitm admin").usage("<command> <type> [-m --mode [mode]]").description("\u66F4\u65B0bugfix\u3001release\u3001support\u5206\u652F\u4EE3\u7801").command("update " + createArgs(update.args));
  update.options.forEach((o) => {
    _program.option(o.flags, o.description, o.defaultValue);
  });
  _program.action((type, opt) => {
    const opts = ["bugfix", "release", "support"];
    const base = type === "release" ? config.master : config.release;
    const status = getStatus();
    let mode = "";
    if (!status)
      sh.exit(1);
    if (opt.mode === 1) {
      mode = " --strategy-option ours";
    } else if (opt.mode === 2) {
      mode = " --strategy-option theirs";
    }
    if (opts.includes(type)) {
      let cmd = !level || level < 3 ? [
        "git fetch",
        `git checkout ${base}`,
        "git pull",
        `git checkout ${config[type]}`,
        {
          cmd: "git pull",
          config: { again: true }
        },
        {
          cmd: `git merge --no-ff ${base}${mode}`,
          config: {
            again: false,
            postmsg: opt.postmsg,
            success: `${base}\u540C\u6B65\u5230${config[type]}\u6210\u529F`,
            fail: `${base}\u540C\u6B65\u5230${config[type]}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
          }
        },
        {
          cmd: "git push",
          config: {
            again: true,
            success: "\u63A8\u9001\u6210\u529F",
            fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        }
      ] : [
        {
          cmd: `curl -i -H "Content-Type: application/json" -X POST -d "{\u005c"source_branch\u005c":\u005c"${base}\u005c",\u005c"target_branch\u005c":\u005c"${config[type]}\u005c",\u005c"private_token\u005c":\u005c"${token}\u005c",\u005c"title\u005c":\u005c"Merge branch '${base}' into '${config[type]}'\u005c"}" "${config.gitHost}/api/v4/projects/${config.gitID}/merge_requests"`,
          config: {
            again: true,
            success: "\u6210\u529F\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42",
            fail: "\u521B\u5EFA\u5408\u5E76\u8BF7\u6C42\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
          }
        },
        `gitm postmsg "${nickname}\u5728${appName}\u9879\u76EE\u63D0\u4EA4\u4E86${base}\u5206\u652F\u5408\u5E76\u5230${config[type]}\u5206\u652F\u7684merge\u8BF7\u6C42"`
      ];
      if (opt.useRebase) {
        cmd = [
          "git fetch",
          `git checkout ${base}`,
          "git pull",
          `git checkout ${config[type]}`,
          {
            cmd: `git pull origin ${config[type]} --rebase`,
            config: { again: true }
          },
          {
            cmd: `git rebase ${base}`,
            config: {
              again: false,
              postmsg: opt.postmsg,
              success: `${base}\u540C\u6B65\u5230${config[type]}\u6210\u529F`,
              fail: `${base}\u540C\u6B65\u5230${config[type]}\u51FA\u9519\u4E86\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406`
            }
          },
          {
            cmd: "git push",
            config: {
              again: true,
              success: "\u63A8\u9001\u6210\u529F",
              fail: "\u63A8\u9001\u5931\u8D25\uFF0C\u8BF7\u6839\u636E\u63D0\u793A\u5904\u7406"
            }
          }
        ];
      }
      queue(cmd);
    } else {
      sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + opts.join(",")));
      sh.exit(1);
    }
  });
}
if (clean.args.length > 0) {
  const _program = program.name("gitm admin").usage("<command> <type>").description("\u6784\u5EFA\u6E05\u7406\u5DE5\u4F5C").command("clean " + createArgs(clean.args));
  clean.options.forEach((o) => {
    _program.option(o.flags, o.description, o.defaultValue);
  });
  _program.action((type) => {
    const opts = ["bugfix", "release", "develop", "master"];
    const status = getStatus();
    if (!status)
      sh.exit(1);
    if (opts.includes(type)) {
      let cmd = [
        "git fetch",
        "git checkout . -f",
        "git clean -fd",
        `git checkout ${config.master}`,
        `git branch -D ${config[type]}`,
        "git fetch",
        `git checkout ${config[type]}`,
        "git pull"
      ];
      if (type === "master")
        cmd = [
          "git checkout .",
          "git clean -fd",
          `git checkout ${config.master}`,
          "git clean -fd",
          "git fetch",
          "git pull"
        ];
      queue(cmd);
    } else {
      sh.echo(error("type\u53EA\u5141\u8BB8\u8F93\u5165\uFF1A" + opts.join(",")));
      sh.exit(1);
    }
  });
}
program.parse(process.argv);

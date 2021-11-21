---
title: guide
---

![logo.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/logo.png)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

[npm-image]: https://img.shields.io/npm/v/gitmars.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gitmars
[travis-image]: https://travis-ci.com/saqqdy/gitmars.svg?branch=master
[travis-url]: https://travis-ci.com/saqqdy/gitmars
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/gitmars.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/gitmars?branch=master
[david-image]: https://img.shields.io/david/saqqdy/gitmars.svg?style=flat-square
[david-url]: https://david-dm.org/saqqdy/gitmars
[snyk-image]: https://snyk.io/test/npm/gitmars/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/gitmars
[download-image]: https://img.shields.io/npm/dm/gitmars.svg?style=flat-square
[download-url]: https://npmjs.org/package/gitmars
[license-image]: https://img.shields.io/badge/License-ISC-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_gitmars
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_gitmars

## 它是如何工作的

周一-周三发布小版本，只修复 bug 不涉及功能迭代，从 bug 线拉取 bugfix/xxxx 分支，开发完成后提测合并到 bug 分支。并且在每天凌晨 5 点会同步代码到 release；周四-周五发布大版本，包含新功能和 bug 修复，从 release 线拉取 feature/xxxx 分支，开发完成后合并到 release 分支。并且在每天凌晨 5 点会同步代码到 bug 线。

```
1. gitmars每一个子命令都带了help功能，可输入 gitm [command] --help 获取对应指令的帮助
2. <type>意思是type必传；[type]意思是type选填；[-a --app [app]]其中-a是--app的简写，后面[app]指的是-a后面的传值
```

# 工作流展示

## 1. 双主干分支发版模式

![gitmars-branch.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch.png)

## 2. 单主干分支发版模式

![gitmars-branch.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch2.png)

## 有哪些功能

-   初始化 gitmars 配置 [gitm init](../api/#gitm-init)
-   查看/设置 gitmars 的配置项 [gitm config](../api/#gitm-config)
-   分支阶段提测 [gitm combine](../api/#gitm-combine)
-   创建 bugfix 分支、创建/合并 release 分支 [gitm start](../api/#gitm-start)
-   完成开发某项功能 [gitm end](../api/#gitm-end)
-   更新 bug 任务分支、更新 feature 功能开发分支 [gitm update](../api/#gitm-update)
-   分支操作 [gitm branch](../api/#gitm-branch)
-   暂存当前分支文件 [gitm save](../api/#gitm-save)
-   恢复暂存区最近一次暂存的文件 [gitm get](../api/#gitm-get)
-   清理合并过的功能分支 [gitm cleanbranch](../api/#gitm-cleanbranch)
-   简化 git 的 cherry-pick 操作 [gitm copy](../api/#gitm-copy)
-   合并代码 [gitm merge](../api/#gitm-merge)
-   继续未完成的操作 [gitm continue](../api/#gitm-continue)
-   撤销提交 [gitm revert](../api/#gitm-revert)
-   撤回某次提交记录或者撤回谋条分支的合并记录 [gitm undo](../api/#gitm-undo)
-   重做某次提交记录或者重做谋条分支的合并记录 [gitm redo](../api/#gitm-redo)
-   升级 gitmars [gitm upgrade](../api/#gitm-upgrade)
-   构建 Jenkins [gitm build](../api/#gitm-build)
-   解除软链接 [gitm unlink](../api/#gitm-unlink)
-   软链接 [gitm link](../api/#gitm-link)
-   清除缓存 [gitm clean](../api/#gitm-clean)
-   推送云之家消息 [gitm postmsg](../api/#gitm-postmsg)
-   提交权限 [gitm permission](../api/#gitm-permission)
-   git 钩子指令 [gitm hook](../api/#gitm-hook)
-   git 钩子运行指令 [gitm run](../api/#gitm-run)
-   查询日志 [gitm log](../api/#gitm-log)
-   智能猜测你要执行的动作 [gitm go](../api/#gitm-go)
-   UI 可视化操作 [gitm ui](../api/#gitm-ui)
-   管理员创建主干分支 [gitm admin create](../api/#gitm-admin-create)
-   发布分支 [gitm admin publish](../api/#gitm-admin-publish)
-   更新主干分支代码 [gitm admin update](../api/#gitm-admin-update)
-   清理分支 [gitm admin clean](../api/#gitm-admin-clean)
-   查看版本号 [gitm version](../api/#gitm-version)

## 为什么不用 GitFlow

GitFlow 工作流不支持高频率发版

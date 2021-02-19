---
title: guide
---

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/gitmars.svg?style=flat-square
[npm-url]: https://npmjs.org/package/gitmars
[travis-image]: https://travis-ci.org/saqqdy/gitmars.svg?branch=master
[travis-url]: https://travis-ci.org/saqqdy/gitmars
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/gitmars.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/gitmars?branch=master
[david-image]: https://img.shields.io/david/saqqdy/gitmars.svg?style=flat-square
[david-url]: https://david-dm.org/saqqdy/gitmars
[snyk-image]: https://snyk.io/test/npm/gitmars/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/gitmars
[download-image]: https://img.shields.io/npm/dm/gitmars.svg?style=flat-square
[download-url]: https://npmjs.org/package/gitmars

## 它是如何工作的

周一-周三发布小版本，只修复 bug 不涉及功能迭代，从 bug 线拉取 bugfix/xxxx 分支，开发完成后提测合并到 bug 分支。并且在每天凌晨 5 点会同步代码到 release；周四-周五发布大版本，包含新功能和 bug 修复，从 release 线拉取 feature/xxxx 分支，开发完成后合并到 release 分支。并且在每天凌晨 5 点会同步代码到 bug 线。

```
1. gitmars每一个子命令都带了help功能，可输入 gitm [command] --help 获取对应指令的帮助
2. <type>意思是type必传；[type]意思是type选填；[-a --app [app]]其中-a是--app的简写，后面[app]指的是-a后面的传值
```

## 工作流展示

![gitmars.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/gitmars.png)

## 有哪些功能

## 为什么不用 GitFlow

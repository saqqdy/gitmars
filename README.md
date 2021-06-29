![logo.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/logo.png)

# 一个定制化的 git 工作流操作工具

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

> 1. gitmars 每一个子命令都带了 help 功能，可输入 gitm [command] --help 获取对应指令的帮助
> 2. <type>意思是 type 必传；[type]意思是 type 选填；[-a --app [app]]其中-a 是--app 的简写，后面[app]指的是-a 后面的传值

# **完整文档请查阅： [Gitmars使用文档](http://docs.saqqdy.com/gitmars/api/)**

> 更新日志请查阅：[Gitmars更新日志](https://docs.saqqdy.com/gitmars/changelog.html)

# 安装

> Windows 用户需要先安装Python

```shell
# 通过npm安装
npm install -g gitmars
# 或者通过yarn安装
yarn global add gitmars
# 不想安装Python环境且不想用gitm ui，可安装lite版本，lite版本有最新版除UI之外的所有功能
npm install -g gitmars@lite
```

# 使用

```shell
# 初始化
gitm init

# 查看配置
gitm config list [option]

# 版本升级[-m --mirror]使用淘宝镜像升级
Mac用户：gitm upgrade -m
windows用户：npm i -g gitmars@latest

# 查看版本
gitm -v

# 查看帮助信息
gitm --help
gitm copy -h
```

# 智能导航

## gitm go <Badge text="beta" type="warning"/>

智能导航指令，只记一条指令就能完成所有功能使用

-   使用：`gitm go`
-   演示：

![gitmars-go.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/gitmars-go.gif)

# UI 界面

## gitm ui <Badge text="beta" type="warning"/>

如果你厌倦了敲指令，gitmars 提供了懒人 UI 界面

-   使用：`gitm ui`
-   演示：

![gitmars-ui.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/gitmars-ui.gif)

## 安装

```shell
# 通过npm安装
npm install -g gitmars
# 或者通过yarn安装
yarn global add gitmars
```

## 使用

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

## 功能分支

```shell
# 安装
yarn global add gitmars # 或者：npm install -g gitmars

# 创建gitmars配置文件
cd my-project
# 按照提示输入想要的配置
gitm init

# 创建功能分支，自动切到新分支
gitm start feature 10000

# 合并feature/10000分支到develop分支，如果想同时合并到release分支加上-p
gitm combine -d

# 开发完成结束分支
gitm end
```

## BUG 修复分支

## 框架调整分支

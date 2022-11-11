---
layout: home
title: Gitmars
titleTemplate: 这是一个git工作流工具

hero:
  name: Gitmars
  text: 这是一个git工作流工具
  tagline: 上手简单，功能强大，性能优异。封装了大量高级技巧，让你解放双手，提升工作效率
  actions:
    - theme: brand
      text: 开始 →
      link: /guide/
    - theme: alt
      text: 去GitHub看源码
      link: https://github.com/saqqdy/gitmars

features:
  - title: 高效
    details: 执行动作之后自动切分支、自动拉代码等等
  - title: 智能
    details: 智能检测当前可执行的指令，智能导航
  - title: 安全
    details: 内建了骚操作检测方法，可主动防止不合规的操作
footer: GPL-3.0 Licensed | Copyright © 2020-present saqqdy
---

<!-- ```shell
# 安装
# 注意：Windows 用户需要先安装Python
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
``` -->

---
home: true
heroImage: null # /images/gitmars.png
heroText: Gitmars
tagline: 一个高度定制化的git工作流
actionText: 开始 →
actionLink: /guide/
features:
    - title: 高效
      details: 执行动作之后自动切分支、自动拉代码等等
    - title: 智能
      details: 智能检测当前可执行的指令，智能导航
    - title: 安全
      details: 内建了骚操作检测方法，可主动预防大量不合格的动作
footer: MIT Licensed | Copyright © 2021-present saqqdy
---

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

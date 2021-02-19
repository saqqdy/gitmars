---
home: true
heroImage: null # /images/gitmars.png
heroText: Gitmars
tagline: 一个高度定制的git工作流
actionText: 开始 →
actionLink: /guide/
features:
    - title: 高效
      details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
    - title: 智能
      details: 享受 Vue + webpack 的开发体验，在 Markdown 中使用 Vue 组件。
    - title: 容错
      details: VuePress 为每个页面预渲染生成静态的 HTML
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

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

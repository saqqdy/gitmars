---
title: 介绍
---

# 介绍

**Gitmars** 是一个高效的 Git 工作流工具，专为团队协作和高频发版场景设计。

## 为什么选择 Gitmars？

- **🚀 高效** - 执行动作后自动切分支、自动拉代码，大幅提升开发效率
- **🧠 智能** - 智能检测可执行的指令，智能导航，无需记忆复杂命令
- **🛡️ 安全** - 内建操作检测方法，主动防止不合规操作
- **📦 开箱即用** - 零配置即可使用，支持自定义配置满足团队需求
- **🔧 灵活配置** - 支持多环境配置，适配各种 Git 分支模型
- **📖 文档完善** - 详细的 API 文档和使用示例

## 快速示例

```shell
# 安装
# 注意：Windows 用户需要先安装 Python
npm install -g gitmars
# 或者
yarn global add gitmars

# 创建 gitmars 配置文件
cd my-project
gitm init

# 创建功能分支，自动切到新分支
gitm start feature 10000

# 合并 feature/10000 分支到 develop 分支
gitm combine -d

# 开发完成结束分支
gitm end
```

## 工作流模式

### 双主干分支发版模式

![双主干分支](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch.png)

周一至周三发布小版本，只修复 bug 不涉及功能迭代，从 bug 线拉取 bugfix/xxxx 分支，开发完成后提测合并到 bug 分支。周四至周五发布大版本，包含新功能和 bug 修复，从 release 线拉取 feature/xxxx 分支，开发完成后合并到 release 分支。

### 单主干分支发版模式

![单主干分支](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch2.png)

## 环境支持

| 环境 | 支持情况 |
| ---- | -------- |
| macOS | ✅ |
| Linux | ✅ |
| Windows | ✅ (需要 Python) |
| Node.js | ✅ >= 14 |

## 功能列表

| 命令 | 说明 |
| ---- | ---- |
| [gitm init](/zh/api/#gitm-init) | 初始化配置 |
| [gitm config](/zh/api/#gitm-config) | 查看/设置配置项 |
| [gitm start](/zh/api/#gitm-start) | 创建分支 |
| [gitm combine](/zh/api/#gitm-combine) | 分支阶段提测 |
| [gitm end](/zh/api/#gitm-end) | 完成开发 |
| [gitm update](/zh/api/#gitm-update) | 更新分支 |
| [gitm go](/zh/api/#gitm-go) | 智能导航 |
| [gitm copy](/zh/api/#gitm-copy) | cherry-pick 简化操作 |
| [gitm branch](/zh/api/#gitm-branch) | 分支操作 |
| [gitm undo](/zh/api/#gitm-undo) | 撤销提交 |
| [gitm redo](/zh/api/#gitm-redo) | 重做提交 |
| [gitm revert](/zh/api/#gitm-revert) | 撤销提交 |
| [gitm status](/zh/api/#gitm-status) | 查看分支状态 |
| [gitm cleanbranch](/zh/api/#gitm-cleanbranch) | 清理分支 |
| [gitm upgrade](/zh/api/#gitm-upgrade) | 升级 gitmars |

查看 [API 参考](/zh/api/) 获取完整命令列表。

## 为什么不用 GitFlow？

GitFlow 工作流不支持高频率发版，而 Gitmars 专为高频发版场景设计，支持双主干和单主干两种发版模式。

## 许可证

[GPL-3.0 License](https://github.com/saqqdy/gitmars/blob/master/LICENSE)

# gitm worktree vs git worktree 差异化设计

> 如何让 `gitm worktree` 提供原生 `git worktree` 无法提供的价值

---

## 一、原生 git worktree 的痛点

| 痛点 | 说明 |
|------|------|
| 命令繁琐 | `git worktree add ../path branch` 需要手动指定路径 |
| 无分支关联 | 创建后不会自动打开 IDE，需要手动 cd |
| 依赖重复 | 每个 worktree 都要重新安装依赖 |
| 配置孤立 | .env、.vscode 等配置需要手动同步 |
| 无状态感知 | 不知道哪些 worktree 有未提交的更改 |
| 无生命周期管理 | 分支删除后 worktree 不会自动清理 |

---

## 二、差异化设计总览

```
git worktree          gitm worktree
    │                      │
    │  通用底层能力         │  工作流增强层
    │                      │
    ▼                      ▼
• 基础命令              • 智能命名和路径管理
• 手动指定路径          • 工作流深度整合
• 无依赖管理            • 依赖共享/同步
• 无配置同步            • 配置自动同步
• 无状态展示            • 状态可视化
• 无清理机制            • 生命周期绑定
```

---

## 三、核心差异化功能

### 1. 智能命名与路径管理

**git worktree**：
```shell
# 需要手动指定完整路径
git worktree add ../project-feature-login feature/login
git worktree add ../project-bugfix-123 bugfix/123
```

**gitm worktree**：
```shell
# 自动根据分支名生成规范路径
gitm worktree create feature/login
# → 自动创建在 .gitmars/worktrees/feature-login

gitm worktree create bugfix/123
# → 自动创建在 .gitmars/worktrees/bugfix-123

# 支持自定义命名规则
gitm worktree create feature/login --name "my-feature"
# → 创建在 .gitmars/worktrees/my-feature
```

**配置化路径规则**：
```json
// .gitmarsrc
{
    "worktree": {
        "pathTemplate": ".gitmars/worktrees/{type}-{name}",
        // 支持变量: {type} {name} {branch} {user} {date}
        "pathTemplate": "~/.worktrees/{project}/{branch}"
    }
}
```

---

### 2. 工作流深度整合

**关键差异**：worktree 与 gitmars 工作流无缝对接

```shell
# ========== 创建阶段 ==========

# git worktree - 两步操作
git worktree add ../feature-login feature/login
cd ../feature-login

# gitm worktree - 一步到位
gitm start feature/login --worktree
# 效果：
# 1. 创建 feature/login 分支
# 2. 创建 worktree
# 3. 自动安装依赖
# 4. 自动打开 IDE（可选）


# ========== 开发阶段 ==========

# git worktree - 手动切换
cd ../project-feature-login
git status
git add .
git commit -m "xxx"

# gitm worktree - 智能切换
gitm worktree switch feature/login
# 效果：
# 1. 切换到对应 worktree 目录
# 2. 显示分支状态
# 3. 可选：打开新终端/IDE窗口


# ========== 合并阶段 ==========

# git worktree - 手动操作
cd ../main-project
git merge feature/login
cd ../project-feature-login
git worktree remove ../project-feature-login
git branch -d feature/login

# gitm worktree - 一键完成
gitm end feature/login
# 效果：
# 1. 合并分支到目标分支
# 2. 删除远程分支
# 3. 自动清理对应的 worktree
# 4. 返回主工作区
```

---

### 3. 依赖共享与同步

**痛点**：每个 worktree 都要 `npm install`，浪费时间和磁盘

**gitm worktree 方案**：

```shell
# 创建时自动链接 node_modules
gitm worktree create feature/login --link-modules

# 效果：
# .gitmars/worktrees/feature-login/node_modules → ../../node_modules (符号链接)

# 同步依赖到所有 worktree
gitm worktree sync --deps
# 主工作区执行 npm install 后，所有 worktree 自动同步
```

**支持的链接类型**：
```json
// .gitmarsrc
{
    "worktree": {
        "linkModules": true,
        "linkFiles": [
            "node_modules",
            ".pnpm-store",
            "dist"
        ],
        "syncFiles": [
            ".env",
            ".env.local",
            ".vscode/settings.json",
            ".idea/workspace.xml"
        ]
    }
}
```

**pnpm 项目特殊处理**：
```shell
# pnpm 项目使用 store 共享而非符号链接
gitm worktree create feature/login --pnpm
# 自动配置 .npmrc: shamefully-hoist=true
```

---

### 4. 配置自动同步

**git worktree**：每个 worktree 配置独立，需手动同步

**gitm worktree**：

```shell
# 创建时自动同步配置
gitm worktree create feature/login --sync-config
# 自动复制/链接：
# - .env → 从主工作区复制
# - .vscode/ → 符号链接
# - .idea/ → 符号链接

# 批量同步配置
gitm worktree sync --config
# 将主工作区的配置同步到所有 worktree
```

**配置文件处理策略**：

| 文件类型 | 处理方式 | 原因 |
|----------|----------|------|
| `.env` | 复制 | 可能需要不同配置 |
| `.env.local` | 复制 | 本地特有配置 |
| `.vscode/settings.json` | 符号链接 | 共享 IDE 设置 |
| `.vscode/launch.json` | 复制 | 可能需要不同调试配置 |
| `.idea/workspace.xml` | 不同步 | IDE 工作区状态 |

---

### 5. 状态可视化

**git worktree**：
```shell
git worktree list
# 输出：
# /Users/xxx/project        abc1234 [master]
# /Users/xxx/project-feat   def5678 [feature/login]
```

**gitm worktree**：
```shell
gitm worktree list

# 输出：
┌─────────────────────────────────────────────────────────────────────┐
│  Worktree 状态总览                                                    │
├──────────┬───────────────────┬─────────┬──────────┬────────────────┤
│ 分支      │ 路径               │ 状态     │ 未提交   │ 最后活跃       │
├──────────┼───────────────────┼─────────┼──────────┼────────────────┤
│ master   │ . (主工作区)        │ ✅ 干净  │ 0        │ -              │
│ feat/login│ .gt/feat-login    │ ⚠️ 有变更│ 3 files  │ 2小时前        │
│ bug/123  │ .gt/bug-123        │ ❌ 冲突  │ 5 files  │ 1天前          │
│ exp/test │ .gt/exp-test       │ 🔄 推送中│ 1 file   │ 3天前          │
└──────────┴───────────────────┴─────────┴──────────┴────────────────┘

建议操作:
  → gitm worktree switch feature/login  继续开发
  → gitm worktree prune                 清理已完成的工作区
```

**状态类型**：

| 状态 | 图标 | 含义 |
|------|------|------|
| 干净 | ✅ | 无未提交变更 |
| 有变更 | ⚠️ | 有未提交的文件 |
| 冲突 | ❌ | 存在合并冲突 |
| 推送中 | 🔄 | 有未推送的提交 |
| 落后 | ⏪ | 落后远程分支 |

---

### 6. 生命周期绑定

**核心差异**：worktree 与分支生命周期自动绑定

```shell
# 创建分支时创建 worktree
gitm start feature/login --worktree

# 分支完成后自动清理 worktree
gitm end feature/login
# → 自动删除对应的 worktree

# 清理分支时同时清理 worktree
gitm cleanbranch --with-worktree
# → 清理已合并分支 + 对应 worktree
```

**生命周期图**：

```
gitm start --worktree     gitm end / gitm cleanbranch
        │                          │
        ▼                          ▼
┌───────────────┐            ┌───────────────┐
│ 创建分支       │            │ 合并/删除分支  │
└───────┬───────┘            └───────┬───────┘
        │                            │
        ▼                            ▼
┌───────────────┐            ┌───────────────┐
│ 创建 worktree  │            │ 清理 worktree  │
└───────┬───────┘            └───────┬───────┘
        │                            │
        ▼                            ▼
┌───────────────┐            ┌───────────────┐
│ 安装依赖       │            │ 清理符号链接   │
└───────┬───────┘            └───────────────┘
        │
        ▼
┌───────────────┐
│ 打开 IDE       │
└───────────────┘
```

---

### 7. IDE 集成

**gitm worktree 独有能力**：自动打开 IDE

```shell
# 创建时自动打开 VS Code
gitm worktree create feature/login --open

# 创建时自动打开新窗口
gitm worktree create feature/login --open --new-window

# 切换时自动打开
gitm worktree switch feature/login --open

# 配置默认 IDE
gitm config set worktree.ide "code"
# 支持: code, cursor, idea, webstorm, sublime
```

**多窗口开发场景**：

```shell
# 同时开发多个功能
gitm start feature/login --worktree --open
# → 打开 VS Code 窗口 1

gitm start feature/api --worktree --open
# → 打开 VS Code 窗口 2

# 两个功能并行开发，互不干扰
```

---

### 8. 团队协作场景

**MR Review 场景**：

```shell
# 在独立 worktree 中 review 代码
gitm review 123 --worktree
# 效果：
# 1. 创建临时 worktree
# 2. 检出 MR 源分支
# 3. 打开 IDE 进行 review
# 4. review 完成后自动清理

gitm review 123 --worktree --cleanup
# review 完成后自动删除 worktree
```

**紧急修复场景**：

```shell
# 正在开发功能，突然需要紧急修复 bug
# 不需要 stash，直接在新 worktree 中处理

gitm start bugfix/urgent --worktree
# → 在独立环境中修复 bug

gitm end bugfix/urgent
# → 合并后自动清理，回到原功能开发
```

---

## 四、命令对比速查表

| 功能 | git worktree | gitm worktree |
|------|--------------|---------------|
| 创建 | `git worktree add ../path branch` | `gitm worktree create branch` |
| 列出 | `git worktree list` | `gitm worktree list` (增强状态) |
| 删除 | `git worktree remove path` | `gitm worktree prune` (自动匹配) |
| 切换 | `cd ../path` | `gitm worktree switch branch` |
| 依赖管理 | 手动安装 | `--link-modules` 自动共享 |
| 配置同步 | 手动复制 | `--sync-config` 自动同步 |
| IDE 打开 | 手动打开 | `--open` 自动打开 |
| 状态查看 | 无 | 可视化状态表 |
| 生命周期 | 独立管理 | 与分支绑定 |
| 批量操作 | 不支持 | 支持 |

---

## 五、使用场景对比

### 场景一：日常开发

```shell
# git worktree 方式
cd ~/projects/myapp
git worktree add ../myapp-feature-login feature/login
cd ../myapp-feature-login
npm install
code .
# ... 开发 ...
cd ../myapp
git worktree remove ../myapp-feature-login

# gitm worktree 方式
gitm start feature/login --worktree --open
# ... 开发 ...
gitm end feature/login
```

### 场景二：紧急修复

```shell
# git worktree 方式
git stash  # 暂存当前工作
git worktree add ../myapp-bugfix-123 bugfix/123
cd ../myapp-bugfix-123
npm install
# ... 修复 ...
git push
cd ../myapp
git worktree remove ../myapp-bugfix-123
git stash pop  # 恢复工作

# gitm worktree 方式
# 无需 stash，直接在新环境修复
gitm start bugfix/123 --worktree --open
# ... 修复 ...
gitm end bugfix/123
# 自动回到原工作区
```

### 场景三：多任务并行

```shell
# git worktree 方式
git worktree add ../myapp-feat-a feature/a
git worktree add ../myapp-feat-b feature/b
git worktree add ../myapp-feat-c feature/c
# 需要手动管理三个目录

# gitm worktree 方式
gitm start feature/a --worktree --open
gitm start feature/b --worktree --open
gitm start feature/c --worktree --open
# 状态可视化管理
gitm worktree list
```

---

## 六、实现架构

```
packages/git/src/
├── worktree/
│   ├── create.ts        # 创建 worktree
│   ├── list.ts          # 列出 worktree（增强状态）
│   ├── switch.ts        # 切换 worktree
│   ├── prune.ts         # 清理 worktree
│   ├── sync.ts          # 同步配置/依赖
│   └── utils.ts         # 工具函数

packages/gitmars/src/
├── gitm-worktree.ts     # worktree 命令入口
└── conf/
    └── worktree.ts      # 配置
```

---

## 七、总结

### 核心差异点

| 差异 | git worktree | gitm worktree |
|------|--------------|---------------|
| 定位 | 底层工具 | 工作流工具 |
| 学习成本 | 需要理解概念 | 开箱即用 |
| 路径管理 | 手动指定 | 自动规范 |
| 依赖处理 | 各自安装 | 共享链接 |
| 配置同步 | 手动复制 | 自动同步 |
| 状态感知 | 无 | 可视化 |
| 生命周期 | 独立 | 与分支绑定 |
| IDE 集成 | 无 | 自动打开 |

### 一句话总结

> **git worktree 是 git 的功能，gitm worktree 是开发者的工具**
>
> 前者提供能力，后者提供体验

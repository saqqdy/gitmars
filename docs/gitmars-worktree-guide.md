# Worktree 深度整合

Gitmars v8.0.0 引入了 git worktree 的深度整合，让您可以轻松管理多个并行开发任务。

## 什么是 Worktree？

Git worktree 允许您在同一个仓库中同时检出多个分支到不同的目录。这意味着您可以：

- 同时在多个分支上工作，无需切换分支
- 在不同目录中运行不同的构建
- 避免频繁的 stash/pop 操作

## 基本用法

### 列出所有 Worktree

```shell
gitm worktree list
# 或简写
gitm wt
```

输出示例：
```
Worktrees:
  CURRENT  PATH                              BRANCH          COMMIT  STATUS
  *        /path/to/project                  main            abc1234
           /path/to/project/.gitmars/work.. feature/login   def5678
```

### 创建 Worktree

```shell
# 创建新的 worktree（自动生成分支）
gitm worktree create feature/login

# 指定路径
gitm worktree create feature/login --path /custom/path

# 链接 node_modules（Node.js 项目推荐）
gitm worktree create feature/login --link-modules
```

### 清理无效 Worktree

```shell
# 清理已删除分支对应的 worktree
gitm worktree prune

# 预览将要清理的内容
gitm worktree prune --dry-run
```

### 删除 Worktree

```shell
# 通过分支名删除 worktree
gitm worktree remove feature/login
# 或简写
gitm wt rm feature/login

# 强制删除（如果有未提交的更改）
gitm wt rm feature/login --force
```

### 同步配置文件

将配置文件从主项目同步到所有 worktree：

```shell
# 同步配置文件（.gitmars、.eslintrc、.prettierrc、tsconfig.json 等）
gitm worktree sync

# 强制覆盖已存在的文件
gitm worktree sync --force
```

### 切换 Worktree

```shell
# 通过分支名切换 worktree
gitm worktree switch feature/login
# 或简写
gitm wt sw feature/login

# 也可以使用部分分支名（模糊匹配）
gitm wt sw login

# 使用输出结果切换到 worktree 目录
cd $(gitm wt sw feature/login)
```

**提示**：在 `.zshrc` 或 `.bashrc` 中添加以下函数，可以更方便地切换：

```shell
# 添加到 ~/.zshrc 或 ~/.bashrc
gwt() {
    local path=$(gitm worktree switch "$@")
    if [ -n "$path" ] && [ -d "$path" ]; then
        cd "$path"
    fi
}
```

然后就可以直接运行：
```shell
gwt feature/login
```

---

## Worktree 全生命周期流程

以下是 worktree 从创建到销毁的完整生命周期，每个阶段都有详细的操作说明。

### 生命周期概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Worktree 全生命周期                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   创建阶段              开发阶段              提测阶段              结束阶段   │
│   ┌──────┐            ┌──────┐            ┌──────┐            ┌──────┐    │
│   │ 创建 │ ─────────► │ 开发 │ ─────────► │ 提测 │ ─────────► │ 清理 │    │
│   └──────┘            └──────┘            └──────┘            └──────┘    │
│      │                  │                   │                   │          │
│      ▼                  ▼                   ▼                   ▼          │
│   创建分支           编码+提交            合并代码            删除分支      │
│   创建工作区         同步代码             触发构建            清理工作区    │
│   链接依赖           同步配置             验证功能                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 第一阶段：创建 Worktree

### 1.1 执行命令

**执行目录**：主项目根目录

```shell
# 推荐方式：一条命令完成所有操作
gitm start feature login --worktree --open --link-modules
```

**参数说明**：
| 参数 | 说明 |
|------|------|
| `feature` | 分支类型：feature（功能）/ bugfix（修复）/ support（支持） |
| `login` | 分支名称，会自动拼接为 `feature/login` |
| `--worktree` | 在独立工作区创建（必选） |
| `--open` | 创建后自动打开 IDE（可选） |
| `--link-modules` | 链接主项目的 node_modules（Node.js 项目推荐） |

### 1.2 执行结果

```
Creating worktree for branch: feature/login
Worktree created successfully
  Path: /path/to/project/.gitmars/worktrees/feature-login
  Branch: feature/login
```

此时会自动：
1. 从 release 分支创建 `feature/login` 分支
2. 在 `.gitmars/worktrees/feature-login/` 创建独立工作区
3. 创建指向主项目 node_modules 的符号链接
4. 打开 IDE（如果指定了 --open）

### 1.3 验证创建结果

```shell
# 查看所有 worktree
gitm worktree list

# 输出：
# Worktrees:
#   CURRENT  PATH                              BRANCH          COMMIT  STATUS
#   *        /path/to/project                  main            abc1234
#            /path/to/project/.gitmars/work.. feature/login   def5678

# 查看目录结构
ls -la .gitmars/worktrees/
# 输出：feature-login -> 独立的工作区

# 验证 node_modules 链接
ls -la .gitmars/worktrees/feature-login/node_modules
# 输出：node_modules -> ../../../node_modules (符号链接)
```

---

## 第二阶段：进入 Worktree 开发

### 2.1 切换到 Worktree 目录

**执行目录**：任意目录

```shell
# 方式一：使用快捷函数（推荐）
gwt feature/login

# 方式二：使用完整命令
cd $(gitm worktree switch feature/login)

# 方式三：使用简写
cd $(gitm wt sw login)

# 方式四：直接进入目录
cd .gitmars/worktrees/feature-login
```

### 2.2 验证当前环境

```shell
# 确认当前目录
pwd
# 输出：/path/to/project/.gitmars/worktrees/feature-login

# 确认当前分支
git branch --show-current
# 输出：feature/login

# 确认分支状态
gitm status
# 输出：当前分支: feature/login
#       基于分支: release
#       领先远程: 0 commits
#       落后远程: 0 commits
```

### 2.3 开始编码

#### 2.3.1 创建/修改文件

```shell
# 创建新文件
touch src/pages/Login.tsx

# 修改文件
vim src/pages/Login.tsx

# 查看修改的文件
git status
# 输出：
# Changes not staged for commit:
#   modified:   src/pages/Login.tsx
#   new file:   src/components/LoginForm.tsx
```

#### 2.3.2 实时查看状态

```shell
# 使用 gitm status 查看详细状态
gitm status

# 使用 git status 查看文件变更
git status

# 查看文件差异
git diff src/pages/Login.tsx

# 查看暂存区差异
git diff --staged
```

#### 2.3.3 暂存更改（可选）

如果需要临时保存工作进度：

```shell
# 暂存当前更改
gitm save

# 带自定义消息暂存
gitm save "登录功能开发中"

# 包含未跟踪的文件
gitm save --force

# 恢复暂存的更改
gitm get

# 查看暂存列表
git stash list
```

---

## 第三阶段：提交代码

### 3.1 第一次提交

**执行目录**：worktree 目录

```shell
# 步骤1：查看当前状态
git status

# 步骤2：添加所有更改的文件
git add .

# 或添加特定文件
git add src/pages/Login.tsx src/components/LoginForm.tsx

# 步骤3：提交代码
git commit -m "feat(login): 实现登录页面基础功能"

# 步骤4：推送到远程
git push -u origin feature/login
```

### 3.2 后续多次提交

开发过程中可以多次提交：

```shell
# 第二次提交：添加表单验证
git add .
git commit -m "feat(login): 添加表单验证功能"
git push

# 第三次提交：添加登录 API
git add .
git commit -m "feat(login): 集成登录 API 接口"
git push

# 第四次提交：修复 bug
git add .
git commit -m "fix(login): 修复表单验证逻辑错误"
git push
```

### 3.3 提交规范

建议使用规范的提交信息：

```
feat(scope): 新功能
fix(scope): 修复 bug
docs(scope): 文档更新
style(scope): 代码格式调整
refactor(scope): 重构
test(scope): 测试相关
chore(scope): 构建/工具相关
```

示例：
```shell
git commit -m "feat(login): 实现登录页面"
git commit -m "fix(login): 修复登录失败问题"
git commit -m "refactor(login): 重构登录逻辑"
```

### 3.4 修改最后一次提交

```shell
# 修改最后一次提交的消息
git commit --amend -m "新的提交消息"

# 追加文件到最后一次提交
git add forgotten-file.ts
git commit --amend --no-edit
```

### 3.5 撤销提交

```shell
# 撤销最后一次提交（保留更改）
git reset --soft HEAD~1

# 撤销最后一次提交（丢弃更改）
git reset --hard HEAD~1

# 使用 gitm undo 撤销
gitm undo -n 1
```

---

## 第四阶段：同步代码

在开发过程中，需要定期同步上游分支的最新代码。

### 4.1 同步 release 分支代码

**执行目录**：worktree 目录 或 主项目目录

```shell
# 方式一：在 worktree 目录执行
gitm update

# 方式二：在主项目目录指定分支
gitm update feature login

# 方式三：使用简写
gitm up feature login
```

### 4.2 处理冲突

如果同步过程中有冲突：

```shell
# 查看冲突文件
git status

# 输出：
# Unmerged paths:
#   both modified:   src/utils/api.ts

# 手动解决冲突
vim src/utils/api.ts

# 冲突标记格式：
# <<<<<<< HEAD
# 当前分支的代码
# =======
# 要合并进来的代码
# >>>>>>> release

# 解决后标记为已解决
git add src/utils/api.ts

# 继续合并
git merge --continue
# 或（如果使用 rebase）
git rebase --continue
```

### 4.3 使用 rebase 方式同步

```shell
# 使用 rebase 方式更新（保持提交历史线性）
gitm update feature login --use-rebase

# 如果 rebase 过程中有冲突
git status
# 解决冲突...
git add .
git rebase --continue

# 跳过当前提交
git rebase --skip

# 放弃 rebase
git rebase --abort
```

---

## 第五阶段：同步配置（可选）

如果主项目的配置文件有更新，需要同步到 worktree。

### 5.1 执行同步

**执行目录**：主项目根目录

```shell
# 先回到主项目
cd /path/to/project

# 同步配置到所有 worktree
gitm worktree sync
```

### 5.2 同步结果

```
Syncing config files:
  .gitmars
  .eslintrc.js
  .prettierrc
  tsconfig.json

Syncing to: /path/to/project/.gitmars/worktrees/feature-login
    .gitmars: Synced
    .eslintrc.js: Synced
    .prettierrc: Synced
    tsconfig.json: Synced

Synced to 1 worktree(s)
```

### 5.3 强制覆盖

如果 worktree 中有配置文件且需要覆盖：

```shell
gitm worktree sync --force
```

---

## 第六阶段：提测（合并到 dev）

开发完成后，先合并到 dev 分支进行测试。

### 6.1 提交所有未提交的更改

**执行目录**：worktree 目录

```shell
# 查看是否有未提交的更改
git status

# 如果有未提交的更改，先提交
git add .
git commit -m "feat(login): 完成登录功能开发"
git push
```

### 6.2 合并到 dev 分支

```shell
# 合并到 dev 分支
gitm combine -d

# 或指定分支名
gitm combine feature login -d

# 使用简写
gitm cb feature login -d
```

### 6.3 合并并触发构建

```shell
# 合并并触发 Jenkins 构建
gitm combine feature login -d -b

# 指定构建的应用
gitm combine feature login -d -b app

# 传入额外构建参数
gitm combine feature login -d -b app --data '{"env":"alpha"}'
```

### 6.4 提测命令详解

| 参数 | 说明 |
|------|------|
| `-d` / `--dev` | 合并到 dev 分支（测试环境） |
| `-b` / `--build` | 触发 Jenkins 构建 |
| `-a` / `--add` | 合并前执行 git add . |
| `-m "message"` | 合并前执行 git commit |
| `--data '{"key":"value"}'` | 传入额外构建参数 |

### 6.5 一条命令完成提测

```shell
# 有未提交更改时，一条命令完成提交和提测
gitm combine feature login -d -a -m "feat: 完成登录功能" -b
```

### 6.6 查看提测结果

```shell
# 查看合并状态
git log --oneline -5
# 输出：
# abc1234 Merge branch 'feature/login' into develop
# def5678 feat: 完成登录功能
# ...

# 验证分支已合并
git branch --merged develop | grep feature/login
# 输出：feature/login
```

---

## 第七阶段：测试验证

### 7.1 在测试环境验证

1. 访问测试环境 URL
2. 验证登录功能是否正常
3. 检查是否有回归问题

### 7.2 发现问题时的处理

如果测试发现问题：

```shell
# 回到 worktree 继续开发
gwt feature/login

# 修复问题
vim src/pages/Login.tsx

# 提交修复
git add .
git commit -m "fix(login): 修复登录验证问题"
git push

# 再次提测
gitm combine -d
```

### 7.3 多次提测

可以多次提测，每次都会更新 dev 分支：

```shell
# 第一次提测
gitm combine -d

# 发现问题，修复后第二次提测
git add .
git commit -m "fix: 修复问题"
git push
gitm combine -d -f  # 使用 -f 强制再次合并
```

---

## 第八阶段：上线（合并到 release）

测试通过后，合并到 release 分支准备上线。

### 8.1 执行上线合并

**执行目录**：任意目录

```shell
# 合并到 release 分支并触发构建
gitm combine feature login -p -d -b

# 或分步执行
gitm combine feature login -p -d   # 合并
gitm build --env prod              # 构建
```

### 8.2 上线命令详解

| 参数 | 说明 |
|------|------|
| `-p` / `--prod` | 合并到生产环境分支 |
| `-d` / `--dev` | 同时同步到 dev（保持一致） |
| `-b` / `--build` | 触发生产构建 |

### 8.3 验证上线

```shell
# 查看 release 分支最新提交
git log release --oneline -5

# 验证分支已合并
git branch --merged release | grep feature/login
```

---

## 第九阶段：结束分支并清理

上线完成后，结束分支并自动清理 worktree。

### 9.1 执行结束命令

**执行目录**：任意目录

```shell
# 结束分支（自动合并、删除、清理）
gitm end feature login

# 使用简写
gitm ed feature login
```

### 9.2 结束命令执行过程

```
1. 检查分支状态
2. 合并 feature/login 到 release
3. 推送到远程
4. 切换到 develop 分支
5. 删除本地 feature/login 分支
6. 删除远程 feature/login 分支（如果存在）
7. 清理 worktree
```

### 9.3 验证清理结果

```shell
# 查看所有 worktree
gitm worktree list

# 输出：只有主项目
# Worktrees:
#   CURRENT  PATH                BRANCH  COMMIT  STATUS
#   *        /path/to/project    main    abc1234

# 确认目录已删除
ls .gitmars/worktrees/
# 输出：（空目录或没有 feature-login）

# 确认分支已删除
git branch -a | grep login
# 输出：（无结果）
```

### 9.4 特殊情况

#### 9.4.1 分支已上线，只清理不合并

```shell
# 使用 --no-combine 跳过合并
gitm end feature login --no-combine
```

#### 9.4.2 强制删除有未提交更改的 worktree

```shell
# 先手动删除 worktree
gitm wt rm feature/login --force

# 再删除分支
git branch -D feature/login
git push origin --delete feature/login
```

---

## 完整流程图

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         Feature 分支完整开发流程                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  阶段一：创建 Worktree                                                           │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：主项目根目录                                                           │
│  命令：gitm start feature login --worktree --open --link-modules               │
│  结果：创建 feature/login 分支 + 独立工作区 + 打开 IDE                            │
│                                      ↓                                          │
│  阶段二：进入 Worktree                                                           │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：任意目录                                                              │
│  命令：gwt feature/login                                                        │
│  结果：切换到 /path/to/project/.gitmars/worktrees/feature-login                  │
│                                      ↓                                          │
│  阶段三：编码开发                                                                │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：worktree 目录                                                         │
│  命令：vim src/pages/Login.tsx                                                  │
│        git status                                                               │
│        （重复开发过程...）                                                        │
│                                      ↓                                          │
│  阶段四：提交代码                                                                │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：worktree 目录                                                         │
│  命令：git add .                                                                │
│        git commit -m "feat(login): 实现登录功能"                                 │
│        git push -u origin feature/login                                         │
│  结果：代码推送到远程 feature/login 分支                                          │
│                                      ↓                                          │
│  阶段五：同步上游（可选，定期执行）                                                 │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：worktree 目录                                                         │
│  命令：gitm update                                                              │
│  结果：同步 release 分支最新代码                                                  │
│                                      ↓                                          │
│  阶段六：提测（合并到 dev）                                                        │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：worktree 目录                                                         │
│  命令：gitm combine -d [-b]                                                     │
│  结果：feature/login 合并到 dev 分支，触发构建                                    │
│                                      ↓                                          │
│  阶段七：测试验证                                                                │
│  ────────────────────────────────────────────────────────────────────────────   │
│  访问测试环境，验证功能                                                           │
│  如有问题：返回阶段三修复                                                         │
│                                      ↓                                          │
│  阶段八：上线（合并到 release）                                                   │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：任意目录                                                              │
│  命令：gitm combine feature login -p -d -b                                      │
│  结果：feature/login 合并到 release 分支，触发生产构建                             │
│                                      ↓                                          │
│  阶段九：结束分支并清理                                                           │
│  ────────────────────────────────────────────────────────────────────────────   │
│  执行目录：任意目录                                                              │
│  命令：gitm end feature login                                                   │
│  结果：删除分支 + 清理 worktree                                                   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 命令速查表

### 按阶段分类

| 阶段 | 命令 | 执行目录 | 说明 |
|------|------|----------|------|
| **创建** | `gitm start feature login --worktree --open --link-modules` | 主项目 | 创建分支和工作区 |
| **进入** | `gwt feature/login` | 任意 | 切换到 worktree |
| **状态** | `gitm status` | worktree | 查看分支状态 |
| **开发** | `git add . && git commit -m "message"` | worktree | 提交代码 |
| **推送** | `git push [-u origin feature/login]` | worktree | 推送到远程 |
| **同步** | `gitm update` | worktree | 同步上游代码 |
| **配置** | `gitm worktree sync` | 主项目 | 同步配置文件 |
| **提测** | `gitm combine -d [-b]` | worktree | 合并到 dev |
| **上线** | `gitm combine feature login -p -d -b` | 任意 | 合并到 release |
| **结束** | `gitm end feature login` | 任意 | 结束分支并清理 |

### 常用命令简写

| 完整命令 | 简写 |
|----------|------|
| `gitm worktree list` | `gitm wt` |
| `gitm worktree switch <branch>` | `gitm wt sw <branch>` |
| `gitm worktree remove <branch>` | `gitm wt rm <branch>` |
| `gitm update feature login` | `gitm up feature login` |
| `gitm combine feature login -d` | `gitm cb feature login -d` |
| `gitm end feature login` | `gitm ed feature login` |

---

## 不同分支类型的流程差异

### Feature 分支

```shell
# 创建
gitm start feature login --worktree --open --link-modules

# 开发、提交...
git add . && git commit -m "feat: 实现功能" && git push

# 提测：合并到 dev
gitm combine -d

# 上线：合并到 release
gitm combine feature login -p -d -b

# 结束
gitm end feature login
```

### Bugfix 分支

```shell
# 创建（从 release 或 bug 分支创建）
gitm start bugfix BUG-12345 --worktree --open --link-modules

# 开发、提交...
git add . && git commit -m "fix: 修复问题" && git push

# 提测：合并到 dev
gitm combine -d

# 上线：合并到 bug 分支
gitm combine bugfix BUG-12345 -p -d -b

# 特殊情况：需要合并到 release
gitm combine bugfix BUG-12345 -p --as-feature

# 结束
gitm end bugfix BUG-12345
```

### Support 分支

```shell
# 创建
gitm start support upgrade-deps --worktree --open --link-modules

# 开发、提交...
git add . && git commit -m "feat: 升级依赖" && git push

# 提测：合并到 dev
gitm combine -d

# 上线：合并到 release 和 bug
gitm combine support upgrade-deps -p -d -b

# 特殊情况：不同步到 bug 分支
gitm combine support upgrade-deps -p --no-bugfix

# 结束
gitm end support upgrade-deps
```

---

## 并行开发示例

### 同时开发多个功能

```shell
# ========== 第一个功能：登录 ==========
# 创建
gitm start feature login --worktree --open --link-modules

# 进入开发
gwt feature/login
git add . && git commit -m "feat: 登录功能" && git push

# 提测
gitm combine -d

# ========== 第二个功能：支付（并行） ==========
# 创建（新开终端）
gitm start feature payment --worktree --open --link-modules

# 进入开发
gwt feature/payment
git add . && git commit -m "feat: 支付功能" && git push

# 提测
gitm combine -d

# ========== 切换工作 ==========
# 回到登录功能
gwt login

# 回到支付功能
gwt payment

# 回到主项目
cd /path/to/project

# ========== 结束 ==========
gitm end feature login
gitm end feature payment
```

### 紧急修复中断当前开发

```shell
# ========== 当前在 feature/login 开发中 ==========

# 暂存当前工作
gitm save "登录功能开发中"

# 创建紧急修复
cd /path/to/project
gitm start bugfix hotfix-001 --worktree --open

# 完成修复
gwt bugfix/hotfix-001
git add . && git commit -m "fix: 紧急修复" && git push
gitm combine -d
gitm end bugfix hotfix-001

# 继续原来的工作
gwt login
gitm get  # 恢复暂存的更改
```

---

## 常见问题

### Q: 如何查看当前在哪个 worktree？

```shell
# 查看当前目录
pwd

# 查看当前分支
git branch --show-current

# 查看 worktree 列表（当前会显示 *）
gitm worktree list
```

### Q: Worktree 和主项目共享 node_modules 吗？

A: 使用 `--link-modules` 参数时，worktree 会创建一个符号链接指向主项目的 `node_modules`，避免重复安装。

### Q: 可以在 worktree 中切换分支吗？

A: 可以，但建议每个 worktree 只对应一个分支，这样可以保持工作区清晰。

### Q: 如何删除一个 worktree？

```shell
# 删除 worktree（保留分支）
gitm worktree remove feature/login

# 强制删除（有未提交更改）
gitm worktree remove feature/login --force

# 结束分支时自动删除 worktree
gitm end feature login
```

### Q: Worktree 占用更多磁盘空间吗？

A: Worktree 只包含工作目录文件，Git 对象存储在主仓库中。使用 `--link-modules` 可以进一步减少磁盘占用。

### Q: 如何同步主项目配置到 worktree？

```shell
# 在主项目目录执行
gitm worktree sync

# 强制覆盖
gitm worktree sync --force
```

### Q: worktree 中的提交会影响主项目吗？

A: 不会。worktree 是独立的工作区，提交只影响当前 worktree 所在的分支。

### Q: 如何解决 worktree 同步代码时的冲突？

```shell
# 查看冲突文件
git status

# 手动解决冲突后
git add <resolved-file>

# 继续合并
git merge --continue
# 或
git rebase --continue
```

### Q: 如何临时保存工作进度？

```shell
# 暂存当前更改
gitm save "工作进度描述"

# 恢复暂存
gitm get

# 查看暂存列表
git stash list
```

---

## 配置

### 设置默认 IDE

```shell
# VS Code
export GITM_IDE=code

# WebStorm
export GITM_IDE=webstorm

# 添加到 ~/.zshrc 或 ~/.bashrc 使其永久生效
echo 'export GITM_IDE=code' >> ~/.zshrc
```

### Worktree 存储位置

默认：`.gitmars/worktrees/`

自定义位置：
```shell
gitm start feature login --worktree --path /custom/path
```

### Shell 快捷函数

添加到 `~/.zshrc` 或 `~/.bashrc`：

```shell
# 快速切换 worktree
gwt() {
    local path=$(gitm worktree switch "$@")
    if [ -n "$path" ] && [ -d "$path" ]; then
        cd "$path"
    fi
}

# 快速创建 feature worktree
gwtc() {
    gitm start feature "$1" --worktree --open --link-modules
}

# 快速创建 bugfix worktree
gwtb() {
    gitm start bugfix "$1" --worktree --open --link-modules
}

# 列出所有 worktree
gwtl() {
    gitm worktree list
}

# 清理无效 worktree
gwtp() {
    gitm worktree prune
}

# 同步配置
gwts() {
    gitm worktree sync "$@"
}
```

使用示例：
```shell
gwtc user-profile    # 创建并切换到 feature/user-profile
gwtb BUG-12345       # 创建并切换到 bugfix/BUG-12345
gwtl                 # 列出所有 worktree
gwtp                 # 清理无效 worktree
gwts --force         # 强制同步配置
gwt login            # 切换到 feature/login
```

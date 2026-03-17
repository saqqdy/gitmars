# Git 原生命令 vs Gitmars 全方位对比

> 详细对比 git 原生命令与 gitmars（含已规划功能）的差异

---

## 一、总览对比

### 1.1 定位差异

| 维度 | Git 原生 | Gitmars |
|------|----------|---------|
| **定位** | 版本控制系统 | Git 工作流增强工具 |
| **目标用户** | 所有开发者 | 团队协作开发者 |
| **设计理念** | 底层能力，灵活通用 | 最佳实践，开箱即用 |
| **学习曲线** | 陡峭，需理解底层概念 | 平缓，命令语义化 |
| **适用场景** | 所有 Git 操作 | 标准化工作流场景 |

### 1.2 能力覆盖

```
┌─────────────────────────────────────────────────────────────┐
│                        Git 能力全集                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    基础操作      │  │    高级操作      │                  │
│  │  • init         │  │  • rebase       │                  │
│  │  • clone        │  │  • bisect       │                  │
│  │  • add/commit   │  │  • worktree     │                  │
│  │  • push/pull    │  │  • filter-branch│                  │
│  │  • branch       │  │  • submodules   │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Gitmars 覆盖范围                         │   │
│  │  ┌─────────────────────────────────────────────┐    │   │
│  │  │  工作流标准化  │  团队协作  │  体验增强       │    │   │
│  │  │  • start      │  • combine │  • worktree    │    │   │
│  │  │  • end        │  • review  │  • status++    │    │   │
│  │  │  • update     │  • approve │  • doctor      │    │   │
│  │  │  • cleanbranch│  • postmsg │  • bisect++    │    │   │
│  │  └─────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、命令对照表

### 2.1 分支管理

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **创建分支** | `git checkout -b feature/login` | `gitm start feature login` | 自动从正确基础分支创建 |
| **创建 bugfix** | `git checkout -b bugfix/123 bugfix` | `gitm start bugfix 123` | 自动选择 bugfix 作为基础 |
| **从 tag 创建** | `git checkout -b bugfix/123 v1.0.0` | `gitm start bugfix 123 --tag v1.0.0` | 简化参数 |
| **切换分支** | `git checkout feature/login` | `git switch feature/login` | 相同 |
| **删除分支** | `git branch -d feature/login` | `gitm branch -d feature/login` | Gitmars 增加安全检查 |
| **删除远程分支** | `git push origin --delete feature/login` | `gitm branch -d feature/login -r` | 简化命令 |
| **列出分支** | `git branch -a` | `gitm branch` | Gitmars 支持类型过滤 |
| **清理分支** | `git branch --merged \| xargs git branch -d` | `gitm cleanbranch` | 一键清理已合并分支 |
| **分支重命名** | `git branch -m old new` | ❌ 暂不支持 | 计划添加 |

### 2.2 代码合并

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **合并到测试环境** | `git checkout develop && git merge --no-ff feature/login && git push` | `gitm combine -d` | 一键完成 |
| **合并到发布环境** | `git checkout bugfix && git merge --no-ff feature/login && git push` | `gitm combine -p` | 自动选择目标分支 |
| **带构建合并** | 多步操作 | `gitm combine -d -b app` | 合并后自动触发构建 |
| **创建 MR** | 手动在 GitLab/GitHub 创建 | `gitm combine -p` (权限≥3) | 自动创建 MR |
| **批量合并** | 脚本循环 | `gitm combine -d` (交互选择) | 支持批量处理 |
| **预览合并** | `git merge --no-commit --no-ff` | `gitm combine --dry-run` *(规划)* | 不实际执行 |
| **冲突检测** | `git merge --no-commit` 后查看 | `gitm check --combine` *(规划)* | 主动检测 |

### 2.3 代码更新

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **更新分支** | `git checkout develop && git pull && git checkout feature/login && git merge develop` | `gitm update` | 一键同步上游代码 |
| **rebase 更新** | `git fetch && git rebase origin/develop` | `gitm update --use-rebase` | 支持两种模式 |
| **批量更新** | 脚本循环 | `gitm update -a` | 更新所有开发分支 |
| **预览更新** | `git log HEAD..origin/develop` | `gitm update --preview` *(规划)* | 可视化预览 |

### 2.4 代码同步

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **cherry-pick** | `git cherry-pick abc123` | `gitm copy abc123` | 相同 |
| **批量 cherry-pick** | `git cherry-pick abc123 def456` | `gitm copy` (交互选择) | 可视化选择 |
| **从其他分支复制** | `git log --oneline branch \| 选择 \| cherry-pick` | `gitm copy` | 自动列出可选 commits |
| **按时间筛选** | `git log --since="1 week ago"` | `gitm copy --lastet 7d` | 简化时间格式 |

### 2.5 撤销回退

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **撤销提交** | `git revert abc123` | `gitm undo` | 交互选择 |
| **撤销合并** | `git revert -m 1 abc123` | `gitm undo -m 1` | 简化参数 |
| **重做提交** | `git revert def456` (revert 的 revert) | `gitm redo` | 自动识别 |
| **撤销历史** | `git reset --hard HEAD~3` | `gitm undo --last-n 3` *(规划)* | 更安全的撤销 |
| **查看撤销历史** | `git reflog` | `gitm history` *(规划)* | 可视化展示 |
| **恢复误删** | `git reflog \| 找到 \| git reset` | `gitm history restore <id>` *(规划)* | 一键恢复 |

### 2.6 暂存管理

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **暂存** | `git stash push -m "message"` | `gitm save` | 自动以分支名命名 |
| **暂存未跟踪文件** | `git stash push -u` | `gitm save -f` | 自动 add |
| **恢复暂存** | `git stash pop` | `gitm get` | 自动匹配当前分支 |
| **恢复并保留** | `git stash apply` | `gitm get -k` | 不删除暂存 |
| **查看暂存列表** | `git stash list` | `gitm get --list` *(规划)* | 可视化列表 |
| **删除指定暂存** | `git stash drop stash@{n}` | `gitm stash drop <name>` *(规划)* | 命名管理 |
| **清理过期暂存** | `git stash clear` | `gitm stash clear --older 7d` *(规划)* | 按时间清理 |

### 2.7 代码审查

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **查看 MR** | 打开 GitLab/GitHub | `gitm review 123` | 命令行查看 |
| **Review 代码** | 手动 checkout MR 分支 | `gitm review 123 --worktree` *(规划)* | 独立环境 review |
| **批准 MR** | 打开网页操作 | `gitm approve 123` | 命令行批准 |

### 2.8 状态查看

| 操作 | Git 原生 | Gitmars | 差异说明 |
|------|----------|---------|----------|
| **文件状态** | `git status` | `gitm status` | 相同信息 |
| **详细状态** | `git status -sb` | `gitm status --rich` *(规划)* | 增强显示 |
| **分支对比** | `git log HEAD..origin/HEAD` | `gitm status` *(规划)* | 自动显示领先/落后 |
| **操作建议** | 无 | `gitm suggest` | 智能建议 |
| **仓库诊断** | `git fsck && git gc --dry-run` | `gitm doctor` *(规划)* | 一键诊断 |

---

## 三、工作流对比

### 3.1 功能开发工作流

**Git 原生方式**：

```shell
# 1. 创建分支
git checkout develop
git pull
git checkout -b feature/login

# 2. 开发...
git add .
git commit -m "feat: 添加登录功能"

# 3. 同步上游
git checkout develop
git pull
git checkout feature/login
git merge develop
# 如果有冲突，解决冲突...

# 4. 合并到测试环境
git checkout develop
git merge --no-ff feature/login
git push
git checkout feature/login

# 5. 合并到发布环境
git checkout bugfix
git pull
git merge --no-ff feature/login
git push
git checkout feature/login

# 6. 清理分支
git checkout develop
git branch -d feature/login
git push origin --delete feature/login
```

**Gitmars 方式**：

```shell
# 1. 创建分支
gitm start feature login

# 2. 开发...
git add .
git commit -m "feat: 添加登录功能"

# 3. 同步上游
gitm update

# 4. 合并到测试环境
gitm combine -d

# 5. 合并到发布环境
gitm combine -p

# 6. 清理分支
gitm end
```

**对比**：

| 维度 | Git 原生 | Gitmars |
|------|----------|---------|
| 命令数量 | 15+ 条 | 6 条 |
| 出错风险 | 高（需记住正确流程） | 低（流程内置） |
| 时间消耗 | 较长 | 较短 |
| 学习成本 | 需理解分支模型 | 只需理解业务语义 |

### 3.2 紧急修复工作流

**Git 原生方式**：

```shell
# 当前正在开发功能，需要紧急修复 bug
# 1. 暂存当前工作
git stash push -m "feature login wip"

# 2. 创建修复分支
git checkout bugfix
git pull
git checkout -b bugfix/urgent-123

# 3. 修复...
git add .
git commit -m "fix: 修复紧急问题"

# 4. 合并发布
git checkout bugfix
git merge --no-ff bugfix/urgent-123
git push

# 5. 清理
git checkout develop
git branch -d bugfix/urgent-123

# 6. 恢复工作
git checkout feature/login
git stash pop
```

**Gitmars 方式（传统）**：

```shell
# 1. 暂存当前工作
gitm save

# 2. 创建修复分支
gitm start bugfix urgent-123

# 3. 修复...
git add .
git commit -m "fix: 修复紧急问题"

# 4. 合并发布
gitm combine -p

# 5. 清理
gitm end

# 6. 恢复工作
gitm get
```

**Gitmars 方式（worktree - 规划中）**：

```shell
# 无需暂存，直接在独立环境修复
gitm start bugfix urgent-123 --worktree --open
# → 自动创建独立工作区，打开新 IDE 窗口

# 修复...
git add .
git commit -m "fix: 修复紧急问题"

gitm end bugfix urgent-123
# → 自动清理 worktree，回到原工作区继续开发
```

### 3.3 多任务并行工作流

**Git 原生方式**：

```shell
# 需要在多个目录手动管理
git worktree add ../project-feature-a feature/a
git worktree add ../project-feature-b feature/b
git worktree add ../project-feature-c feature/c

# 切换任务
cd ../project-feature-a  # 或 ../project-feature-b 等

# 查看所有 worktree
git worktree list

# 清理
git worktree remove ../project-feature-a
git branch -d feature/a
```

**Gitmars 方式（规划中）**：

```shell
# 一键创建并行工作环境
gitm start feature a --worktree --open  # IDE 窗口 1
gitm start feature b --worktree --open  # IDE 窗口 2
gitm start feature c --worktree --open  # IDE 窗口 3

# 可视化状态查看
gitm worktree list
┌──────────┬───────────────────┬─────────┬──────────┐
│ 分支      │ 路径               │ 状态     │ 未提交   │
├──────────┼───────────────────┼─────────┼──────────┤
│ feature/a│ .gt/feat-a        │ ⚠️ 有变更│ 3 files  │
│ feature/b│ .gt/feat-b        │ ✅ 干净  │ 0        │
│ feature/c│ .gt/feat-c        │ ⚠️ 有变更│ 1 file   │
└──────────┴───────────────────┴─────────┴──────────┘

# 完成后一键清理
gitm end feature a  # 自动清理 worktree
gitm end feature b
gitm end feature c
```

---

## 四、高级功能对比

### 4.1 问题定位（bisect）

**Git 原生**：

```shell
git bisect start
git bisect bad              # 当前版本有问题
git bisect good v1.0.0      # 这个版本正常
# Git 会二分查找，需要手动标记每个版本
git bisect good  # 或 bad
git bisect good  # 或 bad
# ... 重复多次
git bisect reset
```

**Gitmars（规划中）**：

```shell
# 交互式向导
gitm bisect start v1.0.0
# → 自动开始二分查找，每步有清晰提示

# 自动化测试脚本
gitm bisect start v1.0.0 --run "npm test"
# → 全自动定位问题 commit
```

### 4.2 历史救援（reflog）

**Git 原生**：

```shell
git reflog
# 输出一堆 HEAD@{n} 记录
git reset --hard HEAD@{5}
```

**Gitmars（规划中）**：

```shell
gitm history
# 可视化时间线展示操作历史
┌────┬─────────────┬────────────────┬──────────────┐
│ #  │ 时间         │ 操作            │ 分支          │
├────┼─────────────┼────────────────┼──────────────┤
│ 1  │ 10:30       │ commit          │ feature/login│
│ 2  │ 10:25       │ checkout        │ feature/login│
│ 3  │ 10:20       │ merge           │ develop      │
│ 4  │ 10:15       │ reset --hard    │ feature/api  │ ⚠️
│ 5  │ 10:10       │ branch -D       │ test         │ ⚠️
└────┴─────────────┴────────────────┴──────────────┘

gitm history restore 4
# → 恢复到 reset 前的状态
```

### 4.3 仓库诊断

**Git 原生**：

```shell
# 需要多个命令组合
git fsck                    # 检查完整性
git count-objects -vH       # 查看体积
git branch -a               # 查看分支
git gc --dry-run            # 预览清理
```

**Gitmars（规划中）**：

```shell
gitm doctor
# 一键诊断，输出报告
┌─────────────────────────────────────────────────────┐
│  Gitmars 仓库健康报告                                │
├─────────────────────────────────────────────────────┤
│  ✓ 仓库完整性: 正常                                   │
│  ✓ Git 版本: 2.39.0                                  │
│  ⚠ 仓库体积: 2.3GB (建议优化)                         │
│  ⚠ 大文件: dist/ (500MB)                             │
│  ⚠ 过期分支: 15 个已合并分支未清理                     │
│  ⚠ 孤立提交: 3 个无引用提交                           │
├─────────────────────────────────────────────────────┤
│  建议操作:                                           │
│  → gitm cleanbranch 清理已合并分支                   │
│  → git gc --aggressive 优化仓库体积                  │
└─────────────────────────────────────────────────────┘

gitm doctor --fix
# → 自动修复可修复的问题
```

### 4.4 冲突解决

**Git 原生**：

```shell
git merge feature/login
# Auto-merging src/login.js
# CONFLICT (content): Merge conflict in src/login.js
# Automatic merge failed; fix conflicts and then commit the result.

# 需要手动打开文件，查看冲突
git status
# 查看哪些文件有冲突

# 手动解决冲突...
git add .
git commit
```

**Gitmars（规划中）**：

```shell
# 预先检测冲突风险
gitm check --combine
┌─────────────────────────────────────────────────────┐
│  合并检查报告                                        │
├─────────────────────────────────────────────────────┤
│  风险等级: ⚠️ 中等                                   │
│                                                     │
│  潜在冲突文件:                                       │
│  • src/login.js (双方都修改)                         │
│  • src/utils/auth.js (您修改)                       │
│                                                     │
│  建议:                                              │
│  → 先与团队成员沟通 src/login.js 的改动              │
│  → 考虑使用 --worktree 在独立环境合并                │
└─────────────────────────────────────────────────────┘

# 如果仍有冲突，可视化展示
gitm resolve
# → 列出冲突文件，提供解决建议
```

---

## 五、团队协作对比

### 5.1 权限管理

| 功能 | Git 原生 | Gitmars |
|------|----------|---------|
| 权限检查 | 无（依赖远程平台） | `gitm permission` |
| 分级权限 | 无 | 支持多级权限控制 |
| MR 自动创建 | 手动 | 自动（权限≥3） |
| 操作审计 | 无 | `gitm audit` *(规划)* |

### 5.2 消息通知

| 功能 | Git 原生 | Gitmars |
|------|----------|---------|
| 操作通知 | 无 | `gitm postmsg` |
| 集成钉钉/飞书 | 无 | 支持 |
| 合并通知 | 手动 | 自动发送 |

### 5.3 CI/CD 集成

| 功能 | Git 原生 | Gitmars |
|------|----------|---------|
| 触发构建 | 手动或 webhook | `gitm build` |
| 环境区分 | 手动 | `-e dev/prod` |
| 构建状态 | 查看平台 | 命令行查看 |

---

## 六、配置管理对比

### 6.1 分支模型配置

**Git 原生**：无配置，靠开发者记忆

**Gitmars**：

```json
// .gitmarsrc
{
    "master": "master",
    "develop": "develop",
    "release": "release",
    "bugfix": "bugfix",
    "support": "support",
    "bugfix": "bugfix"
}
```

### 6.2 命名规范

**Git 原生**：无检查

**Gitmars**：

```json
{
    "nameValidator": "^[a-z0-9-]+$",
    "descriptionValidator": "^.{10,}$"
}
```

### 6.3 用户级配置

**Git 原生**：

```shell
git config --global user.name "name"
git config --global user.email "email"
```

**Gitmars**：

```shell
gitm config set user.name "name"
gitm config set user.email "email"
gitm config set api "https://git.example.com/api"
gitm config set skip "eslint,prettier"
```

---

## 七、性能对比

| 操作 | Git 原生 | Gitmars | 说明 |
|------|----------|---------|------|
| 创建分支 | ~50ms | ~200ms | Gitmars 增加状态检查 |
| 合并分支 | ~100ms | ~300ms | Gitmars 增加安全检查 |
| 状态查看 | ~20ms | ~50ms | Gitmars 格式化输出 |
| 批量清理 | 脚本，不稳定 | ~1s | Gitmars 并行优化 |

---

## 八、学习曲线对比

### 8.1 Git 原生学习曲线

```
难度
  │
  │                                    rebase -i
  │                               bisect
  │                          filter-branch
  │                     submodules
  │                worktree
  │           cherry-pick
  │      merge conflicts
  │  branch model
  │ checkout/commit
  └──────────────────────────────────────────► 时间
```

### 8.2 Gitmars 学习曲线

```
难度
  │
  │                          worktree
  │                     combine (高级选项)
  │                update
  │           combine (基础)
  │      start/end
  │  go (智能导航)
  └──────────────────────────────────────────► 时间
```

---

## 九、适用场景分析

### 9.1 推荐使用 Gitmars 的场景

| 场景 | 原因 |
|------|------|
| 标准化团队开发 | 统一工作流，减少沟通成本 |
| 新人入职 | 学习曲线平缓，不易出错 |
| 频繁分支切换 | worktree 提升效率 |
| 紧急修复多 | 一键处理，不影响当前工作 |
| CI/CD 集成 | 内置构建触发 |
| 代码审查流程 | 命令行完成 MR 操作 |

### 9.2 推荐使用 Git 原生的场景

| 场景 | 原因 |
|------|------|
| 非标准工作流 | 灵活性更高 |
| 单人项目 | 无需工作流规范 |
| 复杂历史操作 | rebase -i 等高级功能 |
| 特殊 Git 操作 | Gitmars 未覆盖的场景 |
| 性能敏感 | 原生命令更快 |
| 脚本自动化 | 更可控 |

### 9.3 混合使用建议

```shell
# 日常开发用 Gitmars
gitm start feature login
gitm update
gitm combine -d
gitm end

# 特殊操作用 Git 原生
git rebase -i HEAD~3          # Gitmars 不支持
git filter-branch --tree-filter  # Gitmars 不支持
git bisect run test.sh        # 暂未实现
```

---

## 十、功能覆盖矩阵

### 10.1 已实现功能

| 功能 | Git 原生 | Gitmars | 备注 |
|------|:--------:|:-------:|------|
| 初始化仓库 | ✅ | ✅ `gitm init` | |
| 创建分支 | ✅ | ✅ `gitm start` | 自动选择基础 |
| 切换分支 | ✅ | ✅ | |
| 删除分支 | ✅ | ✅ `gitm branch -d` | |
| 清理分支 | ⚠️ 脚本 | ✅ `gitm cleanbranch` | 自动检测已合并 |
| 合并代码 | ✅ | ✅ `gitm combine` | 自动推送到正确分支 |
| 更新分支 | ✅ | ✅ `gitm update` | 自动从上游同步 |
| Cherry-pick | ✅ | ✅ `gitm copy` | 交互式选择 |
| 撤销提交 | ✅ | ✅ `gitm undo` | 可视化选择 |
| 重做提交 | ✅ | ✅ `gitm redo` | 自动识别 |
| 暂存代码 | ✅ | ✅ `gitm save/get` | 自动命名 |
| 查看状态 | ✅ | ✅ `gitm status` | |
| 配置管理 | ✅ | ✅ `gitm config` | |
| CI 构建 | ❌ | ✅ `gitm build` | Gitmars 特有 |
| 代码审查 | ❌ | ✅ `gitm review` | Gitmars 特有 |
| 权限管理 | ❌ | ✅ `gitm permission` | Gitmars 特有 |
| 智能建议 | ❌ | ✅ `gitm suggest` | Gitmars 特有 |

### 10.2 规划中功能

| 功能 | Git 原生 | Gitmars | 计划版本 |
|------|:--------:|:-------:|----------|
| Worktree | ✅ | 🔄 | v8.0.0 |
| 冲突预检 | ⚠️ | 🔄 | v7.8.0 |
| Bisect | ✅ | 🔄 | v8.1.0 |
| Reflog 时光机 | ✅ | 🔄 | v9.0.0 |
| 仓库诊断 | ⚠️ | 🔄 | v8.1.0 |
| AI 提交信息 | ❌ | 🔄 | v9.0.0 |
| IDE 插件 | ❌ | 🔄 | v9.0.0 |

### 10.3 不计划支持的功能

| 功能 | Git 原生 | 原因 |
|------|:--------:|------|
| `git rebase -i` | ✅ | 交互式 rebase 风险高 |
| `git filter-branch` | ✅ | 危险操作 |
| `git subtree` | ✅ | 使用场景少 |
| `git notes` | ✅ | 使用场景少 |
| `git send-email` | ✅ | 与邮件系统相关 |

---

## 十一、总结

### 11.1 Gitmars 的核心价值

```
┌─────────────────────────────────────────────────────────────┐
│                     Gitmars 核心价值                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   工作流标准化          体验增强            团队协作          │
│   ┌─────────┐         ┌─────────┐         ┌─────────┐      │
│   │ start   │         │ worktree│         │ combine │      │
│   │ end     │         │ status++│         │ review  │      │
│   │ update  │         │ doctor  │         │ approve │      │
│   │ combine │         │ bisect++│         │ postmsg │      │
│   └─────────┘         └─────────┘         └─────────┘      │
│                                                             │
│   学习成本低            操作效率高           出错风险小        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 11.2 选择建议

| 用户类型 | 建议 |
|----------|------|
| Git 新手 | Gitmars 优先，降低学习成本 |
| 团队协作 | Gitmars 优先，统一工作流 |
| 独立开发者 | 按需选择，可混合使用 |
| Git 专家 | Git 原生为主，Gitmars 辅助 |
| DevOps | Git 原生用于脚本，Gitmars 用于日常 |

### 11.3 一句话总结

> **Git 提供能力，Gitmars 提供体验**
>
> Git 是版本控制的基础设施，Gitmars 是开发效率的倍增器。
> 两者并非替代关系，而是互补关系：
> - 标准化场景用 Gitmars，提升效率
> - 特殊场景用 Git 原生，保持灵活

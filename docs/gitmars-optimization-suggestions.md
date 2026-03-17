# Gitmars 现有功能优化建议

> 基于对项目代码的深入分析，整理现有功能的优化升级方向

---

## 一、gitm start - 分支创建

### 现有功能

```shell
gitm start <type> <name> [--tag <tag>]
```

- 支持 bugfix/feature/support 三种分支类型
- 可指定从 tag 创建分支
- 自动检测分支名规范

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 无模板功能 | 支持 issue/MR 自动关联，从 issue 创建分支 | P1 |
| 无进度提示 | 添加步骤进度条（fetch → checkout → done） | P2 |
| 无远程分支检测 | 检测远程同名分支，提示是否跟踪 | P2 |
| 无项目初始化 | 新项目检测，自动初始化 gitmars 配置 | P3 |

**新增参数建议**：

```shell
gitm start feature/login --from-issue 123   # 从 issue 创建
gitm start feature/login --template admin   # 使用模板创建（预设文件结构）
gitm start feature/login --copy feature/old # 复制已有分支的文件结构
gitm start feature/login --worktree         # 在独立 worktree 中创建
```

---

## 二、gitm combine - 分支合并

### 现有功能

```shell
gitm combine [type] [name] -d/-p [-b <app>] [-m <commit>]
```

- 支持合并到 dev/prod 环境
- 支持批量处理
- 支持 MR 创建（权限控制）

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 冲突处理不友好 | 添加冲突文件可视化列表，提供解决建议 | P0 |
| 无预检功能 | 合并前自动检测冲突风险，提前预警 | P0 |
| 无回滚机制 | 合并失败自动回滚，保护工作区 | P1 |
| 无合并预览 | 添加 `--dry-run` 预览合并结果 | P2 |
| 无依赖检查 | 检测 package.json 变更，提示需安装依赖 | P2 |

**新增功能建议**：

```shell
gitm combine feature/login --dry-run      # 预览合并（不实际执行）
gitm combine feature/login --check        # 合并前检查
gitm combine feature/login --no-push      # 合并但不推送
gitm combine feature/login --squash       # squash 合并
gitm combine feature/login --rerere       # 启用冲突记忆
```

**冲突检查增强**：

```typescript
// 检测潜在冲突
interface ConflictPreview {
    files: string[]           // 冲突文件列表
    severity: 'low' | 'medium' | 'high'  // 冲突严重程度
    suggestions: string[]     // 解决建议
}
```

---

## 三、gitm update - 分支更新

### 现有功能

```shell
gitm update [type] [name] [--use-merge/--use-rebase] [-a] [-f]
```

- 支持 merge/rebase 两种更新方式
- 支持批量更新所有分支

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 无智能选择 | 根据分支状态自动推荐 merge 或 rebase | P1 |
| 无进度展示 | 批量更新时显示进度和状态 | P2 |
| 无失败恢复 | 更新失败后的恢复机制不完善 | P1 |
| 无差异预览 | 更新前预览将要合入的 commits | P2 |

**新增参数建议**：

```shell
gitm update --preview       # 预览待合入的 commits
gitm update --smart         # 智能选择 merge/rebase
gitm update --continue      # 继续上次中断的更新
gitm update --abort         # 放弃当前更新操作
```

---

## 四、gitm copy - Cherry-pick

### 现有功能

```shell
gitm copy [commitid...] [--lastet] [--limit] [-p]
```

- 交互式选择 commits
- 支持批量 cherry-pick

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 无冲突检测 | cherry-pick 前检测冲突风险 | P0 |
| 无范围选择 | 支持按时间范围、作者范围选择 | P1 |
| 无撤销功能 | cherry-pick 后的快速撤销 | P1 |
| 无依赖处理 | package.json 变更后的依赖安装提示 | P2 |

**新增功能建议**：

```shell
gitm copy --author zhangsan           # 按作者筛选
gitm copy --range commitA..commitB    # 按范围选择
gitm copy --depends                   # 自动检测依赖变更
gitm copy --abort                     # 放弃当前 cherry-pick
gitm copy --continue                  # 解决冲突后继续
```

**增强选择界面**：

```
? 请选择要复制的提交记录:
❯ ◯ 1. feat: 添加登录功能 | 张三 | 2024/01/15 10:30
  ◉ 2. fix: 修复登录bug | 李四 | 2024/01/15 09:20
  ◯ 3. docs: 更新文档 | 王五 | 2024/01/14 16:00

  [空格]选择  [a]全选  [i]反选  [enter]确认
```

---

## 五、gitm undo/redo - 撤销重做

### 现有功能

```shell
gitm undo [commitid...] [-m <mode>]
gitm redo [commitid...]
```

- 支持撤销 commit
- 支持撤销 merge
- 有缓存机制

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 无历史可视化 | 提供撤销历史可视化查看 | P1 |
| 无预览功能 | 撤销前预览影响范围 | P0 |
| 缓存管理弱 | 缓存清理和过期机制不够智能 | P2 |
| 无批量撤销 | 支持撤销多个 commit | P2 |

**新增功能建议**：

```shell
gitm undo --history             # 查看撤销历史
gitm undo --preview             # 预览撤销影响
gitm undo --last-n 3            # 撤销最近 3 个 commit
gitm undo --to <commit>         # 撤销到指定 commit
gitm undo --soft                # 软撤销（保留变更）
gitm undo --hard                # 硬撤销（丢弃变更）
```

**历史可视化**：

```
最近撤销操作:
  1. [2024/01/15] feature/login - "feat: 添加登录" → 已恢复
  2. [2024/01/14] bugfix/123 - "fix: 修复bug" → 已撤销
  3. [2024/01/13] feature/api - "feat: API开发" → 待恢复

输入数字恢复对应操作，或按 q 退出
```

---

## 六、gitm save/get - 暂存管理

### 现有功能

```shell
gitm save [message] [-f]
gitm get [message] [index] [-k]
```

- 自动以分支名作为暂存标识
- 支持查看暂存列表

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 命名不够直观 | 支持自定义命名，方便识别 | P0 |
| 无过期清理 | 暂存记录无限堆积 | P1 |
| 无内容预览 | 恢复前无法预览暂存内容 | P1 |
| 无跨分支操作 | 不能在其他分支恢复暂存 | P2 |

**新增功能建议**：

```shell
gitm save --name "wip-login"         # 命名暂存
gitm save --include "src/**"         # 只暂存指定文件
gitm save --exclude "*.log"          # 排除文件
gitm get --list                      # 查看所有暂存
gitm get --preview 0                 # 预览暂存内容
gitm get --branch feature/other 0    # 从其他分支恢复暂存
gitm stash drop <name>               # 删除指定暂存
gitm stash clear --older 7d          # 清理过期暂存
```

**暂存列表增强**：

```
暂存记录 (当前分支: feature/login):
  #   名称                    时间          文件数
  0   feature/login_cache    2小时前       5
  1   wip-oauth              1天前         12
  2   feature/login_cache    3天前         3

  [d]删除  [p]预览  [enter]恢复
```

---

## 七、gitm cleanbranch - 分支清理

### 现有功能

```shell
gitm cleanbranch [branches...] [-l] [-r] [-c] [--exclude] [--include]
```

- 检测已合并分支
- 支持批量清理
- 主干分支自动保护（master/develop/release/bugfix/support）
- 支持 `--exclude` 排除特定分支

### 现有保护机制（已实现）

```typescript
// 1. 主干分支硬编码保护
if ([config.master, config.develop, config.release, config.bugfix, config.support].includes(branch)) {
    continue  // 跳过
}

// 2. exclude 参数
gitm cleanbranch --exclude "release/*,support/*"

// 3. list 预览
gitm cleanbranch -l

// 4. 已合并检测
const isMerged = getIsMergedTarget(branch, targets, ...)
```

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 保护分支硬编码 | 添加 `--protect` 参数临时指定保护分支 | P1 |
| deadline 功能被注释 | 启用 `--deadline` 时间过滤功能 | P1 |
| exclude 不支持通配符 | 支持 glob 模式匹配 | P2 |
| 无清理报告 | 添加清理统计报告 | P2 |
| 无孤立分支检测 | 区分"未合并"和"孤立"分支 | P2 |

**新增功能建议**：

```shell
# 临时添加保护分支（不修改配置）
gitm cleanbranch --protect "release/*,feature/important"

# 启用时间过滤（已有代码，需启用）
gitm cleanbranch --deadline 30d  # 只清理 30 天前的分支

# 通配符支持
gitm cleanbranch --exclude "release/*:support/*"  # glob 模式

# 清理报告
gitm cleanbranch --report

# 孤立分支检测（无上游的分支）
gitm cleanbranch --orphan
```

**启用 deadline 功能**：

配置文件中已有注释掉的代码，建议启用：

```typescript
// conf/cleanbranch.ts - 第 102-114 行已注释
{
    flags: '--deadline [deadline]',
    description: t('Delete branch before fixed duration, fill in format: 10s/2m/2h/3d/4M/5y'),
    defaultValue: '15d'
}
```

**清理报告**：

```
清理报告 - 2024/01/15
========================
本地分支清理:
  ✓ feature/login (已合并到 develop, 15天前)
  ✓ bugfix/123 (已合并到 bugfix, 8天前)

远程分支清理:
  ✓ origin/feature/api (已合并, 20天前)

未清理分支:
  ✗ feature/new-ui (未合并到任何主干)
  ✗ support/v2 (受保护分支)

总计: 清理 3 个分支, 释放空间 2.3MB
```

---

## 八、gitm status - 状态查看

### 现有功能

```shell
gitm status
```

- 显示当前分支文件状态

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 信息过少 | 只显示文件状态，缺少分支信息 | P1 |
| 无对比功能 | 无法对比远程分支状态 | P1 |
| 无建议功能 | 不提供操作建议 | P2 |

**增强版状态显示**：

```
分支: feature/login (领先 origin 3 个提交, 落后 1 个提交)
基础分支: develop (最后同步: 2天前)

文件状态:
  新增    修改    删除    未跟踪
  ────   ────   ────   ────
  2      5      1      3

最近提交:
  abc1234 feat: 添加登录页面 (张三, 2小时前)
  def5678 fix: 修复样式问题 (李四, 5小时前)

建议操作:
  → gitm update (同步 develop 最新代码)
  → gitm combine -d (合并到测试环境)
```

---

## 九、gitm branch - 分支管理

### 现有功能

```shell
gitm branch [-k] [-t] [-d] [-D] [-u]
```

- 分支查询、删除
- 设置上游分支

### 优化建议

| 问题 | 建议 | 优先级 |
|------|------|--------|
| 无状态显示 | 不显示分支状态（是否合并） | P0 |
| 无排序功能 | 分支列表无排序选项 | P2 |
| 无详情查看 | 无法查看分支详细信息 | P1 |

**增强功能建议**：

```shell
gitm branch --status              # 显示分支状态（已合并/未合并）
gitm branch --sort date           # 按日期排序
gitm branch --sort name           # 按名称排序
gitm branch --info feature/login  # 查看分支详情
gitm branch --graph               # 图形化展示
gitm branch --compare feature/a feature/b  # 对比两个分支
```

**分支详情**：

```
分支详情: feature/login
========================
创建时间: 2024/01/10
创建者: 张三
基础分支: develop
最后提交: abc1234 (2小时前)
提交数量: 15
文件变更: 23 files changed, 1200 insertions(+), 300 deletions(-)

合并状态:
  ✓ develop (已合并)
  ✗ release (未合并)

关联信息:
  Issue: #123
  MR: !456
```

---

## 十、核心 queue 模块优化

### 现有问题

1. **错误处理不够精细**：只能整体中断，无法选择跳过某步
2. **无并发执行**：所有命令串行执行，效率不高
3. **无进度展示**：批量操作时不知道进度

### 优化建议

```typescript
// 1. 支持并发执行
queue([
    { cmd: 'git fetch', parallel: true },
    { cmd: 'npm install', parallel: true },
    { cmd: 'git status', parallel: false }  // 等待前面完成
])

// 2. 支持错误策略
queue([...], {
    onError: 'skip' | 'stop' | 'ask',  // 错误时跳过/停止/询问
    retry: 2,                           // 重试次数
    retryDelay: 1000                    // 重试间隔
})

// 3. 进度回调
queue([...], {
    onProgress: (current, total, cmd) => {
        console.log(`[${current}/${total}] 执行: ${cmd}`)
    }
})

// 4. 干燥运行
queue([...], { dryRun: true })  // 只打印不执行
```

---

## 十一、通用优化建议

### 1. 国际化增强

现有国际化支持中英文，建议：

- 添加更多语言（日语、韩语）
- 支持自定义翻译文件
- 动态加载语言包

### 2. 日志系统

```typescript
// 统一日志格式
interface LogEntry {
    timestamp: Date
    level: 'debug' | 'info' | 'warn' | 'error'
    command: string
    duration: number
    status: 'success' | 'failed'
    output?: string
}

// 日志查看
gitm log --today
gitm log --command "combine"
gitm log --failed
```

### 3. 配置热重载

```shell
gitm config reload    # 重新加载配置
gitm config validate  # 验证配置正确性
gitm config migrate   # 配置版本迁移
```

### 4. 性能优化

- 分支检测使用缓存，减少 git 命令调用
- 批量操作并行执行
- 大仓库懒加载分支列表

### 5. 安全增强

```shell
gitm permission check          # 检查权限
gitm permission request admin  # 申请权限
gitm audit                     # 审计最近操作
```

---

## 优化优先级总览

| 优先级 | 模块 | 优化项 |
|--------|------|--------|
| P0 | combine | 冲突检测与可视化 |
| P0 | cleanbranch | 过期时间与保护机制 |
| P0 | copy | 冲突检测 |
| P0 | undo | 预览功能 |
| P1 | start | Issue 关联 |
| P1 | save/get | 命名暂存 |
| P1 | update | 智能选择 merge/rebase |
| P1 | branch | 状态显示 |
| P1 | status | 增强信息展示 |
| P2 | combine | 合并预览 |
| P2 | copy | 范围选择 |
| P2 | cleanbranch | 统计报告 |

---

## 总结

gitmars 已有完善的工作流体系，主要优化方向：

1. **智能化**：自动检测、智能推荐、风险预警
2. **可视化**：进度展示、状态图表、交互增强
3. **安全性**：操作确认、预览功能、回滚机制
4. **易用性**：命令简化、提示增强、错误恢复

这些优化可以让 gitmars 从"能用"升级到"好用"，提升团队开发效率。

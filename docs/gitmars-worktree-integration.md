# Gitmars + Worktree 整合方案

> 基于 gitmars 现有的工作流体系（双主干/单主干分支发版模式），为用户提供差异化的 git worktree 体验。

## 背景

Git worktree 允许用户在同一仓库下创建多个工作目录，每个目录可以检出不同的分支。这项功能正在被越来越多的开发者关注和使用。

## 现状分析

### Gitmars 核心功能

- `gitm start` - 创建 bugfix/feature/support 分支
- `gitm combine` - 分支合并提测
- `gitm end` - 完成开发
- `gitm update` - 更新分支
- `gitm branch` - 分支管理
- `gitm cleanbranch` - 清理分支

### 用户痛点

1. 频繁切换分支开发，每次都要 stash
2. 切换分支后需要重新安装依赖
3. IDE 需要重新索引，等待时间长
4. 多任务并行开发时上下文切换成本高
5. 合并操作可能影响主工作区

---

## 整合方案

### 方向一：并行开发工作空间

**痛点**：频繁切换分支开发，每次都要 stash、重新安装依赖、等待 IDE 重新索引

**方案**：在现有命令中增加 `--worktree` 选项

```shell
# 创建分支时自动创建 worktree
gitm start feature/login --worktree

# 效果：
# 1. 创建 feature/login 分支
# 2. 在 .gitmars/worktrees/feature-login 目录创建 worktree
# 3. 自动在新目录安装依赖（可选）
# 4. 输出提示：cd .gitmars/worktrees/feature-login 开始开发
```

**差异化优势**：

- 遵循 gitmars 分支命名规范
- 自动管理 worktree 目录结构
- 结合 `gitm end` 自动清理 worktree

---

### 方向二：独立 worktree 管理命令

新增 `gitm worktree` 命令族：

```shell
gitm worktree list          # 列出所有 worktree（带分支状态信息）
gitm worktree create <分支>  # 为已有分支创建 worktree
gitm worktree switch <分支>  # 智能切换（打开新终端/IDE）
gitm worktree prune         # 清理已删除分支的 worktree
gitm worktree sync          # 同步依赖/配置到所有 worktree
```

**差异化功能**：

- `list` 显示：分支名、当前状态（开发中/待合并/已合并）、最后活跃时间
- `switch` 可配置自动打开 VS Code 窗口

---

### 方向三：团队协作场景

结合 gitmars 的 MR/Review 功能：

```shell
# 在独立 worktree 中 review 代码
gitm review <MR_ID> --worktree

# 效果：
# 1. 创建临时 worktree
# 2. 检出 MR 源分支
# 3. Review 完成后自动清理
```

**场景**：管理员可以同时在多个 worktree 中处理不同 MR，互不影响

---

### 方向四：智能环境隔离

利用 worktree 实现环境隔离：

```shell
# 创建提测环境的 worktree
gitm combine feature/login --dev --worktree

# 效果：
# 1. 在独立 worktree 中进行合并操作
# 2. 主工作区不受影响
# 3. 合并完成后自动清理
```

**解决痛点**：合并操作可能导致冲突，worktree 可以保护主工作区

---

### 方向五：开发环境同步

```shell
# 配置同步
gitm worktree sync --config

# 依赖同步（共享 node_modules）
gitm worktree sync --deps

# IDE 配置同步
gitm worktree sync --ide
```

**差异化优势**：

- 通过符号链接共享 `node_modules`（节省磁盘空间）
- 同步 `.vscode`、`.idea` 配置
- 同步 `.env` 等本地配置文件

---

## 实现优先级

| 优先级 | 功能 | 命令 | 理由 |
|--------|------|------|------|
| P0 | 创建分支时支持 worktree | `gitm start --worktree` | 最常用场景，开发体验提升最明显 |
| P1 | 列出所有 worktree | `gitm worktree list` | 可视化管理，用户感知最强 |
| P2 | 清理无效 worktree | `gitm worktree prune` | 配合 `gitm cleanbranch` 自动清理 |
| P3 | 同步配置/依赖 | `gitm worktree sync` | 解决 worktree 重复配置问题 |
| P4 | Review 支持 worktree | `gitm review --worktree` | 团队协作场景增强 |

---

## 技术实现建议

### 新增文件结构

```
packages/git/src/
├── getWorktreeList.ts      # 获取 worktree 列表
├── createWorktree.ts       # 创建 worktree
├── removeWorktree.ts       # 移除 worktree
└── syncWorktree.ts         # 同步 worktree 配置

packages/gitmars/src/
├── gitm-worktree.ts        # worktree 主命令
└── conf/
    └── worktree.ts         # worktree 命令配置
```

### 核心 API 设计

```typescript
// packages/git/src/getWorktreeList.ts
interface WorktreeInfo {
    path: string           // worktree 路径
    branch: string         // 分支名
    head: string           // HEAD commit
    isMain: boolean        // 是否主工作区
    status?: BranchStatus  // 分支状态（开发中/待合并/已合并）
    lastActive?: Date      // 最后活跃时间
}

export function getWorktreeList(): WorktreeInfo[] {
    // 解析 git worktree list 输出
    const output = sh.exec('git worktree list --porcelain').stdout
    // ... 解析逻辑
}

// packages/git/src/createWorktree.ts
interface CreateWorktreeOptions {
    branch: string         // 分支名
    path?: string          // 自定义路径
    fetch?: boolean        // 是否先 fetch
    installDeps?: boolean  // 是否安装依赖
    linkModules?: boolean  // 是否链接 node_modules
}

export async function createWorktree(options: CreateWorktreeOptions): Promise<string> {
    // 创建 worktree 并返回路径
}
```

### 命令配置示例

```typescript
// packages/gitmars/src/conf/worktree.ts
export default {
    args: [
        {
            name: 'action',
            description: '操作类型',
            required: true,
            options: ['list', 'create', 'switch', 'prune', 'sync']
        },
        {
            name: 'branch',
            description: '分支名',
            required: false
        }
    ],
    options: [
        {
            flags: '-p, --path <path>',
            description: '指定 worktree 路径'
        },
        {
            flags: '-i, --install',
            description: '自动安装依赖',
            defaultValue: false
        },
        {
            flags: '-l, --link',
            description: '链接 node_modules',
            defaultValue: true
        },
        {
            flags: '--open',
            description: '自动打开 IDE',
            defaultValue: false
        }
    ]
}
```

---

## 目录结构规范

建议 worktree 存放路径：

```
项目根目录/
├── .git/
├── .gitmars/
│   └── worktrees/
│       ├── feature-login/
│       ├── bugfix-123/
│       └── support-v2/
├── src/
└── ...
```

或者使用用户级目录：

```
~/.gitmars/worktrees/
├── project-a_feature-login/
├── project-a_bugfix-123/
└── project-b_feature-api/
```

---

## 配置项扩展

在 `.gitmarsrc` 中新增配置：

```json
{
    "worktree": {
        "enabled": true,
        "autoInstall": true,
        "linkModules": true,
        "defaultPath": ".gitmars/worktrees",
        "ide": "code",
        "syncFiles": [".env", ".env.local", ".vscode/settings.json"]
    }
}
```

---

## 总结

通过整合 git worktree，gitmars 可以提供：

1. **无缝的开发体验**：一条命令创建独立开发环境
2. **智能的分支管理**：worktree 与分支生命周期绑定
3. **高效的环境同步**：共享依赖和配置，减少重复工作
4. **安全的操作隔离**：合并、review 等操作不影响主工作区

这将是 gitmars 区别于其他 git 工具的重要特性。

# Gitmars Shell 集成方案设计

本文档描述 Gitmars Shell 集成的完整设计方案，实现用户无感知的自动化体验。

---

## 一、核心问题

**子进程无法改变父进程的工作目录**，因此 `gitm wt create xxx` 后无法自动 cd 到新目录。需要通过 Shell 函数包装器解决。

---

## 二、命令重新设计

### 2.1 原命令保持不变

| 命令 | 功能 | 状态 |
|------|------|------|
| `gitm init` | 初始化项目配置（.gitmarsrc） | 保持不变 |
| `gitm go` | 智能导航，交互式选择命令执行 | 保持不变 |
| `gitm worktree` / `gitm wt` | Worktree 管理 | 保持不变 |

### 2.2 新增命令

| 命令 | 功能 |
|------|------|
| `gitm shell` | Shell 集成管理 |
| `gitm worktree cd <branch>` | 快速跳转到 worktree 目录 |

---

## 三、`gitm shell` 命令设计

### 3.1 子命令

```bash
gitm shell                    # 输出 shell 函数定义
gitm shell --install          # 自动写入 .zshrc/.bashrc/$PROFILE
gitm shell --uninstall        # 移除 shell 集成
gitm shell --check            # 检查是否已安装
gitm shell --show             # 显示函数内容
gitm shell --upgrade          # 升级函数定义（版本更新后）
```

### 3.2 选项

| 选项 | 说明 |
|------|------|
| `--install` | 自动写入 shell 配置文件 |
| `--uninstall` | 从 shell 配置文件中移除 |
| `--check` | 检查安装状态，输出 JSON |
| `--show` | 显示当前函数定义 |
| `--upgrade` | 更新函数定义到最新版本 |
| `--no-cd` | 禁用自动 cd 功能 |
| `--shell <shell>` | 指定 shell 类型：bash、zsh、powershell |
| `--dry-run` | 预览将要执行的操作，不实际修改 |

### 3.3 输出示例

```bash
# gitm shell
# 输出可 eval 的函数定义
_gitm_shell_wrapper() {
    local output
    output=$(command gitm "$@")
    local status=$?
    echo "$output"

    # 自动 cd 功能
    if [[ $status -eq 0 ]]; then
        case "$1" in
            wt|worktree)
                case "$2" in
                    create|switch|sw|cd|"")
                        local path=$(echo "$output" | tail -1)
                        [[ -d "$path" ]] && cd "$path"
                        ;;
                esac
                ;;
            start)
                # 检测 --worktree 参数
                if echo " $*" | grep -q '\-\-worktree\|-w'; then
                    local path=$(echo "$output" | tail -1)
                    [[ -d "$path" ]] && cd "$path"
                fi
                ;;
        esac
    fi
}
alias gitm='_gitm_shell_wrapper'
```

---

## 四、包装器增强功能

### 4.1 自动 cd 场景

| 命令 | 行为 |
|------|------|
| `gitm wt create <branch>` | 创建后自动 cd 到新 worktree |
| `gitm wt switch <branch>` | 自动 cd 到目标 worktree |
| `gitm wt cd <branch>` | 快速跳转到 worktree（新子命令） |
| `gitm start <type> <name> --worktree` | 创建后自动 cd |

> **注意**：`gitm go` 是智能导航命令，用于交互式选择并执行其他 gitm 命令，不用于 worktree 跳转。

### 4.2 智能补全

包装器内置补全函数，支持：

```bash
# 分支名补全
gitm wt switch fea<TAB>      # 补全 feature/xxx
gitm wt remove bug<TAB>      # 补全 bugfix/xxx

# 子命令补全
gitm wt <TAB>                # 显示: create, switch, remove, list, prune, sync, cd

# 选项补全
gitm wt create <branch> <TAB>  # 显示: --path, --link-modules, --base
```

### 4.3 历史记录增强

```bash
# 记录 worktree 访问历史，支持快速跳转
gitm wt cd -          # 跳转到上一个 worktree
gitm wt cd --recent   # 显示最近访问的 worktree 列表
gitm wt cd --fzf      # 使用 fzf 交互选择（如已安装）
```

### 4.4 状态提示增强

```bash
# 在 shell prompt 中显示 worktree 状态
# 需要 starship/powerline 等配合

# 示例：在 .zshrc 中
GITMARS_WT_SHOW_STATUS=true

# prompt 显示效果
# [main] ~/project $           # 主项目
# [feature/login] ~/project/.gitmars/worktrees/feature-login $  # worktree
```

### 4.5 批量操作

> ⏸️ **暂不实现，后续版本考虑**

```bash
# 批量执行命令
gitm wt foreach 'npm install'              # 所有 worktree 执行 npm install
gitm wt foreach 'git pull'                 # 所有 worktree 执行 git pull
gitm wt foreach --filter 'feature/*' 'npm test'  # 过滤分支执行
```

### 4.6 快捷别名

> ⏸️ **暂不实现，后续版本考虑**

包装器自动创建的别名：

| 别名 | 命令 | 说明 |
|------|------|------|
| `gwt` | `gitm wt` | Worktree 快捷 |
| `gwts` | `gitm wt switch` | 切换 worktree |
| `gwtc` | `gitm wt create` | 创建 worktree |
| `gwtr` | `gitm wt remove` | 删除 worktree |
| `gwtl` | `gitm wt list` | 列出 worktree |
| `gcd` | `gitm wt cd` | 跳转 worktree |

用户可在 `~/.gitmarsrc` 中自定义或禁用：

```json
{
  "shellAliases": {
    "gwt": true,
    "gwts": true,
    "gwtc": true,
    "gwtr": true,
    "gwtl": true,
    "gcd": true
  }
}
```

### 4.7 环境变量注入

> ⏸️ **暂不实现，后续版本考虑**

进入 worktree 时自动设置环境变量：

```bash
# 在 worktree 中自动设置
export GITMARS_WT_NAME="feature/login"
export GITMARS_WT_PATH="/path/to/project/.gitmars/worktrees/feature-login"
export GITMARS_WT_BRANCH="feature/login"

# 离开 worktree 时自动清除
unset GITMARS_WT_NAME GITMARS_WT_PATH GITMARS_WT_BRANCH
```

---

## 五、安装流程

### 5.1 自动安装（推荐）

```bash
npm install -g gitmars
# postinstall 自动执行：
# 1. 检测 CI 环境 → 跳过
# 2. 检测 GITMARS_NO_SHELL_INIT=1 → 跳过
# 3. 检测 Windows → 写入 PowerShell profile
# 4. 检测 Unix → 写入 .zshrc/.bashrc
# 5. 输出提示信息
```

### 5.2 安装输出

```
✓ Gitmars shell integration added to ~/.zshrc
  Restart your terminal or run: source ~/.zshrc

Installed features:
  • Auto-cd on worktree create/switch
  • Smart tab completion

Useful commands:
  • gitm doctor          - Check repository health
  • gitm doctor --fix    - Auto-fix issues
  • gitm shell --check   - Check shell integration status

To disable: gitm shell --uninstall
To skip during install: GITMARS_NO_SHELL_INIT=1 npm install -g gitmars
```

### 5.3 跳过自动安装

```bash
# 方式 1：环境变量
GITMARS_NO_SHELL_INIT=1 npm install -g gitmars

# 方式 2：npm config
npm config set gitmars:no-shell-init true
npm install -g gitmars

# 方式 3：全局配置文件
echo '{"shellInit": false}' > ~/.gitmarsrc
```

---

## 六、`gitm doctor` 集成

### 6.1 检查项

```
gitm doctor

┌─────────────────────────────────────────────────────────────┐
│  Gitmars Doctor Report                                      │
├─────────────────────────────────────────────────────────────┤
│  ✓ Git Version              2.43.0                          │
│  ✓ Gitmars Version          8.0.0 (latest)                  │
│  ✓ Working Directory        Clean                           │
│  ✓ Branch Status            Up to date                      │
│  ✓ Worktrees                3 worktree(s) active            │
│  ✓ Shell Integration        Installed (zsh)                 │
│  ✓ Git Alias                Installed                       │
│  ✓ Config File              .gitmarsrc found                │
│  ✓ Merge Conflicts          No conflicts                    │
│  ✓ Hooks                    Configured                      │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 检查项详情

| 检查项 | 状态 | 条件 | 提示信息 |
|--------|------|------|----------|
| Git Version | ✓/⚠/✗ | Git 版本 >= 2.0 | 低版本提示升级 |
| Gitmars Version | ✓/⚠ | 与 npm 最新版本对比 | 有新版本提示升级 |
| Working Directory | ✓/⚠ | 是否有未提交更改 | 提示提交或暂存 |
| Branch Status | ✓/⚠ | 与远程分支对比 | 提示 push 或 pull |
| Worktrees | ✓/⚠ | 是否有无效 worktree | 提示运行 prune |
| Shell Integration | ✓/⚠/✗ | 函数是否已安装 | 提示安装或升级 |
| Git Alias | ✓/⚠ | git 别名是否已安装 | 提示运行 `gitm alias init` |
| Config File | ✓/⚠ | .gitmarsrc 是否存在 | 提示运行 `gitm init` |
| Merge Conflicts | ✓/✗ | 是否有未解决冲突 | 提示手动解决 |
| Hooks | ✓/⚠ | hooks 配置是否有效 | 提示检查配置 |

### 6.3 `--fix` 自动修复能力

```bash
gitm doctor --fix
```

`--fix` 参数可自动修复以下问题：

| 问题 | 修复操作 | 命令 |
|------|----------|------|
| 无效 worktree | 清理无效 worktree | `gitm worktree prune` |
| Shell 集成未安装 | 自动安装 shell 集成 | `gitm shell --install` |
| Shell 集成过旧 | 升级 shell 集成 | `gitm shell --upgrade` |
| Git 别名未安装 | 安装 git 快捷别名 | `gitm alias init` |
| 缓存过期 | 清理 gitmars 缓存 | `gitm clean` |
| 配置文件缺失 | 引导创建配置文件 | `gitm init` |

### 6.4 修复流程

```bash
gitm doctor --fix

# 执行流程：
# 1. 检查并清理无效 worktree
# 2. 安装/升级 shell 集成
# 3. 安装 git 别名（如未安装）
# 4. 清理缓存
# 5. 输出修复结果

# 输出示例：
⚠ Worktrees: 2 invalid worktree(s) found
  → Running: gitm worktree prune
  ✓ Cleaned 2 invalid worktree(s)

⚠ Shell Integration: Not installed
  → Running: gitm shell --install
  ✓ Shell integration installed to ~/.zshrc

✓ Git Alias: Already installed
✓ Cache: Cleaned

All fixable issues resolved!
```

---

## 七、Windows 支持

### 7.1 支持矩阵

| Shell | 配置文件 | 支持级别 |
|-------|----------|----------|
| PowerShell | `$PROFILE` (`Documents\PowerShell\Microsoft.PowerShell_profile.ps1`) | ✅ 完全支持 |
| Git Bash | `~/.bashrc` | ✅ 完全支持 |
| WSL | `~/.zshrc` / `~/.bashrc` | ✅ 完全支持 |
| CMD | 无 | ❌ 不支持（提示使用 PowerShell） |

### 7.2 PowerShell 函数

```powershell
# gitm shell --shell powershell 输出
function gitm {
    param([Parameter(ValueFromRemainingArguments)]$Args)

    $output = & gitm.exe @Args 2>&1
    $output | ForEach-Object { Write-Host $_ }

    $lastLine = $output | Select-Object -Last 1
    if (Test-Path $lastLine -PathType Container) {
        Set-Location $lastLine
    }
}

# 别名
Set-Alias -Name gwt -Value gitm
```

### 7.3 检测逻辑

```javascript
function detectShell() {
    const shell = process.env.SHELL || ''
    const term = process.env.TERM || ''
    const wtSession = process.env.WT_SESSION

    // Windows Terminal + PowerShell
    if (wtSession && process.env.PSModulePath) {
        return 'powershell'
    }

    // Git Bash on Windows
    if (process.platform === 'win32' && shell.includes('bash')) {
        return 'gitbash'
    }

    // WSL
    if (process.env.WSL_DISTRO_NAME) {
        return shell.includes('zsh') ? 'zsh' : 'bash'
    }

    // Unix
    if (shell.includes('zsh')) return 'zsh'
    if (shell.includes('bash')) return 'bash'

    // Windows fallback
    if (process.platform === 'win32') {
        return 'powershell'
    }

    return null
}
```

---

## 八、文件结构

```
packages/gitmars/
├── src/
│   ├── gitm-shell.ts              # 新增：shell 命令入口
│   ├── gitm-worktree.ts           # 修改：增加 cd 子命令
│   ├── gitm-doctor.ts             # 修改：增加 shell 检查
│   ├── conf/
│   │   └── shell.ts               # 新增：shell 命令配置
│   └── shell/
│       ├── index.ts               # Shell 集成核心逻辑
│       ├── templates/
│       │   ├── gitm.sh            # bash/zsh 函数模板
│       │   └── gitm.ps1           # PowerShell 函数模板
│       ├── installer.ts           # 安装/卸载逻辑
│       ├── detector.ts            # Shell 类型检测
│       └── completion.ts          # 补全函数生成
├── scripts/
│   └── postinstall.js             # 自动安装 shell 集成
└── package.json                   # 添加 postinstall 脚本
```

---

## 九、版本管理

### 9.1 函数版本号

函数定义中包含版本号，用于检测是否需要升级：

```bash
# 函数模板中
_GITMARS_SHELL_VERSION="8.0.0"

# 检查版本
gitm shell --check
# 输出: {"installed": true, "version": "7.9.0", "latest": "8.0.0", "needsUpgrade": true}
```

### 9.2 升级流程

```bash
gitm shell --upgrade
# 1. 读取当前配置文件
# 2. 移除旧函数定义
# 3. 写入新函数定义
# 4. 保留用户自定义别名
```

---

## 十、用户操作流程对比

### 10.1 首次安装

| 步骤 | 操作 |
|------|------|
| 1 | `npm install -g gitmars` |
| 2 | 自动写入 shell 配置（无感知） |
| 3 | 重启终端 或 `source ~/.zshrc` |
| 4 | 开始使用 |

### 10.2 使用体验

```bash
# 之前（繁琐）
gitm wt create feature/login
cd $(gitm wt switch feature/login)

# 之后（一行搞定）
gitm wt create feature/login    # 自动 cd
```

### 10.3 问题修复

```bash
# 发现 shell 集成有问题
gitm doctor                     # 检查问题
gitm doctor --fix               # 自动修复

# 或手动操作
gitm shell --uninstall          # 卸载
gitm shell --install            # 重新安装
```

---

## 十一、配置选项

### 11.1 用户配置 (`~/.gitmarsrc`)

```json
{
  "shell": {
    "enable": true,
    "autoCd": true,
    "completion": true,
    "historySize": 100
  }
}
```

> **注意**：`aliases` 和 `envInjection` 配置项暂不支持，后续版本开放。

### 11.2 项目配置 (`.gitmarsrc`)

```json
{
  "shell": {
    "foreachIgnore": ["node_modules", "dist", ".git"],
    "syncFiles": [".eslintrc", ".prettierrc", "tsconfig.json"]
  }
}
```

---

## 十二、实施计划

### Phase 1：核心功能（v8.1.0）

- [ ] `gitm shell` 命令实现
- [ ] `gitm worktree cd` 子命令
- [ ] bash/zsh 函数模板
- [ ] postinstall 自动安装
- [ ] `--no-shell-init` 支持

### Phase 2：增强功能（v8.2.0）

- [ ] PowerShell 支持
- [ ] 智能补全
- [ ] `gitm doctor` 增强（版本检查、别名检查、配置检查）
- [ ] 历史记录功能

### Phase 3：高级功能（v8.3.0）

- [ ] fzf 集成
- [ ] 快捷别名（gwt、gcd 等）
- [ ] 环境变量注入
- [ ] Prompt 状态显示
- [ ] 批量操作 `foreach`

---

## 十三、注意事项

### 13.1 兼容性

- 不影响原有 `gitm` 命令行为
- 用户可随时通过 `gitm shell --uninstall` 移除
- 支持与现有 shell 配置共存

### 13.2 安全性

- postinstall 不执行任意代码
- 只写入标准配置文件
- 用户可预览操作 `--dry-run`

### 13.3 性能

- 函数包装器开销 < 10ms
- 补全函数延迟加载
- 历史记录限制条数

---

## 十四、参考实现

类似工具的实现参考：

| 工具 | 实现方式 |
|------|----------|
| fnm | `eval "$(fnm env)"` + 自动安装 |
| nvm | `source ~/.nvm/nvm.sh` + 手动添加 |
| pyenv | `eval "$(pyenv init -)"` + 自动安装 |
| zoxide | `eval "$(zoxide init zsh)"` + 自动安装 |
| direnv | `eval "$(direnv hook zsh)"` + 手动添加 |

Gitmars 采用 **自动安装 + eval** 的混合方式，兼顾便利性和灵活性。

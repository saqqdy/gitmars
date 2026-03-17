# Gitmars 功能扩展建议

> 除了 worktree 之外，还有哪些优秀的 git 特性值得整合到 gitmars 中

---

## 一、高级定位工具

### 1. git bisect - 二分查找定位 Bug

**痛点**：项目上线出 bug，不知道是哪次提交引入的，逐个排查太慢

**git bisect 原理**：
```shell
git bisect start
git bisect bad          # 当前版本有 bug
git bisect good v1.0.0  # 这个版本没问题
# git 会自动二分查找，引导你测试中间版本
```

**gitmars 整合方案**：

```shell
gitm bisect start <good-commit> [bad-commit]
gitm bisect good          # 标记当前版本正常
gitm bisect bad           # 标记当前版本有问题
gitm bisect run <script>  # 自动化测试脚本定位
gitm bisect reset         # 结束查找
```

**差异化**：
- 交互式向导，无需记忆命令
- 支持 `--auto` 自动运行测试脚本定位
- 定位完成后显示详细提交信息和责任人

---

### 2. git blame 增强 - 代码追溯

**痛点**：看到问题代码，想知道谁写的、什么时候写的、为什么这么写

**gitmars 整合方案**：

```shell
gitm blame <file> [line]
gitm blame <file> --detail  # 显示关联的 MR/Issue
```

**差异化**：
- 集成 GitLab/GitHub API，显示关联的 Merge Request
- 支持显示提交时的 CI 状态
- 显示该行代码的变更历史时间线

---

## 二、历史救援工具

### 3. git reflog 时光机

**痛点**：误删分支、误 reset、误 rebase，代码丢了怎么办？

**git reflog 原理**：
```shell
git reflog              # 查看操作历史
git reset --hard HEAD@{5}  # 恢复到之前的状态
```

**gitmars 整合方案**：

```shell
gitm history            # 可视化操作历史
gitm history restore <id>  # 恢复到指定状态
gitm history undo       # 撤销最近一次操作
```

**差异化**：
- 图形化展示操作时间线
- 支持预览每个操作点的差异
- 一键恢复，无需理解 HEAD@{n} 语法

---

### 4. git rerere - 冲突解决方案复用

**痛点**：同样的冲突解决了很多次，每次都要手动处理

**git rerere 原理**：自动记录冲突解决方案，下次遇到相同冲突自动应用

**gitmars 整合方案**：

```shell
gitm rerere enable      # 启用冲突记忆
gitm rerere list        # 查看已记录的解决方案
gitm rerere clear       # 清除记忆
```

**差异化**：
- 默认开启，无需用户感知
- 显示已记录的冲突解决方案统计
- 支持手动编辑/删除特定解决方案

---

## 三、交互式重写工具

### 5. git rebase -i 向导

**痛点**：交互式 rebase 很强大，但命令行操作复杂，容易出错

**git rebase -i 场景**：
- 合并多个 commit
- 重新排序 commit
- 修改历史 commit 信息
- 拆分 commit

**gitmars 整合方案**：

```shell
gitm squash [n]         # 合并最近 n 个 commit
gitm reorder            # 交互式重排 commit 顺序
gitm amend-old <commit> # 修改历史某个 commit
gitm split <commit>     # 拆分某个 commit
```

**差异化**：
- 向导式操作，每步都有提示
- 支持预览变更，确认后再执行
- 自动备份，支持一键撤销

---

### 6. 历史清理工具

**痛点**：不小心提交了密码、密钥等敏感信息；或者想清理混乱的提交历史

**gitmars 整合方案**：

```shell
gitm clean-history <file>     # 从历史中删除某文件
gitm clean-history --secret   # 扫描并清理敏感信息
gitm rewrite-author           # 批量修改作者信息
```

**差异化**：
- 集成敏感信息扫描（AWS key、私钥等）
- 自动更新远程仓库（force push 警告提示）
- 支持选择性清理指定分支

---

## 四、仓库管理工具

### 7. git sparse-checkout - 稀疏检出

**痛点**：超大仓库，clone 慢，磁盘占用大，只想看某个目录

**gitmars 整合方案**：

```shell
gitm clone <url> --sparse <dirs>  # 只 clone 指定目录
gitm sparse add <dir>             # 添加需要检出的目录
gitm sparse remove <dir>          # 移除检出目录
```

**差异化**：
- 交互式选择需要的目录
- 支持配置文件持久化
- 团队可共享 sparse-checkout 配置

---

### 8. git submodule 增强

**痛点**：submodule 操作繁琐，更新、初始化容易忘

**gitmars 整合方案**：

```shell
gitm sub init            # 初始化所有子模块
gitm sub update          # 更新所有子模块到最新
gitm sub status          # 查看所有子模块状态
gitm sub foreach <cmd>   # 在所有子模块执行命令
```

**差异化**：
- 自动检测并处理子模块冲突
- 支持批量操作所有子模块
- 可视化展示子模块依赖树

---

### 9. 仓库健康检查

**痛点**：仓库越来越大，克隆越来越慢，不知道怎么清理

**gitmars 整合方案**：

```shell
gitm doctor             # 全面诊断
gitm doctor --fix       # 自动修复问题
gitm doctor --stats     # 显示仓库统计信息
```

**检查项**：
- 大文件检测（历史中的大文件）
- 无用分支检测（已合并的分支）
- 孤立提交检测
- 仓库体积优化建议
- 损坏的引用检测

---

## 五、协作增强工具

### 10. git stash 增强

**痛点**：stash 功能简单，管理不便

**gitmars 整合方案**：

```shell
gitm stash [name]              # 带命名保存
gitm stash list                # 列出所有 stash（带描述和时间）
gitm stash apply <name>        # 按名称恢复
gitm stash drop <name>         # 按名称删除
gitm stash pop <name>          # 恢复并删除
gitm stash clear --older 7d    # 清理 7 天前的 stash
```

**差异化**：
- 命名 stash，不用记 stash@{n}
- 自动添加时间戳和分支信息
- 支持过期自动清理

---

### 11. Commit 模板与规范

**痛点**：commit message 格式不统一，难以自动化处理

**gitmars 整合方案**：

```shell
gitm commit                 # 交互式提交
gitm commit --template      # 使用模板
gitm commit --amend         # 修改最近提交
gitm commitlint             # 检查提交规范
```

**差异化**：
- 集成 Commitlint
- 支持自定义模板
- 自动关联 Issue/MR

---

### 12. 变更通知与订阅

**痛点**：想关注某些分支/文件的变更，但不知道什么时候更新

**gitmars 整合方案**：

```shell
gitm watch add <branch>     # 订阅分支变更
gitm watch add <file>       # 订阅文件变更
gitm watch list             # 查看订阅列表
gitm watch notify           # 检查并发送通知
```

**差异化**：
- 支持邮件/Webhook/钉钉/飞书通知
- 定时检查变更
- 可配置变更过滤规则

---

## 六、实用小工具

### 13. git archive 导出

```shell
gitm export [branch] --format zip --output release.zip
gitm export --since v1.0.0  # 只导出变更文件
```

---

### 14. git describe 版本描述

```shell
gitm version               # 显示当前版本描述
gitm version --next        # 预测下个版本号
gitm version --changelog   # 生成变更日志
```

---

### 15. 快捷别名管理

```shell
gitm alias list            # 列出所有别名
gitm alias add <name> <cmd> # 添加别名
gitm alias remove <name>   # 删除别名
gitm alias import          # 从配置导入
gitm alias export          # 导出别名配置
```

---

## 功能优先级建议

| 优先级 | 功能 | 价值 | 实现难度 |
|--------|------|------|----------|
| P0 | bisect 自动定位 | 高 - 救命功能 | 中 |
| P0 | reflog 时光机 | 高 - 救命功能 | 低 |
| P1 | rebase-i 向导 | 高 - 常用但难用 | 中 |
| P1 | stash 增强 | 高 - 每天都在用 | 低 |
| P1 | doctor 诊断 | 中 - 提升体验 | 中 |
| P2 | blame 增强 | 中 - 协作场景 | 中 |
| P2 | submodule 增强 | 中 - 大项目刚需 | 中 |
| P2 | commit 规范 | 中 - 团队协作 | 低 |
| P3 | sparse-checkout | 中 - 大仓库 | 低 |
| P3 | rerere | 低 - 懂的人少 | 低 |
| P3 | 历史清理 | 低 - 危险操作 | 高 |

---

## 与现有功能的整合点

| 现有命令 | 可整合新功能 |
|----------|--------------|
| `gitm start` | --sparse 选项 |
| `gitm combine` | --rerere 自动应用 |
| `gitm save/get` | stash 增强替代 |
| `gitm undo/redo` | reflog 时光机增强 |
| `gitm copy` | rebase-i 向导 |
| `gitm branch` | submodule 状态展示 |
| `gitm clean` | doctor 诊断整合 |

---

## 总结

推荐的 TOP 5 核心功能：

1. **gitm bisect** - 自动化 bug 定位，团队救星
2. **gitm history** - 可视化 reflog，代码时光机
3. **gitm squash** - 向导式 commit 合并
4. **gitm stash** - 命名化管理，不再混乱
5. **gitm doctor** - 仓库健康管家

这些功能都有共同特点：**原生 git 有这个能力，但使用门槛高或体验差**，gitmars 的价值就是让这些好用的功能变得人人可用。

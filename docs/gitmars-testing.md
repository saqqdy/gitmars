# 本地测试指南

本文档介绍如何在本地测试 Gitmars 的新功能。

## 方式一：pnpm link 本地链接（推荐）

这是最常用的测试方式，可以在真实项目中测试本地开发的 gitmars。

### 步骤

```shell
# 1. 在 gitmars 项目根目录构建
cd /path/to/gitmars
pnpm build

# 2. 进入 gitmars 包目录
cd packages/gitmars

# 3. 创建全局软链接
pnpm link --global

# 4. 在测试项目中使用本地版本
cd /path/to/your-test-project
pnpm link --global gitmars

# 5. 验证链接是否成功
which gitm
# 输出：/path/to/gitmars/packages/gitmars/lib/gitm.mjs

gitm --version
# 输出：8.0.0-beta.3
```

### 取消链接

```shell
# 在测试项目中取消链接
cd /path/to/your-test-project
pnpm unlink gitmars

# 删除全局链接
pnpm unlink --global gitmars
```

### 优势

- ✅ 完全模拟真实使用场景
- ✅ 支持热更新（配合 `pnpm dev`）
- ✅ 可以在任何项目中测试

---

## 方式二：Worktree 独立工作区

使用 gitmars 自带的 worktree 功能，创建独立的测试工作区。

### 步骤

```shell
# 1. 在 gitmars 项目创建测试 worktree
cd /path/to/gitmars
gitm start feature test-new-feature --worktree

# 2. 进入 worktree 进行开发
cd .gitmars/worktrees/feature-test-new-feature

# 3. 构建并测试
pnpm build
pnpm test

# 4. 在测试项目中链接测试
cd /path/to/test-project
pnpm link --global gitmars
```

### 优势

- ✅ 独立工作区，不影响主项目
- ✅ 可以同时测试多个功能分支
- ✅ 测试完成直接删除 worktree

---

## 方式三：直接运行源码

适合快速验证单个功能，无需完整构建。

### 使用 tsx 运行 TypeScript

```shell
# 安装 tsx（如果未安装）
pnpm add -g tsx

# 直接运行 TypeScript 源码
cd /path/to/gitmars/packages/gitmars
tsx src/gitm.ts --help

# 运行特定命令
tsx src/gitm.ts start feature test-123
```

### 使用 Node 运行构建产物

```shell
# 构建后直接运行
cd /path/to/gitmars/packages/gitmars
node lib/gitm.mjs --help
```

### 使用开发模式（热更新）

```shell
# 在 gitmars 包目录启动开发模式
cd /path/to/gitmars/packages/gitmars
pnpm dev

# 在另一个终端测试
node lib/gitm.mjs start feature test
```

### 优势

- ✅ 快速验证，无需完整构建
- ✅ 支持热更新
- ✅ 适合开发阶段调试

---

## 方式四：单元测试

使用 Vitest 编写和运行单元测试。

### 运行测试

```shell
# 在项目根目录运行所有测试
pnpm test

# 运行特定包的测试
cd packages/gitmars
pnpm test

# 运行特定测试文件
pnpm vitest run test/worktree.test.ts

# 监听模式（文件变化自动重跑）
pnpm vitest watch

# 带覆盖率
pnpm vitest run --coverage
```

### 编写测试示例

```typescript
// packages/gitmars/test/worktree.test.ts
import { describe, it, expect } from 'vitest'
import createWorktree from '@gitmars/git/lib/createWorktree'

describe('createWorktree', () => {
    it('should create worktree successfully', () => {
        const result = createWorktree({
            branch: 'feature/test',
            linkModules: true,
        })

        expect(result.success).toBe(true)
        expect(result.branch).toBe('feature/test')
    })
})
```

### 优势

- ✅ 自动化测试，可集成 CI
- ✅ 精准验证单个功能点
- ✅ 回归测试，防止功能退化

---

## 方式五：集成测试项目

创建专门的测试项目进行端到端测试。

### 创建测试项目

```shell
# 1. 创建测试目录
mkdir -p ~/gitmars-test
cd ~/gitmars-test

# 2. 初始化 Git 仓库
git init
git commit --allow-empty -m "Initial commit"

# 3. 创建基础分支结构
git checkout -b release
git checkout -b develop
git checkout main

# 4. 创建 gitmars 配置
gitm init

# 5. 链接本地 gitmars
pnpm link --global gitmars
```

### 测试脚本示例

创建 `~/gitmars-test/test.sh`：

```shell
#!/bin/bash
set -e

echo "=== 测试 gitmars 功能 ==="

# 测试 start 命令
echo "1. 测试 start 命令"
gitm start feature test-001
git branch --show-current | grep -q "feature/test-001" && echo "✅ start 命令正常"

# 测试 status 命令
echo "2. 测试 status 命令"
gitm status

# 测试 end 命令
echo "3. 测试 end 命令"
gitm end feature test-001

echo "=== 测试完成 ==="
```

### 优势

- ✅ 完整的端到端测试
- ✅ 可以模拟真实 Git 工作流
- ✅ 便于发现集成问题

---

## 方式六：Docker 测试环境

创建隔离的测试环境，确保测试环境一致性。

### 创建 Dockerfile

```dockerfile
# Dockerfile.test
FROM node:20-alpine

RUN apk add --no-cache git python3

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制项目文件
COPY . .

# 安装依赖
RUN pnpm install

# 构建
RUN pnpm build

# 设置入口
ENTRYPOINT ["node", "packages/gitmars/lib/gitm.mjs"]
```

### 构建和运行

```shell
# 构建镜像
docker build -f Dockerfile.test -t gitmars-test .

# 运行测试
docker run --rm -it gitmars-test --help

# 挂载测试项目运行
docker run --rm -it -v /path/to/test-project:/workspace gitmars-test status
```

### 优势

- ✅ 环境隔离，不影响本地环境
- ✅ 可重复的测试环境
- ✅ 便于 CI 集成

---

## 开发调试技巧

### 启用 Debug 日志

```shell
# 设置 DEBUG 环境变量
export DEBUG=gitmars:*

# 运行命令查看详细日志
gitm start feature test
```

### 使用 Console 调试

在代码中添加调试语句：

```typescript
import { debug } from '@gitmars/utils'

// 使用 debug 输出
debug('myFeature', 'Processing branch:', branch)

// 或直接 console
console.log('[gitmars-debug]', data)
```

### VS Code 调试配置

创建 `.vscode/launch.json`：

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug gitm",
            "runtimeExecutable": "node",
            "program": "${workspaceFolder}/packages/gitmars/lib/gitm.mjs",
            "args": ["start", "feature", "test"],
            "console": "integratedTerminal"
        }
    ]
}
```

---

## 测试检查清单

在提交新功能前，建议完成以下测试：

### 功能测试

- [ ] 新功能正常工作
- [ ] 命令行参数正确解析
- [ ] 错误提示清晰友好
- [ ] 边界情况处理正确

### 兼容性测试

- [ ] macOS 正常运行
- [ ] Linux 正常运行
- [ ] Windows 正常运行（如有条件）

### 回归测试

- [ ] 现有功能未被破坏
- [ ] 单元测试全部通过
- [ ] 文档已更新

### 集成测试

- [ ] 与 Git 命令正确交互
- [ ] 配置文件正确读写
- [ ] 多分支操作正确

---

## 常见问题

### Q: pnpm link 后命令找不到？

```shell
# 确保全局 bin 目录在 PATH 中
pnpm bin -g
# 将输出添加到 PATH

# 或使用 npm 链接
npm link
```

### Q: 构建后测试不生效？

```shell
# 清理并重新构建
pnpm clean
pnpm build

# 或只构建特定包
cd packages/gitmars
pnpm build
```

### Q: 如何测试特定版本？

```shell
# 使用 git 切换到特定版本标签
git checkout v7.7.0
pnpm build

# 测试完成后切回
git checkout master
```

### Q: 如何模拟 CI 环境测试？

```shell
# 设置 CI 环境变量
export CI=true

# 运行完整测试流程
pnpm install
pnpm build
pnpm test
```

---

## 快速参考

| 测试方式 | 适用场景 | 命令 |
|---------|---------|------|
| pnpm link | 真实项目测试 | `pnpm link --global` |
| Worktree | 并行开发测试 | `gitm start feat x --worktree` |
| 直接运行 | 快速验证 | `tsx src/gitm.ts` |
| 单元测试 | 功能点验证 | `pnpm vitest run` |
| 集成测试 | 端到端验证 | 创建测试项目 |
| Docker | 环境隔离 | `docker run gitmars-test` |

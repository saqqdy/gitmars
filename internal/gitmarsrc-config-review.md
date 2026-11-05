# .gitmarsrc 配置评审 —— 命名、层级、规划、美观

> 内部工作笔记，不面向用户。
>
> 背景：v7.9.0 把构建敏感数据从 `getBuildConfig` 接口响应迁到 gitmars 配置文件的
> `buildSecret` 块，并新增 home 目录全局层，与项目根目录配置合并（项目级优先）。
> 下文用 `.gitmarsrc` 代指配置文件，实际通过 `cosmiconfig` 搜索位置发现，支持多种
> 文件名与格式。

## 问题范围

当前配置约 14 个顶层键，全部平铺，混合了四种作用域：

| 作用域 | 键 |
|---|---|
| 工作流 / 分支名 | `master`、`develop`、`release`、`bugfix`、`support` |
| 项目专属标识 | `gitID` |
| 共享基础设施 / 接口 | `gitHost`、`api`、`apis`、`apolloConfig` |
| 消息 / 钩子 | `msgTemplate`、`msgUrl`、`hooks` |
| 校验 / 版本控制 | `nameValidator`、`descriptionValidator`、`versionControlType`、`skipCI` |
| 敏感数据（新增） | `buildSecret` |

平铺结构无法直观看出哪些键可以放全局文件。`gitID` 被误放进 `~/.gitmarsrc` 正是这个原因——它是每个项目各自的 GitLab 项目 ID，绝不能全局化。目前已删除，但结构性问题仍在。

## 1. 分层：按作用域分组，而不是按来源堆平

建议的目标结构：

```jsonc
{
  "branches": { "master": "master", "develop": "dev", "release": "release", "bugfix": "bug", "support": "support" },
  "git":      { "host": "https://git.kingdee.com", "projectId": "4444" },
  "api":      { "userInfo": "...", "buildConfig": { "url": "...", "method": "get", "params": {} } },
  "notify":   { "msgTemplate": "...", "msgUrl": "..." },
  "hooks":    { "pre-commit": "lint-staged" },
  "validate": { "nameValidator": "", "descriptionValidator": "", "versionControlType": "minor" },
  "buildSecret": {
    "username": "",
    "password": "",
    "miniprogramToken": "",
    "miniprogramSession": "",
    "gitNotificationGroupUrl": ""
  }
}
```

**收益**：项目专属键（`git.projectId`）被物理隔离，不会再误进全局文件；同时消除长期存在的 `api` / `apis` 近似键。

**代价**：破坏性变更。`packages/api`、`packages/core`、`packages/gitmars`、`packages/hook` 约 20 处读取点，外加 `packages/gitmars/src/gitm-init.ts` 的初始化模板都要改，需要迁移脚本和大版本窗口。

**建议**：v7.9.0 不做。先落地下面 2–5 项，分组重构留到下个大版本配 codemod 一起做。

## 2. 命名问题

| 现状 | 问题 | 建议 |
|---|---|---|
| `api` + `apis` | 单复数近似键。`api` 是 `userInfo` 的遗留回退，`config.apis?.userInfo?.url \|\| config.api` 出现在 6 个文件 | 统一收敛到 `apis.userInfo`，`api` 先标记废弃并告警，下个大版本移除 |
| `gitHost` / `gitID` | 大小写不统一（`ID` 全大写） | `gitHost` / `gitProjectId`（至少统一成 `gitId`）；`projectId` 也能让作用域一目了然 |
| `msgUrl` | 名字看不出是 CRP 链接，且与 `gitNotificationGroupUrl` 概念重叠 | 改名 `crpUrl`，但先确认是否已废弃，见第 3 项 |
| `apolloConfig.token` | 与敏感构建 token 同名，容易混淆 | 改名 `apolloToken`，明确归属 |
| `buildSecret.token` | v7.9.0 已删除 —— 各环境 Jenkins token 不敏感，仍由接口返回 | 已处理 |
| 环境 `token` → `schema` | v7.9.0 已改名（`dev`/`bug`/`prod`） | `runJenkins` 读 `p.schema \|\| cfg.schema`；URL 模板占位符 `${token}` 保持不变，它是模板变量而非配置字段 |

## 3. 先确认 `msgUrl` 是否是死配置

grep `packages/*/src` 未发现 `msgUrl` 的**任何读取点**，仅出现在示例 `.gitmarsrc` 和文档里（文档已标注 4.0.0 起弃用："消息发送地址统一使用 buildConfig 里面的地址"）。

若确认废弃：从示例配置、`packages/git/src/getConfig.ts` 的 `defaults`、类型定义、以及中英文 `guide/basic-config.md` 中一并删除。留着会误导用户去配一个不生效的值。

## 4. 全局文件放敏感数据：需要定策略

目前 `buildSecret`（Jenkins 账号密码、小程序 session、群机器人 webhook token）放在 `~/.gitmarsrc`，机器上**任一项目都能读到**。

两个方向：

- **保守（推荐）**：`buildSecret` 只放项目级文件。全局文件只放非敏感默认值（`master`/`develop`/`gitHost`/`apis`）。
- **分级**：全局只允许放 `gitNotificationGroupUrl` 这类低敏感项；`username`/`password`/`miniprogramSession` 强制项目级。

重要：`getConfig` 目前是**浅层** `Object.assign` 合并。`buildSecret` 是单个顶层键，项目级要覆盖就必须写**完整**配置块——只覆盖 `password` 会把其它字段丢掉。若采用分级方案，`buildSecret` 需要改成字段级合并（`token` 已移除，现在只是一层简单合并）。v7.9.0 明确选了浅合并，此处作为已知限制记录。

## 5. 美观与 hygiene

- **缩进**：示例 `.gitmarsrc` tab 与空格混用（第 33–34 行是空格，其余是 tab），统一成 tab。
- **说明**：JSON 不能写注释。建议提供带注释的 `.gitmarsrc.example`，或用文档表格列出每个字段的作用域（全局 / 项目 / 必填 / 默认值）。
- **空值**：省略 `user`、`email`、`miniprogramToken: ""`，靠 `defaults` 兜底，减少噪音，也减少空字符串泄漏的位置。
- **文件权限**：全局文件已设为 `0600`。但 `gitm init` 生成项目级文件时用的是 `0755`（[gitm-init.ts](packages/gitmars/src/gitm-init.ts)），含凭据时过宽，应改为 `0600`。
- **废弃标记**：`support`、`user`、`email`、`msgUrl`、`api` 在文档中均已标注弃用，但仍存在于 `defaults` 和示例配置里。建议从示例里移除，避免被复制传播。

## 建议落地顺序

1. 确认 `msgUrl` 废弃后删除；`gitID` 保持项目级（已处理）。
2. 收敛 `api`/`apis`、`apolloConfig.token` 改名 `apolloToken`。低风险、收益明显。
3. 确定 `buildSecret` 的作用域策略（仅项目级 vs 分级），以及是否要改成字段级合并。
4. 统一格式、权限、示例文件。
5. 分组重构（第 1 项）放下个大版本，配迁移脚本。

## 相关代码

- `packages/git/src/getConfig.ts` —— 全局 / 项目两级合并
- `packages/build/src/buildConfig.ts` —— `mergeBuildSecret` / `stripSecret`
- `packages/build/src/runJenkins.ts` —— `schema` + `username`/`password`
- `packages/core/src/sendGroupMessage.ts` —— `gitNotificationGroupUrl`
- `packages/api/src/request/miniprogram.ts` —— `miniprogramToken` / `miniprogramSession`
- `packages/gitmars/src/gitm-init.ts` —— 配置模板与文件权限

## 附：cosmiconfig 是否自带全局配置能力

有，但不满足需求：

| 能力 | 说明 |
|---|---|
| `searchStrategy: 'global'` | 传 `stopDir` 时自动启用，`search()` 向上遍历到 `stopDir`（默认 `os.homedir()`），最后看全局配置目录 |
| `getGlobalConfigDir()` | 内部方法，返回 `env-paths(moduleName, { suffix: '' }).config`，macOS 即 `~/Library/Preferences/gitmars/` |
| `globalConfigSearchPlaces` | 全局目录里查 `config`、`config.json`、`config.yaml` 等，**不是** `.gitmarsrc` |

三个限制：**位置不对**（`~/Library/Preferences/gitmars/config` 而非 `~/.gitmarsrc`）、**文件名不对**（`config*`）、**不合并**（`search()` 命中第一个配置就 return，项目级存在时全局被完全遮蔽，做不到字段级覆盖）。

因此 `getConfig` 的做法是合理的：用 `explorer.search(homedir())` 读全局层，`explorer.search(root)` 读项目层，再 `Object.assign` 浅合并。两处都走 cosmiconfig 的搜索位置，**不硬编码 `.gitmarsrc` 文件名**，支持 `.gitmarsrc.json`、`.gitmarsrc.js` 等全部格式。若改为完全依赖内置 global config 机制，需要迁移全局文件位置并自行处理合并，收益不大，不建议。

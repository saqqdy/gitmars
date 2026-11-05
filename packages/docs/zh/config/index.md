---
sidebar: auto
sidebarDepth: 2
---

# 配置

Gitmars 通过 [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig) 读取配置，
支持其全部配置名与格式：`.gitmarsrc`、`.gitmarsrc.json`、`.gitmarsrc.js`、
`.config/gitmarsrc`，或 `package.json` 中的 `gitmars` 字段。
`.gitmarsrc` 只是约定名称，并非硬编码。

## 两层合并（7.9.0 起）

| 层级 | 搜索位置 | 优先级 |
|---|---|---|
| 全局层 | home 目录 | 基础层 |
| 项目层 | 项目根目录 | **覆盖全局层** |

合并采用浅层 `Object.assign`：项目级顶层字段覆盖全局同名顶层字段。
若要在项目级覆盖 `buildSecret`，需提供完整配置块，不支持只覆盖其中某个字段。

## 示例

```json
{
  "master": "master",
  "develop": "dev",
  "gitHost": "https://gitlab.com",
  "gitID": "1234",
  "apis": {
    "buildConfig": {
      "url": "https://example.com/api/gitmars/getBuildConfig",
      "method": "get",
      "params": { "name": "my-team" }
    },
    "userInfo": { "url": "https://example.com/api/users/getUserInfoByGitName" }
  },
  "buildSecret": {
    "username": "jenkins_username",
    "password": "jenkins_password",
    "miniprogramToken": "",
    "miniprogramSession": "sessionID",
    "gitNotificationGroupUrl": "https://..."
  }
}
```

> `gitID` 是项目专属值，只能放在项目级配置。
> 切勿提交 `buildSecret`，建议文件权限 `0600`。

## 完整参数说明

全部参数参见[基本配置](/zh/guide/basic-config)，包括
[buildSecret](/zh/guide/basic-config#buildsecret) 与
[全局配置与项目配置](/zh/guide/basic-config#全局配置与项目配置)。

从 7.8.0 升级请参考[更新日志](/zh/changelog)。

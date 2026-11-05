## 参数设置

### master

master 分支实际名称

- 类型：`String`
- 默认：`master`
- 必填：是

### develop

develop 分支实际名称

- 类型：`String`
- 默认：`dev`
- 必填：是

### release

release 分支实际名称

- 类型：`String`
- 默认：`release`
- 必填：是

### bugfix

bugfix 分支实际名称

- 类型：`String`
- 默认：`bug`
- 必填：是

### support <!-- <Badge text="已弃用" type="error"/> -->

support 分支实际名称

- 类型：`String`
- 默认：`support`
- 必填：是

### user <!-- <Badge text="已弃用" type="error"/> -->

用户名称

- 类型：`String`
- 默认：``
- 必填：否

### email <!-- <Badge text="已弃用" type="error"/> -->

用户邮箱

- 类型：`String`
- 默认：``
- 必填：否

### nameValidator

> v2.9.4 新增

校验分支命名规范的正则表达式，可输入字符串或者正则

- 类型：`String`,`RegExp`
- 默认：``
- 必填：否
- 示例：

1. 设置正则字符串

```json
{
  "nameValidator": "[a-z]{3,}_w+" // 检验：saqqdy_xxxxxx
}
```

2. 设置正则

```js
{
    nameValidator: /[a-z]{3,}_\w+/, // 检验：saqqdy_xxxxxx
}
```

### descriptionValidator

> v2.11.0 新增

校验本次提交的原因描述，可输入字符串或者正则，如果不需要校验，请保持参数为：''

- 类型：`String`,`RegExp`
- 默认：``
- 必填：否
- 示例：

1. 设置正则字符串

```json
{
  "descriptionValidator": "【修改原因】.+【修改内容】.+" // 检验：【修改原因】10010某个功能有BUG【修改内容】改了某个方法
}
```

2. 设置正则

```js
{
    descriptionValidator: /【修改原因】.+【修改内容】.+/, // 检验：【修改原因】10010某个功能有BUG【修改内容】改了某个方法
}
```

### msgTemplate

推送消息模板

- 类型：`String`
- 默认：`${message}；项目：${project}；路径：${pwd}`
- 必填：否

### msgUrl <!-- <Badge text="已弃用" type="error"/> -->

> 4.0.0 弃用，消息发送地址统一使用 buildConfig 里面的地址

推送消息 API 地址

- 类型：`String`
- 默认：``
- 必填：否

### apolloConfig

apollo 配置参数

- 类型：`Object`
- 默认：``
- 必填：否
- 参数：

```json
{
  "configServerUrl": "",
  "appId": "",
  "clusterName": "default",
  "namespaceName": ["namespaceName"],
  "apolloEnv": "",
  "token": ""
}
```

apollo 构建项目配置参考

```json
{
  "miniprogramDomain": "miniprogram domain",
  "template": "http://www.jenkins.com/view/${line}/job/${project}/build?token=${token}", // 不带参数
  "templateWithParam": "http://www.jenkins.com/view/${line}/job/${project}/buildWithParameters?token=${token}&build_app=${app}", // 带参数
  "dev": {
    "line": "git_dev",
    "schema": "dev_token",
    "list": [
      {
        "name": "project1",
        "project": "git_project1",
        "schema": "" // 这个schema的优先级比上一层的schema高
      },
      {
        "name": "project2",
        "project": "git_project2",
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "小程序" }]
      }
    ]
  },
  "bug": {
    "line": "git_bug",
    "schema": "bug_token",
    "list": [
      {
        "name": "project1",
        "project": "git_project1_bug"
      },
      {
        "name": "project2",
        "project": "egg_project2_bug",
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "小程序" }]
      }
    ]
  },
  "prod": {
    "line": "git_prod",
    "schema": "prod_token",
    "list": [
      {
        "name": "project1",
        "project": "git_project1_prod"
      },
      {
        "name": "project2",
        "project": "git_project2_prod",
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "小程序" }]
      }
    ]
  }
}
```

### buildSecret

> 7.9.0 新增

构建命令使用的敏感数据。这些字段**不再由 `buildConfig` 接口返回**，必须改到
`.gitmarsrc` 中配置。放置位置参见[全局配置与项目配置](#全局配置与项目配置)。

- 类型：`Object`
- 默认：``
- 必填：否
- 字段：

| 字段 | 说明 |
|---|---|
| `username` | Jenkins basic 认证用户名 |
| `password` | Jenkins basic 认证密码 |
| `miniprogramToken` | 小程序接口鉴权 token |
| `miniprogramSession` | 小程序接口会话 cookie |
| `gitNotificationGroupUrl` | 群消息推送 webhook 地址，字符串或数组 |

> 注意：各环境的 Jenkins token **不属于敏感数据**，仍由构建配置接口返回，
> 7.9.0 起字段名从 `token` 改为 `schema`。URL 模板中的 `${token}` 占位符不变。

示例：

```json
{
  "buildSecret": {
    "username": "jenkins_username",
    "password": "jenkins_password",
    "miniprogramToken": "",
    "miniprogramSession": "sessionID",
    "gitNotificationGroupUrl": "https://www.dingding.com/robot/webhook/send?type=0&token=xxxxxxxx"
  }
}
```

请妥善保管该文件（建议权限 `0600`），切勿提交到仓库。

### 全局配置与项目配置

> 7.9.0 新增

配置通过 `cosmiconfig` 的搜索位置发现，支持其全部配置名与格式（`.gitmarsrc`、
`.gitmarsrc.json`、`.gitmarsrc.js`、`.config/gitmarsrc`、`package.json` 中的
`gitmars` 字段等），**不限定** `.gitmarsrc` 文件名。两层合并：

1. 全局层 —— 从 home 目录搜索
2. 项目层 —— 从项目根目录搜索，**覆盖全局层**

合并采用浅层 `Object.assign`：项目级顶层字段覆盖全局同名顶层字段。
若要在项目级覆盖 `buildSecret`，需提供完整配置块，不支持只覆盖其中某个字段。

两层均通过 `cosmiconfig` 读取：全局层从 home 目录 `search()`，项目层从项目根目录 `search()`。

**作用域建议**：`gitID` 等项目专属值只能放在项目级文件；分支名、`gitHost`、
`apis` 等共享的非敏感默认值适合放全局文件。

### hooks

钩子配置

> 1.4.0 新增

- 类型：`Object`
- 默认：``
- 必填：否
- 示例：

```json
{
  "pre-commit": "lint-staged",
  "pre-push": "gitm permission",
  "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
}
```

### apis

接口配置，`buildConfig`用于获取构建配置，优先级高于`apolloConfig`；`userInfo`用于获取用户权限信息，替代`api`

> 2.18.0 新增

- 类型：`Object`
- 默认：``
- 必填：是
- 示例：

```json
{
  "buildConfig": {
    "url": "https://xxx.com/xxx/getBuildConfig",
    "method": "get",
    "params": {
      "name": "gitmars"
    }
  },
  "userInfo": {
    "url": "https://xxx.com/xxx/getUserInfo"
  }
}
```

### api <!-- <Badge text="即将弃用" type="warning"/> -->

请求权限的 api 接口地址，需要支持的接收参数形式：url?name=git_user_name

> 2.0.1 新增<br>
> 2.17.0 新增`level=3`审核员，审核员有合并权限可以执行`admin publish`动作，但是与管理员不同的是审核员提交代码会推送到远程。原开发者调整为 4<br>
> 2.19.0 版本开始移除这项配置，由`apis.userInfo`替代
> 6.0.0 版本开始`token`从git config里面取`user.token`，接口不需要再返回token

- 类型：`String`
- 默认：``
- 必填：否
- 说明：

返回的参数必须包含 `level`，可选返回 `nickname`

```json
{
  "level": 4, // 1=超级管理员 2=管理员 3=审核员 4=开发者
  "nickname": ""
}
```

### gitHost

git 服务器位置，例如：https://gitlab.com

> 2.0.1 新增

- 类型：`String`
- 默认：``
- 必填：是

### gitID

git 项目 ID，在 gitlab 上可以查到，通常是一串数字

> 2.0.1 新增

- 类型：`Number`
- 默认：``
- 必填：是

### versionControlType

版本控制类型，如果希望强制更新所有新版本，传入`patch`，如果不需要控制，传入 `false`

> 5.0.0 新增

- 类型：`'major' | 'minor' | 'patch'`
- 默认：`minor`
- 必填：否

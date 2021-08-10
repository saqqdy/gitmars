## 参数设置

### master

master 分支实际名称

-   类型：`String`
-   默认：`master`
-   必填：是

### develop

develop 分支实际名称

-   类型：`String`
-   默认：`dev`
-   必填：是

### release

release 分支实际名称

-   类型：`String`
-   默认：`release`
-   必填：是

### bugfix

bugfix 分支实际名称

-   类型：`String`
-   默认：`bug`
-   必填：是

### support <Badge text="已弃用" type="error"/>

support 分支实际名称

-   类型：`String`
-   默认：`support`
-   必填：是

### user

用户名称

-   类型：`String`
-   默认：``
-   必填：否

### email

用户邮箱

-   类型：`String`
-   默认：``
-   必填：否

### msgTemplate

推送消息模板

-   类型：`String`
-   默认：`${message}；项目：${project}；路径：${pwd}`
-   必填：否

### msgUrl

推送消息 API 地址

-   类型：`String`
-   默认：``
-   必填：否

### apolloConfig

apollo 配置参数

-   类型：`Object`
-   默认：``
-   必填：否
-   参数：

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
	"username": "jerkins_username",
	"password": "jerkins_password",
	"template": "http://www.jerkins.com/view/${line}/job/${project}/build?token=${token}", // 不带参数
	"templateWithParam": "http://www.jerkins.com/view/${line}/job/${project}/buildWithParameters?token=${token}&build_app=${app}", // 带参数
	"gitNotificationGroupUrl": "https://www.dingding.com/robot/webhook/send?type=0&token=xxxxxxxx", // 推送群消息的api
	"dev": {
		"line": "git_dev",
		"token": "dev_token",
		"list": [
			{
				"name": "project1",
				"project": "git_project1"
			},
			{
				"name": "project2",
				"project": "git_project2",
				"apps": ["all", "admin", "client"]
			},
		]
	},
	"bug": {
		"line": "git_bug",
		"token": "bug_token",
		"list": [
			{
				"name": "project1",
				"project": "git_project1_bug"
			},
			{
				"name": "project2",
				"project": "egg_project2_bug",
				"apps": ["all", "admin", "client"]
			},
		]
	},
	"prod": {
		"line": "git_prod",
		"token": "prod_token",
		"list": [
			{
				"name": "project1",
				"project": "git_project1_prod"
			},
			{
				"name": "project2",
				"project": "git_project2_prod",
				"apps": ["all", "admin", "client"]
			},
		]
	}
}

```

### hooks

钩子配置

> 1.4.0 新增

-   类型：`Object`
-   默认：``
-   必填：否
-   示例：

```json
{
    "pre-commit": "lint-staged",
    "pre-push": "gitm permission",
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
}
```

### api

请求权限的api接口地址，需要支持的接收参数形式：url?name=git_user_name

> 2.0.1 新增

-   类型：`String`
-   默认：``
-   必填：否
-   说明：

返回的参数必须包含token和level

```json
{
    token: 'gitlab access_token', // gitlab上生成的access_token
    level: 3 // 1=超级管理员 2=管理员 3=开发者
}
```


### gitHost

git服务器位置，例如：https://gitlab.com

> 2.0.1 新增

-   类型：`String`
-   默认：``
-   必填：是


### gitID

git项目ID，在gitlab上可以查到，通常是一串数字

> 2.0.1 新增

-   类型：`Number`
-   默认：``
-   必填：是

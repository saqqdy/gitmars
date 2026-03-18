## Parameter Settings

### master

Actual name of master branch

- Type: `String`
- Default: `master`
- Required: Yes

### develop

Actual name of develop branch

- Type: `String`
- Default: `dev`
- Required: Yes

### release

Actual name of release branch

- Type: `String`
- Default: `release`
- Required: Yes

### bugfix

Actual name of bugfix branch

- Type: `String`
- Default: `bug`
- Required: Yes

### support <!-- <Badge text="Deprecated" type="error"/> -->

Actual name of support branch

- Type: `String`
- Default: `support`
- Required: Yes

### user <!-- <Badge text="Deprecated" type="error"/> -->

Username

- Type: `String`
- Default: ``
- Required: No

### email <!-- <Badge text="Deprecated" type="error"/> -->

User email

- Type: `String`
- Default: ``
- Required: No

### nameValidator

> Added in v2.9.4

Regular expression for branch naming validation, can be string or regex

- Type: `String`, `RegExp`
- Default: ``
- Required: No
- Example:

1. Set regex string

```json
{
  "nameValidator": "[a-z]{3,}_w+" // Validates: saqqdy_xxxxxx
}
```

2. Set regex

```js
{
    nameValidator: /[a-z]{3,}_\w+/, // Validates: saqqdy_xxxxxx
}
```

### descriptionValidator

> Added in v2.11.0

Regular expression for commit reason description validation, can be string or regex. If validation is not needed, keep parameter as: ''

- Type: `String`, `RegExp`
- Default: ``
- Required: No
- Example:

1. Set regex string

```json
{
  "descriptionValidator": "【Reason】.+【Content】.+" // Validates: 【Reason】10010 some feature has BUG【Content】fixed some method
}
```

2. Set regex

```js
{
    descriptionValidator: /【Reason】.+【Content】.+/, // Validates: 【Reason】10010 some feature has BUG【Content】fixed some method
}
```

### msgTemplate

Push message template

- Type: `String`
- Default: `${message}; Project: ${project}; Path: ${pwd}`
- Required: No

### msgUrl <!-- <Badge text="Deprecated" type="error"/> -->

> Deprecated in 4.0.0, message send address now uses buildConfig address

Push message API address

- Type: `String`
- Default: ``
- Required: No

### apolloConfig

Apollo configuration parameters

- Type: `Object`
- Default: ``
- Required: No
- Parameters:

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

Apollo build project config reference

```json
{
  "username": "jenkins_username",
  "password": "jenkins_password",
  "miniprogramDomain": "miniprogram domain",
  "miniprogramToken": "miniprogram token",
  "miniprogramSession": "sessionID",
  "template": "http://www.jenkins.com/view/${line}/job/${project}/build?token=${token}", // without parameters
  "templateWithParam": "http://www.jenkins.com/view/${line}/job/${project}/buildWithParameters?token=${token}&build_app=${app}", // with parameters
  "gitNotificationGroupUrl": "https://www.dingding.com/robot/webhook/send?type=0&token=xxxxxxxx", // API for pushing group messages
  "dev": {
    "line": "git_dev",
    "token": "dev_token",
    "list": [
      {
        "name": "project1",
        "project": "git_project1",
        "token": "" // This token has higher priority than the token above
      },
      {
        "name": "project2",
        "project": "git_project2",
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "miniprogram" }]
      }
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
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "miniprogram" }]
      }
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
        "apps": ["all", "admin", "client"],
        "miniprogram": [{ "id": "id", "name": "miniprogram" }]
      }
    ]
  }
}
```

### hooks

Hook configuration

> Added in v1.4.0

- Type: `Object`
- Default: ``
- Required: No
- Example:

```json
{
  "pre-commit": "lint-staged",
  "pre-push": "gitm permission",
  "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
}
```

### apis

API configuration. `buildConfig` is used to get build config, higher priority than `apolloConfig`; `userInfo` is used to get user permission info, replacing `api`

> Added in v2.18.0

- Type: `Object`
- Default: ``
- Required: Yes
- Example:

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

### api <!-- <Badge text="Deprecating" type="warning"/> -->

API interface address for requesting permissions. Needs to support receiving parameters in the form: url?name=git_user_name

> Added in v2.0.1<br>
> Added `level=3` reviewer in v2.17.0, reviewers have merge permission and can execute `admin publish`, but unlike admins, reviewers push code to remote. Developer permission adjusted to 4<br>
> Removed in v2.19.0, replaced by `apis.userInfo`<br>
> From v6.0.0, `token` is read from git config `user.token`, API no longer needs to return token

- Type: `String`
- Default: ``
- Required: No
- Description:

Response must include `level`, optionally return `nickname`

```json
{
  "level": 4, // 1=Super Admin 2=Admin 3=Reviewer 4=Developer
  "nickname": ""
}
```

### gitHost

Git server location, e.g.: https://gitlab.com

> Added in v2.0.1

- Type: `String`
- Default: ``
- Required: Yes

### gitID

Git project ID, found on GitLab, usually a number

> Added in v2.0.1

- Type: `Number`
- Default: ``
- Required: Yes

### versionControlType

Version control type. Pass `patch` if you want to force update all new versions, pass `false` if no control needed

> Added in v5.0.0

- Type: `'major' | 'minor' | 'patch'`
- Default: `minor`
- Required: No

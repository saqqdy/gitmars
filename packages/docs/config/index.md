---
sidebar: auto
sidebarDepth: 2
---

# Configuration

Gitmars reads its config through [`cosmiconfig`](https://github.com/cosmiconfig/cosmiconfig),
so any supported config filename/format works — `.gitmarsrc`, `.gitmarsrc.json`,
`.gitmarsrc.js`, `.config/gitmarsrc`, or a `gitmars` field in `package.json`.
The name `.gitmarsrc` is conventional, not hardcoded.

## Two merged layers (v7.9.0+)

| Layer | Search from | Priority |
|---|---|---|
| Global | home directory | base |
| Project | project root | **overrides global** |

The merge is a shallow `Object.assign`: project-level top-level keys replace global
ones of the same name. To override `buildSecret` in a project, provide the complete
block — overriding a single nested field is not supported.

## Quick example

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

> `gitID` is per-project — keep it in the project-level config only.
> Never commit `buildSecret`; recommended file mode is `0600`.

## Full reference

See [Basic Config](/guide/basic-config) for every parameter, including
[buildSecret](/guide/basic-config#buildsecret) and
[Global and project config](/guide/basic-config#global-and-project-config).

Upgrading from 7.8.0? See the [changelog](/changelog).

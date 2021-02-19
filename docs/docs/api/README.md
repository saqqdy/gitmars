---
sidebar: auto
sidebarDepth: 2
---

# API 参考

## 智能导航

### gitm go <Badge text="beta" type="warning"/>

智能导航指令，只记一条指令就能完成所有功能使用

-   使用：`gitm go`
-   演示：
    > ![gitmars-go.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/gitmars-go.gif)

## 工作流

:::tip
创建周四任务分支(release)、日常更新 BUG 分支(bugfix)这两种类型的分支、项目框架相关的 support 分支
:::

### gitm start

#### 短指令：gitm st

开始任务，创建分支

-   使用：`gitm start <type> <name>`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | feature/bugfix/support | 是   | -    |
| name | 分支名称 | String | -                      | 是   | -    |

-   示例：

```shell
# start bugfix branch
gitm start bugfix 20001
# start feature brancg
gitm start feature 1001
```

### gitm combine

#### 短指令：gitm cb

bugfix 分支和 feature 分支需要提交到 dev 或者预发布环境时使用 combine 指令来自动执行合并

-   使用：`gitm combine [type] [name] [-a --add] [-m --commit [message]] [-d --dev] [-p --prod] [-b --build [build]] [--no-bugfix] [--as-feature]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

-   传值：

| 名称         | 简写 | 说明                                                       | 类型    | 可选值  | 传值必填 | 默认  |
| ------------ | ---- | ---------------------------------------------------------- | ------- | ------- | -------- | ----- |
| --add        | -a   | 是否需要执行 add                                           | Boolean | -       | -        | false |
| --commit     | -m   | 是否需要执行 commit，需要填写 message                      | String  | -       | 是       | ''    |
| --dev        | -d   | 是否同步到 dev，与--prod 两者必传一个                      | Boolean | -       | -        | false |
| --prod       | -p   | 是否同步到 prod，与--dev 两者必传一个                      | Boolean | -       | -        | false |
| --build      | -b   | 需要构建的应用                                             | String  | all/... | 否       | all   |
| --no-bugfix  |      | 是否不同步到 bug 分支，这个参数仅对 support 分支有效       | Boolean | -       | -        | false |
| --as-feature |      | bugfix 分支需要合并到 release 时使用，仅对 bugfix 分支有效 | Boolean | -       | -        | false |

-   示例：

1. 合并当前分支到 alpha

```shell
gitm combine -d
# or
gitm cb -d
```

2. 合并当前分支到 alpha 并构建

```shell
gitm combine -d -b
# or
gitm combine -d --build all
# or
gitm cb -d -b cloud-ui
```

3. 合并 bugfix/20001 分支到 alpha 和 prod

```shell
gitm combine bugfix 20001 -pd
# or
gitm cb bugfix 20001 -pd
# or
gitm cb 20001 -d
```

4. bugfix 分支特殊情况需要合并到 release 时，传入--as-feature

```shell
gitm combine bugfix 20001 -p --as-feature
# or
gitm cb -p --as-feature
```

5. support 分支提交 prod 时会主动同步 bugfix 分支和 release 分支，传入--no-bugfix 不同步到 bugfix

```shell
gitm combine support 20001 -pd --no-bugfix
# or
gitm cb -pd --no-bugfix
```

### gitm end

#### 短指令：gitm ed

任务完成，合并并删除分支，这个操作会把 20001 这个分支代码合并到 bug 分支并删除 20001 分支

-   使用：`gitm end [type] [name]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

-   示例：

1. 结束 bugfix/20001 分支

```shell
gitm end bugfix 20001
# or
gitm ed bugfix 20001
```

2. 结束当前分支

```shell
gitm end
# or
gitm ed
```

### gitm update

#### 短指令：gitm up

把 bug 分支的最新代码同步到 20001 分支上（--use-merge 使用 merge 方法合并，默认 false）

-   使用：`gitm update [type] [name] [--use-merge]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

-   传值：

| 名称        | 简写 | 说明                        | 类型    | 可选值 | 传值必填 | 默认  |
| ----------- | ---- | --------------------------- | ------- | ------ | -------- | ----- |
| --use-merge |      | 是否使用 merge 方式更新代码 | Boolean | -      | -        | false |

-   示例：

1. 升级 bugfix/20001 分支

```shell
gitm update bugfix 20001
# or
gitm up bugfix 20001
```

2. 使用 merge 方法升级当前分支

```shell
gitm update --use-merge
# or
gitm up --use-merge
```

## 效率

### gitm merge

#### 短指令：gitm mg

合并分支，类似 git merge 功能

-   使用：`gitm merge <name>`
-   参数：

| 参数 | 说明       | 类型   | 可选值 | 必填 | 默认 |
| ---- | ---------- | ------ | ------ | ---- | ---- |
| name | merge 来源 | String | -      | 是   | -    |

-   示例：

合并 20001 分支到当前分支

```shell
gitm merge 20001
# or
gitm mg 20001
```

### gitm copy

#### 短指令：gitm cp

复制其他分支上的提交记录到当前分支

-   使用：`gitm copy <from> [commitid...]` 或者 `gitm copy <from> [-k --key] [-a --author]`
-   参数：

| 参数     | 说明                                        | 类型   | 可选值 | 必填 | 默认 |
| -------- | ------------------------------------------- | ------ | ------ | ---- | ---- |
| from     | 需要 copy 的来源分支                        | String | -      | 是   | -    |
| commitid | 需要 copy 的 commitID，可传入多个，空格隔开 | String | -      | 否   | -    |

-   传值：

| 名称     | 简写 | 说明                 | 类型   | 可选值 | 传值必填 | 默认 |
| -------- | ---- | -------------------- | ------ | ------ | -------- | ---- |
| --key    | -k   | 模糊匹配的查询关键词 | String | -      | 否       | -    |
| --author | -a   | 查询提交的用户名     | String | -      | 否       | -    |

-   示例：

1. 传入 commit-id，把其他分支上的 commit-id 复制过来，执行下面指令

```shell
gitm copy feature/test xxxxxx xxxxxx xxxxxx
```

2. 传入查询关键词，gitm 会根据提供的关键词（为确保 copy 准确，请尽量完整填写关键词），在对应分支的提交记录里面搜索提交记录并自动执行 copy 指令

```shell
gitm copy dev --key 100000 --author saqqdy
```

### gitm build

#### 短指令：gitm bd

该指令用于发起 Jenkins 构建，project 必传，app 名称可传入 all

-   使用：`gitm build <project> [-e --env [env]] [-a --app [app]]`
-   参数：

| 参数    | 说明           | 类型   | 可选值 | 必填 | 默认 |
| ------- | -------------- | ------ | ------ | ---- | ---- |
| project | 需要构建的项目 | String | -      | 是   | -    |

-   传值：

| 名称  | 简写 | 说明             | 类型   | 可选值       | 传值必填 | 默认 |
| ----- | ---- | ---------------- | ------ | ------------ | -------- | ---- |
| --env | -e   | 要构建的环境     | String | dev/prod/bug | 是       | -    |
| --app | -a   | 需要构建的子项目 | String | -            | 否       | all  |

-   示例：

1. 构建 wyweb 的 cloud-ui 应用

```shell
gitm build wyweb --env dev --app cloud-ui
```

### gitm branch

#### 短指令：gitm bh

提供分支搜索和删除功能（不开放删除远程分支功能）

-   使用：`gitm branch [-k --key] [-t --type] [-r --remote]` 或者 `gitm branch [-d --delete [name]] [-D --forcedelete [name]]` 或者 `gitm branch [-u --upstream [upstream]]`
-   传值：

| 名称          | 简写 | 说明                                           | 类型    | 可选值                 | 传值必填 | 默认  |
| ------------- | ---- | ---------------------------------------------- | ------- | ---------------------- | -------- | ----- |
| --key         | -k   | 模糊匹配关键词                                 | String  | -                      | 否       | -     |
| --type        | -t   | 分支类型，默认查询全部                         | String  | bugfix/feature/support | 否       | -     |
| --remote      | -r   | 是否查询远程分支                               | Boolean | -                      | 否       | false |
| --delete      | -d   | 删除本地分支                                   | String  | -                      | 是       | -     |
| --forcedelete | -D   | 强制删除本地分支                               | String  | -                      | 是       | -     |
| --upstream    | -u   | 传入分支名称可绑定分支，不传分支名称则取消绑定 | String  | -                      | 否       | ''    |

-   示例：

1. 查询本地 feature 功能分支

```shell
# 形式：gitm branch [-k --key] [-t --type] [-r --remote]
gitm branch --key bug001 -r -t feature
# or
gitm bh -k bug001 -r -t feature
```

2. 删除本地分支

```shell
# 形式：gitm branch [-d --delete] [-D --forcedelete]
gitm branch -d bugfix/bug001
# or
gitm bh -d bugfix/bug001
```

3. 设置当前分支与远程 feature/1000 分支关联

```shell
# 形式：gitm branch [-u --upstream [upstream]]
gitm branch -u feature/1000
```

4. 取消当前分支与远程分支的关联

```shell
gitm branch -u
```

### gitm revert

#### 短指令：gitm rt

撤销当前分支的某条提交记录，如果需要撤销一条 merge 记录，需要传入撤销方式，1 = 保留当前分支代码；2 = 保留传入代码

-   使用：`gitm revert [commitid] [-m --mode [mode]]` 或者 `gitm revert [-n --number] [-m --mode [mode]]`
-   参数：

| 参数     | 说明        | 类型   | 可选值 | 必填 | 默认 |
| -------- | ----------- | ------ | ------ | ---- | ---- |
| commitid | 要撤回的 id | String | -      | 否   | -    |

-   传值：

| 名称     | 简写 | 说明                                                                  | 类型   | 可选值 | 传值必填 | 默认  |
| -------- | ---- | --------------------------------------------------------------------- | ------ | ------ | -------- | ----- |
| --number | -n   | 撤回倒数 N 条记录，使用时不要传入 commitID                            | Number | -      | 否       | false |
| --mode   | -m   | 撤回 merge 记录时需要保留哪一方的代码，1=保留当前分支，2=保留传入分支 | Number | -      | 否       | -     |

-   示例：

1. 撤销最后一次提交（或者撤销倒数第 n 次提交）

```shell
# 形式：gitm revert [-n --number] [-m --mode [mode]]
gitm revert -n 3
# or
gitm rt -n 3
```

2. 撤销某条提交 id

```shell
# 形式：gitm revert [commitid] [-m --mode [mode]]
gitm revert xxxxxx --mode 1
# or
gitm rt xxxxxx -m 1
```

### gitm save

#### 短指令：gitm sv

暂存当前分支代码

-   使用：`gitm save [message] [-f --force]`
-   参数：

| 参数    | 说明                                                     | 类型   | 可选值 | 必填 | 默认           |
| ------- | -------------------------------------------------------- | ------ | ------ | ---- | -------------- |
| message | stash 的标记信息，默认会存入当前分支名称作为暂存标记信息 | String | -      | 否   | 当前分支的名称 |

-   传值：

| 名称    | 简写 | 说明                                              | 类型    | 可选值 | 传值必填 | 默认  |
| ------- | ---- | ------------------------------------------------- | ------- | ------ | -------- | ----- |
| --force | -f   | 是否需要把没有加入版本的文件执行 add 之后暂存起来 | Boolean | -      | 否       | false |

-   示例：

1. 简单使用

```shell
gitm save
# or
gitm sv
```

2. 暂存没有加入版本控制的文件

```shell
gitm save --force
# or
gitm save -f
```

3. 设置自定义暂存信息，方便取出

```shell
gitm save feature/1000
# or
gitm save "test login"
```

### gitm get

#### 短指令：gitm gt

恢复暂存代码

-   使用：`gitm get [message] [index] [-k --keep]`
-   参数：

| 参数    | 说明                                                     | 类型   | 可选值 | 必填 | 默认           |
| ------- | -------------------------------------------------------- | ------ | ------ | ---- | -------------- |
| message | stash 的标记信息，默认会存入当前分支名称作为暂存标记信息 | String | -      | 否   | 当前分支的名称 |
| index   | 需要恢复的序号，存在多条记录时默认恢复最近的一条记录     | Number | -      | 否   | 0              |

-   传值：

| 名称   | 简写 | 说明                     | 类型    | 可选值 | 传值必填 | 默认  |
| ------ | ---- | ------------------------ | ------- | ------ | -------- | ----- |
| --keep | -k   | 是否需要保留暂存区的记录 | Boolean | -      | 否       | false |

-   示例：

1. 简单使用

```shell
gitm get
# or
gitm gt
```

2. 恢复 feature/1000 分支的暂存记录到当前分支，取第 2 条记录(index 不传默认取第 1 条记录：0)

```shell
gitm get feature/1000 1
```

3. 恢复时不删除暂存区数据

```shell
gitm get --keep
# or
gitm get -k
```

4. 恢复暂存信息为“test login”的暂存记录

```shell
gitm get "test login"
```

### gitm hook

> 1.4.0 新增

发布操作

-   使用：`gitm admin publish <type> [-c --combine] [--use-rebase] [-p --prod] [-b --build [build]] [-p --postmsg]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support | 是   | -    |

-   传值：

| 名称      | 简写 | 说明                                                                         | 类型    | 可选值 | 传值必填 | 默认  |
| --------- | ---- | ---------------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --combine | -c   | 是否在合并 release 之后会把 release 同步到 bugfix（仅在合并 release 时可用） | Boolean | -      | 否       | false |

-   示例：

1. 合并 release 代码到预发环境

```shell
gitm admin publish release
```

### gitm run

> 1.4.0 新增

::: tip
内部方法，仅支持程序内部使用
:::

run 指令是 gitmars hook 里面执行的内部指令，用来执行钩子方法

-   使用：`gitm run <hookName> [args...]`
-   参数：

| 参数     | 说明     | 类型   | 可选值 | 必填 | 默认 |
| -------- | -------- | ------ | ------ | ---- | ---- |
| hookName | 钩子名称 | String |        | 是   | -    |

-   传值：

| 名称      | 简写 | 说明                                                                         | 类型    | 可选值 | 传值必填 | 默认  |
| --------- | ---- | ---------------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --combine | -c   | 是否在合并 release 之后会把 release 同步到 bugfix（仅在合并 release 时可用） | Boolean | -      | 否       | false |

-   示例：

1. 合并 release 代码到预发环境

```shell
gitm admin publish release
```

### gitm upgrade

#### 短指令：gitm ug

升级 gitmars 版本，可输入 version 指定版本，选填，默认安装最新版

-   使用：`gitm upgrade [version] [-m --mirror]`
-   参数：

| 参数    | 说明           | 类型   | 可选值 | 必填 | 默认 |
| ------- | -------------- | ------ | ------ | ---- | ---- |
| version | 要升级的版本号 | String | -      | 否   | -    |

-   传值：

| 名称     | 简写 | 说明                 | 类型    | 可选值 | 传值必填 | 默认  |
| -------- | ---- | -------------------- | ------- | ------ | -------- | ----- |
| --mirror | -m   | 是否使用淘宝镜像升级 | Boolean | -      | 否       | false |

-   示例：

1. 简单使用

```shell
gitm upgrade --mirror
# or
gitm ug -m
```

### gitm clean

清理 gitmars 缓存和本地配置，输入--force 同时清理本地配置文件（慎用）

```shell
形式：gitm clean [-f --force]
```

-   传值：

| 名称    | 简写 | 说明                                    | 类型    | 可选值 | 传值必填 | 默认  |
| ------- | ---- | --------------------------------------- | ------- | ------ | -------- | ----- |
| --force | -f   | 是否清理 gitmars 配置文件（请谨慎使用） | Boolean | -      | 否       | false |

-   示例：

```shell
gitm clean
```

### gitm link

创建本地包软链接

-   使用：`gitm link <name> <path>`
-   参数：

| 参数 | 说明           | 类型   | 可选值 | 必填 | 默认 |
| ---- | -------------- | ------ | ------ | ---- | ---- |
| name | 包名称         | String | -      | 是   | -    |
| path | 包本地绝对路径 | String | -      | 是   | -    |

-   示例：

```shell
gitm link tool /Users/saqqdy/www/wojiayun/tool
```

### gitm unlink

解除本地包软链接

-   使用：`gitm unlink <name>`
-   参数：

| 参数 | 说明   | 类型   | 可选值 | 必填 | 默认 |
| ---- | ------ | ------ | ------ | ---- | ---- |
| name | 包名称 | String | -      | 是   | -    |

-   示例：

```shell
gitm unlink tool
```

### gitm postmsg

推送消息

-   使用：`gitm postmsg <message>`
-   参数：

| 参数    | 说明     | 类型   | 可选值 | 必填 | 默认 |
| ------- | -------- | ------ | ------ | ---- | ---- |
| message | 消息内容 | String | -      | 是   | -    |

-   示例：

```shell
gitm postmsg "测试消息"
```

## 管理员

### gitm admin create

创建 release、bugfix、support 和 develop 分支

-   使用：`gitm admin create <type>`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/develop | 是   | -    |

-   示例：

创建 release 分支

```shell
gitm admin create release
```

### gitm admin publish

发布操作

-   使用：`gitm admin publish <type> [-c --combine] [--use-rebase] [-p --prod] [-b --build [build]] [-p --postmsg]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support | 是   | -    |

-   传值：

| 名称         | 简写 | 说明                                                                         | 类型    | 可选值 | 传值必填 | 默认  |
| ------------ | ---- | ---------------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --combine    | -c   | 是否在合并 release 之后会把 release 同步到 bugfix（仅在合并 release 时可用） | Boolean | -      | 否       | false |
| --prod       | -p   | 发布 bugfix 时，是否需要把 bugfix 合并到 master                              | Boolean | -      | 否       | false |
| --build      | -b   | 是否使用淘宝镜像升级                                                         | Boolean | -      | 否       | false |
| --use-rebase |      | 是否使用 rebase 执行合并                                                     | Boolean | -      | 否       | false |
| --postmsg    | -p   | 是否需要发送指令处理消息到云之家                                             | Boolean | -      | 否       | false |

-   示例：

1. 合并 release 代码到预发环境

```shell
gitm admin publish release
```

2. 发布并执行构建

```shell
# 构建全部
gitm admin publish release --build
# or
gitm admin publish release -b
# 仅构建cloud-ui
gitm admin publish release --build cloud-ui
# or
gitm admin publish release -b cloud-ui
```

### gitm admin update

更新 release、bugfix、support 分支代码，默认走 merge 方法

-   使用：`gitm admin update <type> [--use-rebase] [-m --mode [mode]] [-p --postmsg]`
-   参数：

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support | 是   | -    |

-   传值：

| 名称         | 简写 | 说明                                                                                                                  | 类型    | 可选值 | 传值必填 | 默认  |
| ------------ | ---- | --------------------------------------------------------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --mode       | -m   | 出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase 同时使用 | Number  | 0/1/2  | 否       | 0     |
| --use-rebase |      | 是否使用 rebase 执行同步                                                                                              | Boolean | -      | 否       | false |
| --postmsg    | -p   | 是否需要发送指令处理消息到云之家                                                                                      | Boolean | -      | 否       | false |

-   示例：

1. 更新 bug 分支代码

```shell
gitm admin update bugfix -m 2
# or
gitm admin up bugfix -m 2
```

### gitm admin clean

Jenkins 构建清理 git 分支专用，可传入 release、bugfix、develop 分支代码

-   使用：`gitm admin clean <type>`
-   参数：

| 参数 | 说明     | 类型   | 可选值                        | 必填 | 默认 |
| ---- | -------- | ------ | ----------------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support/master | 是   | -    |

-   示例：

清理分支

```shell
gitm admin clean bugfix
```

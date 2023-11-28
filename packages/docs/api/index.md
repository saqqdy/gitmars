---
sidebar: auto
sidebarDepth: 2
---

# API 参考

## 智能导航

### gitm go

智能导航指令，只记一条指令就能完成所有功能使用

- 使用：`gitm go`
- 参数：

<div class="table-prop">

| 参数    | 说明     | 类型     | 可选值                                                                                                                                                                                                                      | 必填 | 默认 |
| ------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ---- |
| command | 指令名称 | `String` | combine、end、update、build、start、undo、redo、suggest、approve、review、admin.publish、admin.update、admin.create、admin.clean、admin.approve、branch、copy、get、save、cleanbranch、clean、revert、link、unlink、postmsg | 否   | -    |

</div>

- 示例：

```shell
gitm go build
```

- 演示：

  > ![gitmars-go.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-go.gif)

## 配置

### gitm init

初始化配置，按照提示输入即可

- 使用：`gitm init`
- 参考：[配置参数](../guide/basic-config)

### gitm config

配置查询与设置

#### 设置单个配置

- 使用：`gitm config <option> [value]`
- 参数：

<div class="table-prop">

| 参数   | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------ | -------- | -------- | ------ | ---- | ---- |
| option | 配置名称 | `String` | -      | 是   | -    |
| value  | 配置值   | `String` | -      | 否   | -    |

</div>

- 示例：

1. 设置 master 分支名称为 main

```shell
gitm config master main
```

2. 设置 apollo 配置(json)

```shell
gitm config apolloConfig "{ ... }"
```

#### 查询配置

- 使用：`gitm config list [option]`
- 参数：

<div class="table-prop">

| 参数   | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------ | -------- | -------- | ------ | ---- | ---- |
| option | 配置名称 | `String` | -      | 否   | -    |

</div>

- 示例：

1. 查询全部配置

```shell
gitm config list
```

2. 查询 apollo 配置

```shell
gitm config list apolloConfig
```

## 工作流

:::tip
创建周四任务分支(release)、日常更新 BUG 分支(bugfix)这两种类型的分支、项目框架相关的 support 分支
:::

### gitm start

#### 短指令：gitm st

开始任务，创建分支

- 使用：`gitm start <type> <name> [-t --tag <tag>]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认 |
| ---- | -------- | -------- | ---------------------- | ---- | ---- |
| type | 分支类型 | `String` | feature/bugfix/support | 是   | -    |
| name | 分支名称 | `String` | -                      | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称  | 简写 | 说明            | 类型     | 可选值 | 传值必填 | 默认 |
| ----- | ---- | --------------- | -------- | ------ | -------- | ---- |
| --tag | -t   | 从 tag 创建分支 | `String` | -      | `true`   | ''   |

</div>

- 示例：

1. 创建主流程分支

```shell
# start bugfix branch
gitm start bugfix 20001
# start feature brancg
gitm start feature 1001
```

2. 从 tag 创建 bugfix 分支

```shell
# tag 20211010
gitm start bugfix 1001 --tag 20211010
```

### gitm combine

#### 短指令：gitm cb

> v2.11.0 新增`--description`传参
> v5.3.0 增加data传值，支持传入额外的参数

bugfix 分支和 feature 分支需要提交到 dev 或者预发布环境时使用 combine 指令来自动执行合并

- 使用：`gitm combine [type] [name] [-a --add] [-m --commit [message]] [-d --dev] [-p --prod] [-b --build [build]] [--data <data>] [--description [description]] [--no-bugfix] [--as-feature] [-f --force]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认         |
| ---- | -------- | -------- | ---------------------- | ---- | ------------ |
| type | 分支类型 | `String` | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | `String` | -                      | 否   | 当前分支名称 |

</div>

- 传值：

<div class="table-option">

| 名称          | 简写 | 说明                                                       | 类型      | 可选值  | 传值必填 | 默认    |
| ------------- | ---- | ---------------------------------------------------------- | --------- | ------- | -------- | ------- |
| --add         | -a   | 是否需要执行 add                                           | `Boolean` | -       | -        | `false` |
| --commit      | -m   | 是否需要执行 commit，需要填写 message                      | `String`  | -       | 是       | ''      |
| --description |      | 本次提交的原因描述                                         | `String`  | -       | 否       | ''      |
| --dev         | -d   | 是否同步到 dev，与--prod 两者必传一个                      | `Boolean` | -       | -        | `false` |
| --prod        | -p   | 是否同步到 prod，与--dev 两者必传一个                      | `Boolean` | -       | -        | `false` |
| --build       | -b   | 需要构建的应用                                             | `String`  | all/... | 否       | `all`   |
| --no-bugfix   |      | 是否不同步到 bug 分支，这个参数仅对 support 分支有效       | `Boolean` | -       | -        | `false` |
| --as-feature  |      | bugfix 分支需要合并到 release 时使用，仅对 bugfix 分支有效 | `Boolean` | -       | -        | `false` |
| --force       | -f   | 是否强制发起合并请求                                       | `Boolean` | -       | -        | `false` |
| --data        |      | 需要传输的其他数据，传入JSON字符串                         | `String`  | -       | 否       | '{}'    |

</div>

- 示例：

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
gitm cb -d -b gitmars
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

6. 传入其他构建参数

```shell
gitm combine -b --data '{"app_id":"xxxxxx"}'
```

### gitm end

#### 短指令：gitm ed

> v2.9.6 版本开始，`end`指令智能判断是否需要合并代码，不传`--no-combine`时，不需要合并的时候不会发起合并操作<br/>
> v2.11.0 新增`--description`传参

任务完成，合并并删除分支，这个操作会把 20001 这个分支代码合并到 bug 分支并删除 20001 分支(远程的 20001 分支也会同步删除)

- 使用：`gitm end [type] [name] [--description [description]] [--no-combine] [--as-feature]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认         |
| ---- | -------- | -------- | ---------------------- | ---- | ------------ |
| type | 分支类型 | `String` | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | `String` | -                      | 否   | 当前分支名称 |

</div>

- 传值：

<div class="table-option">

| 名称          | 简写 | 说明                                 | 类型      | 可选值 | 传值必填 | 默认    |
| ------------- | ---- | ------------------------------------ | --------- | ------ | -------- | ------- |
| --no-combine  |      | 不合并主干分支（请确保分支已经上线） | `Boolean` | -      | -        | `false` |
| --as-feature  |      | bugfix 类型的分支合并到 release      | `Boolean` | -      | -        | `false` |
| --description |      | 本次提交的原因描述                   | `String`  | -      | 否       | ''      |

</div>

- 示例：

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
# 结束但不合并代码
gitm end --no-combine
# 以feature方式合并
gitm end --as-feature
```

### gitm update

#### 短指令：gitm up

把 bug 分支的最新代码同步到 20001 分支上（--use-rebase 使用 rebase 方法合并，默认 false）

- 使用：`gitm update [type] [name] [--use-merge] [--use-rebase] [-a --all] [-f --force]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认         |
| ---- | -------- | -------- | ---------------------- | ---- | ------------ |
| type | 分支类型 | `String` | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | `String` | -                      | 否   | 当前分支名称 |

</div>

- 传值：

<div class="table-option">

| 名称         | 简写 | 说明                                  | 类型      | 可选值 | 传值必填 | 默认    |
| ------------ | ---- | ------------------------------------- | --------- | ------ | -------- | ------- |
| --use-merge  |      | 是否使用 merge 方式更新代码(准备弃用) | `Boolean` | -      | -        | `true`  |
| --use-rebase |      | 是否使用 rebase 方式更新代码          | `Boolean` | -      | -        | `false` |
| --all        | -a   | 是否更新本地所有开发分支              | `Boolean` | -      | -        | `false` |
| --force      | -f   | 是否强制发起合并请求                  | `Boolean` | -      | -        | `false` |

</div>

- 示例：

1. 升级 bugfix/20001 分支

```shell
gitm update bugfix 20001
# or
gitm up bugfix 20001
```

2. 使用 rebase 方法升级当前分支

```shell
gitm update --use-rebase
# or
gitm up --use-rebase
```

3. 升级本地所有开发分支

```shell
gitm update --all
# or
gitm up -a
```

4. 升级本地所有 feature 分支

```shell
gitm update feature --all
# or
gitm up feature -a
```

### gitm continue

#### 短指令：gitm ct

继续未完成的操作

- 使用：`gitm continue`
- 示例：
- 传值：

<div class="table-option">

| 名称   | 简写 | 说明                 | 类型      | 可选值 | 传值必填 | 默认 |
| ------ | ---- | -------------------- | --------- | ------ | -------- | ---- |
| --list | -l   | 查看未完成的指令列表 | `Boolean` | -      | 否       | -    |

</div>

1. 继续未完成的操作

```shell
gitm continue
# or
gitm ct
```

2. 查看未完成的指令列表

```shell
gitm continue --list
# or
gitm ct -l
```

## 效率

### gitm copy

#### 短指令：gitm cp

> v4.0.0 重构指令，改造成自选提交记录的方式

复制当前分支上的提交记录到目标分支

- 使用：`gitm copy [commitid...]` 或者 `gitm copy [--lastet [lastet]] [--limit [limit]] [--no-merges]`
- 参数：

<div class="table-prop">

| 参数     | 说明                                        | 类型     | 可选值 | 必填 | 默认 |
| -------- | ------------------------------------------- | -------- | ------ | ---- | ---- |
| commitid | 需要 copy 的 commitID，可传入多个，空格隔开 | `String` | -      | 否   | -    |

</div>

- 传值：

<div class="table-option">

| 名称       | 简写 | 说明                                                   | 类型      | 可选值 | 传值必填 | 默认    |
| ---------- | ---- | ------------------------------------------------------ | --------- | ------ | -------- | ------- |
| --no-merge | -    | 排除 merge 记录                                        | `Boolean` | -      | 否       | `false` |
| --lastet   | -    | 查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y | `String`  | -      | 否       | '7d'    |
| --limit    | -    | 最多查询的日志条数                                     | `Number`  | -      | 否       | 20      |

</div>

- 示例：

1. 不传 commitid，筛选需要展示的日志（默认显示 20 条）

```shell
gitm copy --lastet 7d --limit 100
# or
gitm cp --lastet 7d --limit 100
```

2. 传入单个或者多个 commitID

```shell
# 形式：gitm copy [commitid...]
gitm copy xxxxxx xxxxxx
# or
gitm cp xxxxxx
```

### gitm build

#### 短指令：gitm bd

> v5.3.0 增加data传值，支持传入额外的参数

该指令用于发起 Jenkins 构建，project 必传，app 名称可传入 all

- 使用：`gitm build <project> [-e --env [env]] [-a --app [app]] [-d --data <data>]`
- 参数：

<div class="table-prop">

| 参数    | 说明           | 类型     | 可选值 | 必填 | 默认 |
| ------- | -------------- | -------- | ------ | ---- | ---- |
| project | 需要构建的项目 | `String` | -      | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称   | 简写 | 说明                               | 类型     | 可选值       | 传值必填 | 默认  |
| ------ | ---- | ---------------------------------- | -------- | ------------ | -------- | ----- |
| --env  | -e   | 要构建的环境                       | `String` | dev/prod/bug | 是       | -     |
| --app  | -a   | 需要构建的子项目                   | `String` | -            | 否       | `all` |
| --data | -d   | 需要传输的其他数据，传入JSON字符串 | `String` | -            | 否       | '{}'  |

</div>

- 示例：

1. 构建 gitmars 的 app 应用

```shell
gitm build gitmars --env dev --app app
```

### gitm branch

#### 短指令：gitm bh

> v2.14.2 新增--exclude 和--include 传值

提供分支搜索和删除功能

- 使用：`gitm branch [-k --key] [-t --type] [--exclude [exclude]] [--include [include]] [-r --remote]` 或者 `gitm branch [-d --delete [name]] [-D --forcedelete [name]]` 或者 `gitm branch [-u --upstream [upstream]]`
- 传值：

<div class="table-option">

| 名称          | 简写 | 说明                                           | 类型              | 可选值                 | 传值必填 | 默认    |
| ------------- | ---- | ---------------------------------------------- | ----------------- | ---------------------- | -------- | ------- |
| --key         | -k   | 模糊匹配关键词                                 | `String`          | -                      | 否       | -       |
| --exclude     |      | 排除的分支名，支持正则或字符串                 | `String`/`RegExp` | -                      | 否       | -       |
| --include     |      | 筛选符合条件的分支，支持正则或字符串           | `String`/`RegExp` | -                      | 否       | -       |
| --type        | -t   | 分支类型，默认查询全部                         | `String`          | bugfix/feature/support | 否       | -       |
| --remote      | -r   | 是否查询远程分支                               | `Boolean`         | -                      | 否       | `false` |
| --delete      | -d   | 删除本地分支                                   | `String`          | -                      | 是       | -       |
| --forcedelete | -D   | 强制删除本地分支                               | `String`          | -                      | 是       | -       |
| --upstream    | -u   | 传入分支名称可绑定分支，不传分支名称则取消绑定 | `String`          | -                      | 否       | ''      |

</div>

- 示例：

1. 查询本地 feature 功能分支

```shell
# 形式：gitm branch [-k --key] [-t --type] [--exclude [exclude]] [--include [include]] [-r --remote]
gitm branch --key bug001 --exclude="saqqdy$" --include="wu$" --remote --type feature
# or
gitm bh -k bug001 --exclude="saqqdy$" --include="wu$" -r -t feature
```

2. 删除本地分支

```shell
# 形式：gitm branch [-d --delete] [-D --forcedelete]
gitm branch -D bugfix/bug001
# or
gitm bh -D bugfix/bug001
```

3. 删除本地和远程分支

```shell
# 形式：gitm branch [-d --delete] [-D --forcedelete] [-r --remote]
gitm branch -D bugfix/bug001 --remote
# or
gitm bh -D bugfix/bug001 -r
```

4. 设置当前分支与远程 feature/1000 分支关联

```shell
# 形式：gitm branch [-u --upstream [upstream]]
gitm branch -u feature/1000
```

5. 取消当前分支与远程分支的关联

```shell
gitm branch -u
```

### gitm revert

#### 短指令：gitm rt

撤销当前分支的某条提交记录，如果需要撤销一条 merge 记录，需要传入撤销方式，1 = 保留当前分支代码；2 = 保留传入代码

- 使用：`gitm revert [commitid] [-m --mode [mode]]` 或者 `gitm revert [-n --number] [-m --mode [mode]]`
- 参数：

<div class="table-prop">

| 参数     | 说明        | 类型     | 可选值 | 必填 | 默认 |
| -------- | ----------- | -------- | ------ | ---- | ---- |
| commitid | 要撤回的 id | `String` | -      | 否   | -    |

</div>

- 传值：

<div class="table-option">

| 名称     | 简写 | 说明                                                                  | 类型     | 可选值 | 传值必填 | 默认    |
| -------- | ---- | --------------------------------------------------------------------- | -------- | ------ | -------- | ------- |
| --number | -n   | 撤回倒数 N 条记录，使用时不要传入 commitID                            | `Number` | -      | 否       | `false` |
| --mode   | -m   | 撤回 merge 记录时需要保留哪一方的代码，1=保留当前分支，2=保留传入分支 | `Number` | -      | 否       | -       |

</div>

- 示例：

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

### gitm undo

#### 短指令：gitm ud

> v2.15.0 新增指令。新增`--no-merges` `--limit` `--lastet` `--calc` `--calcAll`传参，移除`--branch`传参

撤销当前分支的某条提交记录，或者撤销某条分支的多条合并记录，如果需要撤销一条 merge 记录，需要传入撤销方式，1 = 保留当前分支代码；2 = 保留传入代码

- 使用：`gitm undo [commitid...] [-m --mode [mode]]` 或者 `gitm undo [--lastet [lastet]] [--limit [limit]] [-m --mode [mode]] [--no-merges]` 或者 `gitm undo [--calc] [--calcAll]`
- 参数：

<div class="table-prop">

| 参数     | 说明                          | 类型     | 可选值 | 必填 | 默认 |
| -------- | ----------------------------- | -------- | ------ | ---- | ---- |
| commitid | 要撤回的 id，多条 id 空格隔开 | `String` | -      | 否   | -    |

</div>

- 传值：

<div class="table-option">

| 名称       | 简写 | 说明                                                                  | 类型      | 可选值 | 传值必填 | 默认    |
| ---------- | ---- | --------------------------------------------------------------------- | --------- | ------ | -------- | ------- |
| --mode     | -m   | 撤回 merge 记录时需要保留哪一方的代码，1=保留当前分支，2=保留传入分支 | `Number`  | -      | 否       | -       |
| --no-merge | -    | 排除 merge 记录                                                       | `Boolean` | -      | 否       | `false` |
| --lastet   | -    | 查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y                | `String`  | -      | 否       | '7d'    |
| --limit    | -    | 最多查询的日志条数                                                    | `Number`  | -      | 否       | 20      |
| --calc     | -    | 清理当前分支撤销失败的记录                                            | `Boolean` | -      | 否       | `false` |
| --calcAll  | -    | 清理所有分支撤销失败的记录                                            | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

1. 不传 commitid，显示 log 列表选择要撤销的 commit，如果是 merge 记录，保留当前分支代码

```shell
# 形式：gitm undo [-m --mode [mode]]
gitm undo -m 1
# or
gitm ud -m 1
```

2. 不传 commitid，筛选需要展示的日志（默认显示 20 条）

```shell
gitm undo --lastet 7d --limit 100 --mode 1
# or
gitm ud --lastet 7d --limit 100 --mode 1
```

3. 传入单个或者多个 commitID

```shell
# 形式：gitm undo [commitid...] [-m --mode [mode]]
gitm undo xxxxxx xxxxxx --mode 1
# or
gitm ud xxxxxx -m 1
```

4. 清理当前分支撤销失败的记录

```shell
# 形式：gitm undo [--calc] [--calcAll]
gitm undo --calc
# or
gitm ud --calc
```

### gitm redo

#### 短指令：gitm rd

> v2.15.0 新增指令

重做当前分支的某条提交记录，或者重做某条分支的多条合并记录，如果需要重做一条 merge 记录，需要传入重做方式，1 = 保留当前分支代码；2 = 保留传入代码

- 使用：`gitm redo [commitid...] [-m --mode [mode]]` 或者 `gitm redo [-m --mode [mode]]`
- 参数：

<div class="table-prop">

| 参数     | 说明                          | 类型     | 可选值 | 必填 | 默认 |
| -------- | ----------------------------- | -------- | ------ | ---- | ---- |
| commitid | 要撤回的 id，多条 id 空格隔开 | `String` | -      | 否   | -    |

</div>

- 传值：

<div class="table-option">

| 名称   | 简写 | 说明                                                                  | 类型     | 可选值 | 传值必填 | 默认 |
| ------ | ---- | --------------------------------------------------------------------- | -------- | ------ | -------- | ---- |
| --mode | -m   | 撤回 merge 记录时需要保留哪一方的代码，1=保留当前分支，2=保留传入分支 | `Number` | -      | 否       | -    |

</div>

- 示例：

1. 传入分支名称

```shell
# 形式：gitm redo [commitid...] [-m --mode [mode]]
gitm redo xxxxxx xxxxxx --mode 1
# or
gitm rd xxxxxx xxxxxx -m 1
```

2. 传入单个或者多个 commitID

```shell
# 形式：gitm redo [-m --mode [mode]]
gitm redo --mode 1
# or
gitm rd -m 1
```

### gitm save

#### 短指令：gitm sv

暂存当前分支代码

- 使用：`gitm save [message] [-f --force]`
- 参数：

<div class="table-prop">

| 参数    | 说明                                                     | 类型     | 可选值 | 必填 | 默认           |
| ------- | -------------------------------------------------------- | -------- | ------ | ---- | -------------- |
| message | stash 的标记信息，默认会存入当前分支名称作为暂存标记信息 | `String` | -      | 否   | 当前分支的名称 |

</div>

- 传值：

<div class="table-option">

| 名称    | 简写 | 说明                                              | 类型      | 可选值 | 传值必填 | 默认    |
| ------- | ---- | ------------------------------------------------- | --------- | ------ | -------- | ------- |
| --force | -f   | 是否需要把没有加入版本的文件执行 add 之后暂存起来 | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

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

- 使用：`gitm get [message] [index] [-k --keep]`
- 参数：

<div class="table-prop">

| 参数    | 说明                                                     | 类型     | 可选值 | 必填 | 默认           |
| ------- | -------------------------------------------------------- | -------- | ------ | ---- | -------------- |
| message | stash 的标记信息，默认会存入当前分支名称作为暂存标记信息 | `String` | -      | 否   | 当前分支的名称 |
| index   | 需要恢复的序号，存在多条记录时默认恢复最近的一条记录     | `Number` | -      | 否   | 0              |

</div>

- 传值：

<div class="table-option">

| 名称   | 简写 | 说明                     | 类型      | 可选值 | 传值必填 | 默认    |
| ------ | ---- | ------------------------ | --------- | ------ | -------- | ------- |
| --keep | -k   | 是否需要保留暂存区的记录 | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

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

### gitm cleanbranch

#### 短指令：gitm clb

> v2.13.0 新增<br/>
> v2.13.1 新增--list 参数<br/>
> v2.13.4 新增--confirm 参数<br/>
> v2.13.6 新增 branches，新增--target<br/>
> v2.13.9 --except 改成--exclude，用法不变；新增--include 传参；新增--key 传参<br/>
> v4.0.0 新增--strictly 传参

清理合并过的功能分支

- 使用：`gitm cleanbranch [branches...] [-l --list [list]] [-k --key [keyword]] [--exclude [exclude]] [--include [include]] [-t --type [type]] [--target [target]] [-r --remote] [-s --strictly]`
- 参数：

<div class="table-prop">

| 参数     | 说明         | 类型     | 可选值 | 必填 | 默认 |
| -------- | ------------ | -------- | ------ | ---- | ---- |
| branches | 指定清理分支 | `String` | -      | 否   | -    |

</div>

- 传值：

<div class="table-option">

| 名称       | 简写 | 说明                                                        | 类型              | 可选值 | 传值必填 | 默认    |
| ---------- | ---- | ----------------------------------------------------------- | ----------------- | ------ | -------- | ------- |
| --list     | -l   | 显示符合条件的分支列表                                      | `Boolean`         | -      | 否       | `false` |
| --key      | -k   | 查询分支的关键词                                            | `String`          | -      | 否       | -       |
| --exclude  |      | 排除的分支名，支持正则或字符串                              | `String`/`RegExp` | -      | 否       | -       |
| --include  |      | 筛选符合条件的分支，支持正则或字符串                        | `String`/`RegExp` | -      | 否       | -       |
| --type     | -t   | 分支类型，支持：feature/bugfix/support                      | `String`          | -      | 否       | -       |
| --target   |      | 需要检测是否合过的目标分支名，不传默认是 develop 和 release | `String`          | -      | 否       | -       |
| --remote   | -r   | 是否清理远程分支，默认清理本地分支                          | `Boolean`         | -      | 否       | `false` |
| --strictly | -s   | 是否开启严格模式                                            | `Boolean`         | -      | 否       | `false` |
| --confirm  | -c   | 确认开始，为 true 时不显示确认框                            | `Boolean`         | -      | 否       | `false` |

</div>

- 示例：

1. 清理前查看符合条件的分支列表

```shell
gitm cleanbranch --remote --exclude "saqqdy$" --include "[a-z]+$" --key "wu" --list
# or
gitm cleanbranch -r --exclude "saqqdy$" --include "[a-z]+$" -k "wu" -l
```

2. 清理远程所有功能分支

```shell
gitm cleanbranch --remote
# or
gitm cleanbranch -r
```

3. 清理远程所有功能分支，除了 exclude 匹配的分支

```shell
gitm cleanbranch --remote --exclude "saqqdy$"
# or
gitm cleanbranch -r --exclude "saqqdy$"
```

4. 清理本地所有 feature 分支

```shell
gitm cleanbranch --type feature
# or
gitm cleanbranch -t feature
```

5. 清理指定分支：`feature/10000`和`feature/10001`

```shell
gitm cleanbranch feature/10000 feature/10001
```

6. 需要检测是否合过的目标分支名改为只需要合过`release`分支即可

```shell
gitm cleanbranch --target release
```

7. 不使用严格模式进行判断

```shell
gitm cleanbranch --target release --strictly
```

### gitm log

> v1.4.0 新增<br/>
> v2.15.0 新增`--no-merges`传参
> v2.15.3 新增`--json`传值，是否以 json 格式输出日志，默认表格方式

查询日志

- 使用：`gitm log [branch] [--lastet [lastet]] [--limit [limit]] [--no-merges] [--json]`
- 参数：

<div class="table-prop">

| 参数   | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------ | -------- | -------- | ------ | ---- | ---- |
| branch | 分支名称 | `String` | -      | 否   | -    |

</div>
-   传值：

<div class="table-option">

| 名称       | 简写 | 说明                                                   | 类型      | 可选值 | 传值必填 | 默认    |
| ---------- | ---- | ------------------------------------------------------ | --------- | ------ | -------- | ------- |
| --lastet   | -    | 查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y | `String`  | -      | 否       | '7d'    |
| --limit    | -    | 最多查询的日志条数                                     | `Number`  | -      | 否       | 20      |
| --no-merge | -    | 排除 merge 记录                                        | `Boolean` | -      | 否       | `false` |
| --json     | -    | 是否以 json 格式输出日志，默认表格方式                 | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

1. 查询最近 7 天内的日志，最多 50 条

```shell
gitm log --latest 7d --limit 50
```

2. 排除 merge 记录

```shell
gitm log --no-merges --limit 50
```

3. 查看 dev 分支的 log

```shell
gitm log dev
```

4. 以 json 格式查看日志

```shell
gitm log --json
```

### gitm hook

> 1.4.0 新增

发布操作

- 使用：`gitm hook [command] [args...] [--no-verify] [--lastet [lastet]] [--limit [limit]] [-t --type <type>] [--branch [branch]]`
- 参数：

<div class="table-prop">

| 参数    | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------- | -------- | -------- | ------ | ---- | ---- |
| command | 命令名称 | `String` | -      | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称        | 简写 | 说明                                                   | 类型      | 可选值 | 传值必填 | 默认    |
| ----------- | ---- | ------------------------------------------------------ | --------- | ------ | -------- | ------- |
| --no-verify | -    | 是否需要跳过校验权限                                   | `Boolean` | -      | 否       | `false` |
| --lastet    | -    | 查询在某个时间之后的日志，填写格式：10s/2m/2h/3d/4M/5y | `Boolean` | -      | 否       | -       |
| --limit     | -    | 最多查询的日志条数                                     | `Number`  | -      | 否       | 20      |
| --type      | -t   | 检测类型                                               | `Number`  | -      | 是       | ''      |
| --branch    | -    | 要查询的分支                                           | `String`  | -      | 否       | ''      |

</div>

### gitm run

> 1.4.0 新增

::: tip
内部方法，仅支持程序内部使用
:::

run 指令是 gitmars hook 里面执行的内部指令，用来执行钩子方法

- 使用：`gitm run <command> [args...]`
- 参数：

<div class="table-prop">

| 参数    | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------- | -------- | -------- | ------ | ---- | ---- |
| command | 钩子名称 | `String` |        | 是   | -    |
| args    | 参数列表 | `String` |        | 否   | -    |

</div>

### gitm upgrade

#### 短指令：gitm ug

升级 gitmars 版本，可输入 version 指定版本，选填，默认安装最新版

- 使用：`gitm upgrade [version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]`
- 参数：

<div class="table-prop">

| 参数    | 说明           | 类型     | 可选值                                                        | 必填 | 默认     |
| ------- | -------------- | -------- | ------------------------------------------------------------- | ---- | -------- |
| version | 要升级的版本号 | `String` | `alpha`、`beta`、`release`、`lite`、`latest`、`next`、`x.x.x` | 否   | `latest` |

</div>

- 传值：

<div class="table-option">

| 名称       | 简写 | 说明                 | 类型      | 可选值 | 传值必填 | 默认    |
| ---------- | ---- | -------------------- | --------- | ------ | -------- | ------- |
| --mirror   | -m   | 是否使用淘宝镜像升级 | `Boolean` | -      | 否       | `false` |
| --registry | -r   | 使用镜像地址         | `String`  | -      | 是       | `false` |
| --mirror   | -m   | 是否使用淘宝镜像升级 | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

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

- 传值：

<div class="table-option">

| 名称    | 简写 | 说明                      | 类型      | 可选值 | 传值必填 | 默认    |
| ------- | ---- | ------------------------- | --------- | ------ | -------- | ------- |
| --force | -f   | 是否清理 gitmars 执行缓存 | `Boolean` | -      | 否       | `false` |

</div>

- 示例：

```shell
gitm clean
```

<!-- ### gitm suggest <Badge text="开发中" type="warning"/>

#### 短指令：gitm sg

git操作建议

-   使用：`gitm suggest`
-   参数：无
-   传值：无
-   示例：

```shell
# 输入指令，按照提示操作
gitm suggest
``` -->

### gitm approve

#### 短指令：gitm ap

> v2.16.0 新增<br/>
> v2.16.4 移除`--postmsg`，新增'--quiet'

处理远程合并请求

- 使用：`gitm approve [--state [state]] [--quiet]`
- 参数：无
- 传值：

<div class="table-option">

| 名称    | 简写 | 说明               | 类型      | 可选值                           | 传值必填 | 默认     |
| ------- | ---- | ------------------ | --------- | -------------------------------- | -------- | -------- |
| --state |      | 筛选合并请求的状态 | `String`  | `opened` `closed` `merged` `all` | 否       | `opened` |
| --quiet |      | 不要推送消息       | `Boolean` |                                  | 否       | `false`  |

</div>

- 示例：

```shell
# 输入指令，按照提示操作
gitm approve --quiet
```

### gitm review

#### 短指令：gitm rv

> v2.16.0 新增<br/>
> v2.16.4 移除`--postmsg`，新增'--quiet'

远程 review 代码

- 使用：`gitm review [--state [state]] [--quiet]`
- 参数：无
- 传值：

<div class="table-option">

| 名称    | 简写 | 说明               | 类型      | 可选值                           | 传值必填 | 默认     |
| ------- | ---- | ------------------ | --------- | -------------------------------- | -------- | -------- |
| --state |      | 筛选合并请求的状态 | `String`  | `opened` `closed` `merged` `all` | 否       | `opened` |
| --quiet |      | 不要推送消息       | `Boolean` |                                  | 否       | `false`  |

</div>

- 示例：

```shell
# 输入指令，按照提示操作
gitm review --state merged
```

### gitm status

查看当前分支状态

- 使用：`gitm status`
- 参数：无
- 传值：无

- 示例：

```shell
gitm status
```

### gitm link

创建本地包软链接，传入 name 时把依赖包软链到本地包，不传 name 时给当前包创建公共软链

- 使用：`gitm link [name]`
- 参数：

<div class="table-prop">

| 参数 | 说明   | 类型     | 可选值 | 必填 | 默认 |
| ---- | ------ | -------- | ------ | ---- | ---- |
| name | 包名称 | `String` | -      | 否   | -    |

</div>

- 示例 1：链接本地的 tool 包

```shell
gitm link tool
```

- 示例 2：给当前包创建公共软链

```shell
gitm link
```

### gitm unlink

传入 name 时解除依赖包软链，不传 name 时删除当前包的公共软链

- 使用：`gitm unlink [name]`
- 参数：

<div class="table-prop">

| 参数 | 说明   | 类型     | 可选值 | 必填 | 默认 |
| ---- | ------ | -------- | ------ | ---- | ---- |
| name | 包名称 | `String` | -      | 是   | -    |

</div>

- 示例 1：解除依赖包软链

```shell
gitm unlink tool
```

- 示例 2：删除当前包的公共软链

```shell
gitm unlink
```

### gitm postmsg

推送消息

- 使用：`gitm postmsg <message> [-u --url [url]]`
- 参数：

<div class="table-prop">

| 参数    | 说明     | 类型     | 可选值 | 必填 | 默认 |
| ------- | -------- | -------- | ------ | ---- | ---- |
| message | 消息内容 | `String` | -      | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称  | 简写 | 说明               | 类型     | 可选值 | 传值必填 | 默认 |
| ----- | ---- | ------------------ | -------- | ------ | -------- | ---- |
| --url | -u   | 自定义推送消息地址 | `String` | -      | 否       | -    |

</div>

- 示例：

1. 简单使用

```shell
gitm postmsg "测试消息"
```

2. 自定义推送地址

```shell
gitm postmsg "测试消息" --url "https://github.com/"
```

### gitm alias

#### 短指令：无

> v2.18.0 新增

安装和移除快捷方式

- 使用：`gitm alias init` or `gitm alias remove`
- 参数：无
- 传值：无
- 示例：

```shell
# 安装
gitm alias init
# 移除
gitm alias remove
```

- 运用：

1. `gitm` 别名使用

```shell
# 创建分支
gitm start feature 100001
# or
git mars start feature 100001
# or
git flow start feature 100001
```

2. git 快捷方式

<div class="table-option">

| 名称      | 指令            | 使用                   | 说明                    |
| --------- | --------------- | ---------------------- | ----------------------- |
| `unstage` | `reset HEAD --` | `git unstage file1.js` | 移出暂存区              |
| `last`    | `log -1 HEAD`   | `git last`             | 显示最近一条日志        |
| `st`      | `status`        | `git st`               | git 状态                |
| `cm`      | `commit`        | `git cm -m "xxxx"`     | 提交版本                |
| `br`      | `branch`        | `git br`               | 分支管理                |
| `bh`      | `branch`        | `git bh`               | 分支管理                |
| `ck`      | `checkout`      | `git ck dev`           | 切换到分支              |
| `ckb`     | `checkout -b`   | `git ckb dev master`   | 创建分支                |
| `cp`      | `cherry-pick`   | `git cp xxxxxx`        | 复制提交记录            |
| `ps`      | `push`          | `git ps`               | 推送代码到远程          |
| `pl`      | `pull`          | `git pl`               | 拉取远程代码            |
| `plm`     | `pull --merge`  | `git plm`              | 通过 merge 方式拉取代码 |
| `plr`     | `pull --rebase` | `git plr`              | 通过 rebase 方式拉代码  |
| `fh`      | `fetch`         | `git fh`               | 检索远程版本            |
| `sh`      | `stash`         | `git sh`               | 存入暂存区              |
| `shp`     | `stash pop`     | `git shp`              | 取出暂存区文件          |
| `sha`     | `stash apply`   | `git sha`              | 取出暂存区文件          |
| `mg`      | `merge`         | `git mg feature/test`  | 合并分支                |
| `mgn`     | `merge --no-ff` | `git mgn feature/test` | 通过--no-ff 方式 merge  |
| `rs`      | `reset`         | `git rs xxxxxx`        | 重置                    |
| `rsh`     | `reset --hard`  | `git rsh xxxxxx`       | 硬重置                  |
| `rss`     | `reset --soft`  | `git rss xxxxxx`       | 软重置                  |
| `rb`      | `rebase`        | `git rb`               | rebase                  |

</div>

## 管理员

### gitm admin create

创建 release、bugfix、support 和 develop 分支

- 使用：`gitm admin create <type>`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认 |
| ---- | -------- | -------- | ---------------------- | ---- | ---- |
| type | 分支类型 | `String` | bugfix/release/develop | 是   | -    |

</div>

- 示例：

创建 release 分支

```shell
gitm admin create release
```

### gitm admin publish

> v2.11.0 新增`--description`传参
> v5.3.0 publish增加data传值，支持传入额外的参数

发布操作

- 使用：`gitm admin publish <type> [--description [description]] [-c --combine] [--use-rebase] [-p --prod] [-b --build [build]] [-d --data <data>] [-p --postmsg] [-f --force]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认 |
| ---- | -------- | -------- | ---------------------- | ---- | ---- |
| type | 分支类型 | `String` | bugfix/release/support | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称          | 简写 | 说明                                                                         | 类型      | 可选值 | 传值必填 | 默认    |
| ------------- | ---- | ---------------------------------------------------------------------------- | --------- | ------ | -------- | ------- |
| --combine     | -c   | 是否在合并 release 之后会把 release 同步到 bugfix（仅在合并 release 时可用） | `Boolean` | -      | 否       | `false` |
| --prod        | -p   | 发布 bugfix 时，是否需要把 bugfix 合并到 master                              | `Boolean` | -      | 否       | `false` |
| --build       | -b   | 是否使用淘宝镜像升级                                                         | `Boolean` | -      | 否       | `false` |
| --use-rebase  |      | 是否使用 rebase 执行合并                                                     | `Boolean` | -      | 否       | `false` |
| --postmsg     | -p   | 是否需要发送群消息                                                           | `Boolean` | -      | 否       | `false` |
| --description |      | 本次提交的原因描述                                                           | `String`  | -      | 否       | ''      |
| --force       | -f   | 是否强制发起合并请求                                                         | `Boolean` | -      | -        | `false` |
| --data        | -d   | 需要传输的其他数据，传入JSON字符串                                           | `String`  | -      | 否       | '{}'    |

</div>

- 示例：

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
# 仅构建app
gitm admin publish release --build app
# or
gitm admin publish release -b app
```

3. 发布并执行构建，传入其他构建参数

```shell
# 构建全部
gitm admin publish release --build --data '{"app_id":"xxxxxx"}'
# or
gitm admin publish release -b -d '{"app_id":"xxxxxx"}'
```

### gitm admin update

> v2.11.0 新增`--description`传参

更新 release、bugfix、support 分支代码，默认走 merge 方法

- 使用：`gitm admin update <type> [--description [description]] [--use-rebase] [-m --mode [mode]] [-p --postmsg] [-f --force]`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                 | 必填 | 默认 |
| ---- | -------- | -------- | ---------------------- | ---- | ---- |
| type | 分支类型 | `String` | bugfix/release/support | 是   | -    |

</div>

- 传值：

<div class="table-option">

| 名称          | 简写 | 说明                                                                                                                  | 类型      | 可选值 | 传值必填 | 默认    |
| ------------- | ---- | --------------------------------------------------------------------------------------------------------------------- | --------- | ------ | -------- | ------- |
| --mode        | -m   | 出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase 同时使用 | `Number`  | 0/1/2  | 否       | 0       |
| --use-rebase  |      | 是否使用 rebase 执行同步                                                                                              | `Boolean` | -      | 否       | `false` |
| --postmsg     | -p   | 是否需要发送群消息                                                                                                    | `Boolean` | -      | 否       | `false` |
| --description |      | 本次提交的原因描述                                                                                                    | `String`  | -      | 否       | ''      |
| --force       | -f   | 是否强制发起合并请求                                                                                                  | `Boolean` | -      | -        | `false` |

</div>

- 示例：

1. 更新 bug 分支代码

```shell
gitm admin update bugfix -m 2
# or
gitm admin up bugfix -m 2
```

### gitm admin clean

Jenkins 构建清理 git 分支专用，可传入 release、bugfix、develop 分支代码

- 使用：`gitm admin clean <type>`
- 参数：

<div class="table-prop">

| 参数 | 说明     | 类型     | 可选值                        | 必填 | 默认 |
| ---- | -------- | -------- | ----------------------------- | ---- | ---- |
| type | 分支类型 | `String` | bugfix/release/support/master | 是   | -    |

</div>

- 示例：

清理分支

```shell
gitm admin clean bugfix
```

## 其他

### gitm permission

检测是否骚操作

- 使用：`gitm permission`
- 示例：

### gitm version

查看 gitmars 版本号

- 使用：`gitm --version`
- 示例：

```shell
gitm --version
# or
gitm -v
```

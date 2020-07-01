一个定制化的git工作流操作工具

> 每一个子命令都带了help功能，可输入 gitm command-name --help 获取对应子指令的帮助信息
> 注意：<type>意思是type必传；[type]意思是type选填；[-a --app [app]]其中-a是--app的简写，后面[app]指的是-a后面的传值

![gitmars.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/lib/img/gitmars.png)


# 安装

```
# 通过npm安装
npm install -g gitmars

# 或者通过yarn安装
yarn global add gitmars
```



# 使用

```
# 初始化
gitm init

# 查看配置
gitm config list [option]

# 版本升级[-m --mirror]使用淘宝镜像升级
Mac用户：gitm upgrade -m
windows用户：npm i -g gitmars@latest

# 查看版本
gitm -v

# 查看帮助信息
gitm --help
gitm copy -h
```



# 日常任务
创建周四任务分支(release)、日常更新BUG分支(bugfix)这两种类型的分支、项目框架相关的support分支

## gitm start
### 短指令：gitm st
开始任务，创建分支

```
形式：gitm start <type> <name>
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | feature/bugfix/support | 是   | -    |
| name | 分支名称 | String | -                      | 是   | -    |

* 简单使用

```
gitm start bugfix 20001
gitm start feature 1001
```


## gitm combine
### 短指令：gitm cb
任务阶段提测，这部操作把分支代码合并到dev和bug分支，环境参数必填

```
形式：gitm combine [type] [name] [-a --add] [-m --commit [message]] [-d --dev] [-p --prod] [-b --build [build]] [--no-bugfix] [--as-feature]
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

### 传值

| 名称         | 简写 | 说明                                                  | 类型    | 可选值  | 传值必填 | 默认  |
| ------------ | ---- | ----------------------------------------------------- | ------- | ------- | -------- | ----- |
| --add        | -a   | 是否需要执行add                                       | Boolean | -       | -        | false |
| --commit     | -m   | 是否需要执行commit，需要填写message                   | String  | -       | 是       | ''    |
| --dev        | -d   | 是否同步到dev，与--prod两者必传一个                   | Boolean | -       | -        | false |
| --prod       | -p   | 是否同步到prod，与--dev两者必传一个                   | Boolean | -       | -        | false |
| --build      | -b   | 需要构建的应用                                        | String  | all/... | 否       | all   |
| --no-bugfix  |      | 是否不同步到bug分支，这个参数仅对support分支有效      | Boolean | -       | -        | false |
| --as-feature |      | bugfix分支需要合并到release时使用，仅对bugfix分支有效 | Boolean | -       | -        | false |

1. 合并当前分支到alpha

```
gitm combine -d
gitm cb -d
```

2. 合并当前分支到alpha并构建

```
gitm combine -d -b
gitm combine -d --build all
gitm cb -d -b cloud-ui
```

3. 合并bugfix/20001分支到alpha和prod

```
gitm combine bugfix 20001 -pd
gitm cb bugfix 20001 -pd
# 或者简写
gitm cb 20001 -d
```

4. bugfix分支特殊情况需要合并到release时，传入--as-feature

```
gitm combine bugfix 20001 -p --as-feature
gitm cb -p --as-feature
```

5. support分支提交prod时会主动同步bugfix分支和release分支，传入--no-bugfix不同步到bugfix

```
gitm combine support 20001 -pd --no-bugfix
gitm cb -pd --no-bugfix
```


## gitm end

### 短指令：gitm ed
任务完成，合并并删除分支，这个操作会把20001这个分支代码合并到bug分支并删除20001分支

```
形式：gitm end [type] [name]
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

1. 结束bugfix/20001分支

```
gitm end bugfix 20001
gitm ed bugfix 20001
```

2. 结束当前分支

```
gitm end
gitm ed
```


# gitm update
### 短指令：gitm up
把bug分支的最新代码同步到20001分支上（--use-merge使用merge方法合并，默认false）

```
形式：gitm update [type] [name] [--use-merge]
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认         |
| ---- | -------- | ------ | ---------------------- | ---- | ------------ |
| type | 分支类型 | String | feature/bugfix/support | 否   | 当前分支类型 |
| name | 分支名称 | String | -                      | 否   | 当前分支名称 |

### 传值

| 名称        | 简写 | 说明                      | 类型    | 可选值 | 传值必填 | 默认  |
| ----------- | ---- | ------------------------- | ------- | ------ | -------- | ----- |
| --use-merge |      | 是否使用merge方式更新代码 | Boolean | -      | -        | false |

1. 升级bugfix/20001分支

```
gitm update bugfix 20001
gitm up bugfix 20001
```

2. 使用merge方法升级当前分支

```
gitm update --use-merge
gitm up --use-merge
```



# 扩展

## gitm merge
### 短指令：gitm mg
合并分支，类似git merge功能

```
形式：gitm merge <name>
```

### 参数

| 参数 | 说明      | 类型   | 可选值 | 必填 | 默认 |
| ---- | --------- | ------ | ------ | ---- | ---- |
| name | merge来源 | String | -      | 是   | -    |

* 合并20001分支到当前分支

```
gitm merge 20001
gitm mg 20001
```


## gitm copy
### 短指令：gitm cp
复制其他分支上的提交记录到当前分支

```
形式1：gitm copy <from> [commitid...]
形式2：gitm copy <from> [-k --key] [-a --author]
```

### 参数

| 参数     | 说明                                     | 类型   | 可选值 | 必填 | 默认 |
| -------- | ---------------------------------------- | ------ | ------ | ---- | ---- |
| from     | 需要copy的来源分支                       | String | -      | 是   | -    |
| commitid | 需要copy的commitID，可传入多个，空格隔开 | String | -      | 否   | -    |

### 传值

| 名称     | 简写 | 说明                 | 类型   | 可选值 | 传值必填 | 默认 |
| -------- | ---- | -------------------- | ------ | ------ | -------- | ---- |
| --key    | -k   | 模糊匹配的查询关键词 | String | -      | 否       | -    |
| --author | -a   | 查询提交的用户名     | String | -      | 否       | -    |

1. 传入commit-id，把其他分支上的commit-id复制过来，执行下面指令

```
gitm copy feature/test xxxxxx xxxxxx xxxxxx
```

2. 传入查询关键词，gitm会根据提供的关键词（为确保copy准确，请尽量完整填写关键词），在对应分支的提交记录里面搜索提交记录并自动执行copy指令

```
gitm copy dev --key 100000 --author saqqdy
```


## gitm build
### 短指令：gitm bd
该指令用于发起Jenkins构建，project必传，app名称可传入all

```
形式：gitm build <project> [-e --env [env]] [-a --app [app]]
```

### 参数

| 参数    | 说明           | 类型   | 可选值 | 必填 | 默认 |
| ------- | -------------- | ------ | ------ | ---- | ---- |
| project | 需要构建的项目 | String | -      | 是   | -    |

### 传值

| 名称  | 简写 | 说明             | 类型   | 可选值       | 传值必填 | 默认 |
| ----- | ---- | ---------------- | ------ | ------------ | -------- | ---- |
| --env | -e   | 要构建的环境     | String | dev/prod/bug | 是       | -    |
| --app | -a   | 需要构建的子项目 | String | -            | 否       | all  |

* 简单使用

```
# 构建wyweb的cloud-ui应用
gitm build wyweb --env dev --app cloud-ui
```


## gitm branch
### 短指令：gitm bh
提供分支搜索和删除功能（不开放删除远程分支功能）

```
形式1：gitm branch [-k --key] [-t --type] [-r --remote]
形式2：gitm branch [-d --delete [name]] [-D --forcedelete [name]]
形式3：gitm branch [-u --upstream [upstream]]
```

### 传值

| 名称          | 简写 | 说明                                           | 类型    | 可选值                 | 传值必填 | 默认  |
| ------------- | ---- | ---------------------------------------------- | ------- | ---------------------- | -------- | ----- |
| --key         | -k   | 模糊匹配关键词                                 | String  | -                      | 否       | -     |
| --type        | -t   | 分支类型，默认查询全部                         | String  | bugfix/feature/support | 否       | -     |
| --remote      | -r   | 是否查询远程分支                               | Boolean | -                      | 否       | false |
| --delete      | -d   | 删除本地分支                                   | String  | -                      | 是       | -     |
| --forcedelete | -D   | 强制删除本地分支                               | String  | -                      | 是       | -     |
| --upstream    | -u   | 传入分支名称可绑定分支，不传分支名称则取消绑定 | String  | -                      | 否       | ''    |

1. 查询本地feature功能分支

```
# 形式：gitm branch [-k --key] [-t --type] [-r --remote]
gitm branch --key bug001 -r -t feature
gitm bh -k bug001 -r -t feature
```

2. 删除本地分支

```
# 形式：gitm branch [-d --delete] [-D --forcedelete]
gitm branch -d bugfix/bug001
gitm bh -d bugfix/bug001
```

3. 设置当前分支与远程feature/1000分支关联

```
# 形式：gitm branch [-u --upstream [upstream]]
gitm branch -u feature/1000
```

4. 取消当前分支与远程分支的关联

```
gitm branch -u
```


## gitm revert
### 短指令：gitm rt
撤销当前分支的某条提交记录，如果需要撤销一条merge记录，需要传入撤销方式，1 = 保留当前分支代码；2 = 保留传入代码

```
形式1：gitm revert [commitid] [-m --mode [mode]]
形式2：gitm revert [-n --number] [-m --mode [mode]]
```

### 参数

| 参数     | 说明       | 类型   | 可选值 | 必填 | 默认 |
| -------- | ---------- | ------ | ------ | ---- | ---- |
| commitid | 要撤回的id | String | -      | 否   | -    |

### 传值

| 名称     | 简写 | 说明                                                                | 类型   | 可选值 | 传值必填 | 默认  |
| -------- | ---- | ------------------------------------------------------------------- | ------ | ------ | -------- | ----- |
| --number | -n   | 撤回倒数N条记录，使用时不要传入commitID                             | Number | -      | 否       | false |
| --mode   | -m   | 撤回merge记录时需要保留哪一方的代码，1=保留当前分支，2=保留传入分支 | Number | -      | 否       | -     |

1. 撤销最后一次提交（或者撤销倒数第n次提交）

```
# 形式：gitm revert [-n --number] [-m --mode [mode]]
gitm revert -n 1
gitm rt -n 3
```

2. 撤销某条提交id

```
# 形式：gitm revert [commitid] [-m --mode [mode]]
gitm revert xxxxxx --mode 1
gitm rt xxxxxx -m 1
```


## gitm save
### 短指令：gitm sv
暂存当前分支代码

```
形式：gitm save [message] [-f --force]
```

### 参数

| 参数    | 说明                                                    | 类型   | 可选值 | 必填 | 默认           |
| ------- | ------------------------------------------------------- | ------ | ------ | ---- | -------------- |
| message | stash的标记信息，默认会存入当前分支名称作为暂存标记信息 | String | -      | 否   | 当前分支的名称 |

### 传值

| 名称    | 简写 | 说明                                            | 类型    | 可选值 | 传值必填 | 默认  |
| ------- | ---- | ----------------------------------------------- | ------- | ------ | -------- | ----- |
| --force | -f   | 是否需要把没有加入版本的文件执行add之后暂存起来 | Boolean | -      | 否       | false |

1. 简单使用

```
gitm save
gitm sv
```

2. 暂存没有加入版本控制的文件

```
gitm save --force
gitm save -f
```

3. 设置自定义暂存信息，方便取出

```
gitm save feature/1000
gitm save "test login"
```


## gitm get
### 短指令：gitm gt
恢复暂存代码

```
形式：gitm get [message] [index] [-k --keep]
```

### 参数

| 参数    | 说明                                                    | 类型   | 可选值 | 必填 | 默认           |
| ------- | ------------------------------------------------------- | ------ | ------ | ---- | -------------- |
| message | stash的标记信息，默认会存入当前分支名称作为暂存标记信息 | String | -      | 否   | 当前分支的名称 |
| index   | 需要恢复的序号，存在多条记录时默认恢复最近的一条记录    | Number | -      | 否   | 0              |

### 传值

| 名称   | 简写 | 说明                     | 类型    | 可选值 | 传值必填 | 默认  |
| ------ | ---- | ------------------------ | ------- | ------ | -------- | ----- |
| --keep | -k   | 是否需要保留暂存区的记录 | Boolean | -      | 否       | false |

1. 简单使用

```
gitm get
gitm gt
```

2. 恢复feature/1000分支的暂存记录到当前分支，取第2条记录(index不传默认取第1条记录：0)

```
gitm get feature/1000 1
```

3. 恢复时不删除暂存区数据

```
gitm get --keep
gitm get -k
```

4. 恢复暂存信息为“test login”的暂存记录

```
gitm get "test login"
```


## gitm upgrade
### 短指令：gitm ug
升级gitmars版本，可输入version指定版本，选填，默认安装最新版

```
形式：gitm upgrade [version] [-m --mirror]
```

### 参数

| 参数    | 说明           | 类型   | 可选值 | 必填 | 默认 |
| ------- | -------------- | ------ | ------ | ---- | ---- |
| version | 要升级的版本号 | String | -      | 否   | -    |

### 传值

| 名称     | 简写 | 说明                 | 类型    | 可选值 | 传值必填 | 默认  |
| -------- | ---- | -------------------- | ------- | ------ | -------- | ----- |
| --mirror | -m   | 是否使用淘宝镜像升级 | Boolean | -      | 否       | false |

* 简单使用

```
gitm upgrade --mirror
gitm ug -m
```


## gitm clean
清理gitmars缓存和本地配置，输入--force同时清理本地配置文件（慎用）

```
形式：gitm clean [-f --force]
```

### 传值

| 名称    | 简写 | 说明                                  | 类型    | 可选值 | 传值必填 | 默认  |
| ------- | ---- | ------------------------------------- | ------- | ------ | -------- | ----- |
| --force | -f   | 是否清理gitmars配置文件（请谨慎使用） | Boolean | -      | 否       | false |

* 简单使用

```
gitm clean
```



# 管理员
## gitm admin create
创建release、bugfix、support和develop分支

```
形式：gitm admin create <type>
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/develop | 是   | -    |

* 创建release分支

```
gitm admin create release
```


## gitm admin publish
发布操作

```
形式：gitm admin publish <type> [-c --combine] [--use-rebase] [-p --prod] [-b --build [build]] [-p --postmsg]
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support | 是   | -    |

### 传值

| 名称         | 简写 | 说明                                                                  | 类型    | 可选值 | 传值必填 | 默认  |
| ------------ | ---- | --------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --combine    | -c   | 是否在合并release之后会把release同步到bugfix（仅在合并release时可用） | Boolean | -      | 否       | false |
| --prod       | -p   | 发布bugfix时，是否需要把bugfix合并到master                            | Boolean | -      | 否       | false |
| --build      | -b   | 是否使用淘宝镜像升级                                                  | Boolean | -      | 否       | false |
| --use-rebase |      | 是否使用rebase执行合并                                                | Boolean | -      | 否       | false |
| --postmsg    | -p   | 是否需要发送指令处理消息到云之家                                      | Boolean | -      | 否       | false |

1. 合并release代码到预发环境

```
gitm admin publish release
```

2. 发布并执行构建

```
# 构建全部
gitm admin publish release --build
gitm admin publish release -b
# 仅构建cloud-ui
gitm admin publish release --build cloud-ui
gitm admin publish release -b cloud-ui
```


## gitm admin update
更新release、bugfix、support分支代码，默认走merge方法

```
形式：gitm admin update <type> [--use-rebase] [-m --mode [mode]] [-p --postmsg]
```

### 参数

| 参数 | 说明     | 类型   | 可选值                 | 必填 | 默认 |
| ---- | -------- | ------ | ---------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support | 是   | -    |

### 传值

| 名称         | 简写 | 说明                                                                                                                 | 类型    | 可选值 | 传值必填 | 默认  |
| ------------ | ---- | -------------------------------------------------------------------------------------------------------------------- | ------- | ------ | -------- | ----- |
| --mode       | -m   | 出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用 | Number  | 0/1/2  | 否       | 0     |
| --use-rebase |      | 是否使用rebase执行同步                                                                                               | Boolean | -      | 否       | false |
| --postmsg    | -p   | 是否需要发送指令处理消息到云之家                                                                                     | Boolean | -      | 否       | false |

1. 更新bug分支代码

```
gitm admin update bugfix -m 2
gitm admin up bugfix -m 2
```


## gitm admin clean
Jenkins构建清理git分支专用，可传入release、bugfix、develop分支代码

```
形式：gitm admin clean <type>
```

### 参数

| 参数 | 说明     | 类型   | 可选值                        | 必填 | 默认 |
| ---- | -------- | ------ | ----------------------------- | ---- | ---- |
| type | 分支类型 | String | bugfix/release/support/master | 是   | -    |

* 清理分支

```
gitm admin clean bugfix
```

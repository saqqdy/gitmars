# gitmars
一个定制化的git工作流操作工具
每一个子命令都带了help功能，可输入 gitm command-name --help 获取对应子指令的帮助信息

## 安装
```
# 通过npm安装
npm install -g gitmars

# 或者通过yarn安装
yarn global add gitmars
```

## 使用
```
# 初始化
gitm init

# 查看配置
gitm config list [option]

# 版本升级[-m --mirror]使用淘宝镜像升级
gitm upgrade --mirror

# 查看版本
gitm -v

# 查看帮助信息
gitm --help
gitm copy -h
```

## 日常任务
创建周四任务分支(release)、日常更新BUG分支(bugfix)这两种类型的分支、项目框架相关的support分支
### gitm start
#### 短指令：gitm st
```
# 形式：gitm start <type> <name>
gitm start bugfix 20001
```

### gitm combine
#### 短指令：gitm cb
任务阶段提测，这部操作把分支代码合并到dev和bug分支，环境参数必填
```
# 形式：gitm combine <type> <name> [-d --dev] [-p --prod] [-b --build [build]] [--no-bugfix] [--as-feature]
gitm combine bugfix 20001 -pd
# 传入build名称可构建相应应用，build参数可传入all
gitm combine bugfix 20001 -d --build cloud-ui
```
```
# bugfix分支特殊情况需要合并到release时，传入--as-feature
gitm combine bugfix 20001 -p --as-feature
```
```
# support分支提交prod时会主动同步bugfix分支和release分支，传入--no-bugfix不同步到bugfix
gitm combine support 20001 -pd --no-bugfix
```

### gitm end
#### 短指令：gitm ed
任务完成，合并并删除分支，这个操作会把20001这个分支代码合并到bug分支并删除20001分支
```
# 形式：gitm end <type> <name>
gitm end bugfix 20001
```

### gitm update
#### 短指令：gitm up
把bug分支的最新代码同步到20001分支上（--use-merge使用merge方法合并，默认false）
```
# 形式：gitm update <type> <name> [--use-merge]
gitm update bugfix 20001
```

## 扩展
### gitm merge
#### 短指令：gitm mg
合并分支，类似git merge功能
```
# 形式：gitm merge <name>
gitm merge 20001
```

### gitm copy
#### 短指令：gitm cp
复制其他分支上的提交记录到当前分支（注意关键词必须是4位以上的数字，任务号或者bug编号），gitm copy一共有两种使用方式
1. 传入commit-id，把其他分支上的commit-id复制过来，执行下面指令
```
# 形式：gitm copy <from> [commitid...]
gitm copy release xxxxxx xxxxxx xxxxxx
```

2. 传入查询关键词，gitm会根据提供的关键词（为确保copy准确，请尽量完整填写关键词），在对应分支的提交记录里面搜索提交记录并自动执行copy指令
```
# 指令形式：gitm copy <from> [-k --key] [-a --author]
gitm copy dev --key 100000 --author saqqdy
```

### gitm build
#### 短指令：gitm bd
该指令用于发起Jenkins构建，project必传，app名称可传入all
```
# 形式：gitm build <project> [-e --env [env]] [-a --app [app]]
gitm build wyweb --env dev --app cloud-ui
```

### gitm branch
#### 短指令：gitm bh
提供分支搜索和删除功能（不开放删除远程分支功能）
1. 查询本地feature功能分支
```
# 形式：gitm branch [-k --key] [-t --type] [-r --remote]
# key是查询关键词，type是查询的类型，有support、bugfix、feature三种，默认查询全部，remote是否查询远程分支，默认否
gitm branch --key bug001 -r -t feature
```

2. 删除本地分支
```
# 形式：gitm branch [-d --delete] [-D --forcedelete]
# delete是正常删除分支，forcedelete强制删除
gitm branch -d bugfix/bug001
```

3. 设置本地分支与远程分支关联
```
# 形式：gitm branch [-u --upstream [upstream]]
# 设置当前分支与远程feature/1000分支关联
gitm branch -u feature/1000

# 取消当前分支与远程分支的关联
gitm branch -u
```

### gitm revert
#### 短指令：gitm rt
撤销当前分支的某条提交记录，如果需要撤销一条merge记录，需要传入撤销方式，1 = 保留当前分支代码；2 = 保留传入代码
1. 撤销最后一次提交（或者撤销倒数第n次提交）
```
# 形式：gitm revert [commitid] [-n --number]
# 撤销最后一次提交
gitm revert -n 1 --mode 1
# 或者
gitm revert -n 3
```
2. 撤销某条提交id
```
# 形式：gitm revert [commitid] [-m --mode [mode]]
gitm revert xxxxxx -m 1
```

### gitm save
#### 短指令：gitm sv
暂存代码
```
# 传入-f或者--force，程序会把没有版本库的文件执行add之后暂存起来
gitm save [-f --force]
```

### gitm get
#### 短指令：gitm gt
恢复暂存代码
```
gitm get
```

### gitm upgrade
#### 短指令：gitm ug
升级gitmars版本，可输入version指定版本，选填，默认安装最新版
```
# 输入-m或者--mirror表示使用淘宝镜像升级
gitm upgrade [version] [-m --mirror]
```

### gitm clean
清理gitmars缓存和本地配置，输入--force同时清理本地配置文件（慎用）
```
# 形式：gitm clean [-f --force]
gitm clean
```

## 管理员
### gitm admin create
创建release、bugfix、support和develop分支
```
# 形式：gitm admin create <type>
gitm admin create release
```

### gitm admin publish
发版操作
```
# 形式：gitm admin publish <type> [-c --combine] [--use-rebase] [-p --prod] [-p --postmsg]
# 传入combine时合并release之后会把release同步到bugfix
# 传入rebase使用release方法合并
# 当需要发布bugfix时，传入prod会把bugfix同步到master，不传则不合并
# postmsg：传入时有配置postmsg的指令处理消息会推送到云之家
gitm admin publish release
```

### gitm admin update
更新release、bugfix、support分支代码，默认走merge方法
```
# 形式：gitm admin update <type> [--use-rebase] [-m --mode [mode]] [-p --postmsg]
# mode：出现冲突时，保留传入代码还是保留当前代码；1=采用当前 2=采用传入；默认为 0=手动处理。本参数不可与--use-rebase同时使用
# release：传入rebase使用release方法合并，默认使用merge
# postmsg：传入时有配置postmsg的指令处理消息会推送到云之家
gitm admin update bugfix -m 2
```

### gitm admin clean
Jenkins构建清理git分支专用，可传入release、bugfix、develop分支代码
```
# 形式：gitm admin clean <type>
gitm admin clean bugfix
```

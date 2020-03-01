# gitmars
一个定制化的git工作流操作工具
每一个子命令都带了help功能，可输入 gitm command-name --help 获取对应指令的帮助信息

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
gitm config

# 查看版本
gitm -v

# 查看帮助信息
gitm --help
```

## 日常任务
创建任务分支(release)、BUG分支(bugfix)这两种类型的分支
#### gitm start
```
# 形式：gitm start <type> <name>
gitm start bugfix 20001
```

#### gitm combine
任务阶段提测，这部操作把分支代码合并到dev和bug分支
```
# 形式：gitm combine <type> <name>
gitm combine bugfix 20001
```

#### gitm end
任务完成，合并并删除分支，这个操作会把20001这个分支代码合并到bug分支并删除20001分支
```
# 形式：gitm end <type> <name>
gitm end bugfix 20001
```

#### gitm update
把bug分支的最新代码同步到20001分支上
```
# 形式：gitm update <type> <name>
gitm update bugfix 20001
```

## 扩展
#### gitm merge
合并分支，类似git merge功能
```
# 形式：gitm merge <name>
gitm merge 20001
```

#### gitm copy
复制其他分支上的提交记录到当前分支（注意关键词必须是4位以上的数字，任务号或者bug编号），gitm copy一共有两种使用方式
1. 传入commit-id，把其他分支上的commit-id复制过来，执行下面指令
```
# 形式：gitm copy <from> [commitid...]
gitm copy release xxxxxx xxxxxx xxxxxx
```

2. 传入查询关键词，gitm会根据提供的关键词（目前限制关键词必须是4位以上的数字，可以是任务号或者bug编号），在对应分支的提交记录里面搜索提交记录并自动执行copy指令
```
# 指令形式：gitm copy <from> [-k --key] [-a --author]
# 
gitm copy dev --key 100000 --author saqqdy
```

#### gitm branch
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

#### gitm save
暂存代码
```
# 传入-f或者--force，程序会把没有版本库的文件执行add之后暂存起来
gitm save [-f --force]
```

#### gitm get
恢复暂存代码
```
gitm get
```

## 管理员
创建release、bug、support分支
```
# 形式：gitm admin start <type> <name>
gitm admin start release v1.0.0
```

发版之后合代码
```
# 形式：gitm admin end <type> <name>
gitm admin end release v1.0.0
```

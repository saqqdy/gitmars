# gitmars
一个定制化的git工作流操作工具

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

# 查看帮助信息
gitm --help

# 查看版本
gitm -v
```

## 日常任务
创建任务分支(release)、BUG分支(bugfix)这两种类型的分支
```
# 形式：gitm start <type> <name>
gitm start bugfix 20001
```

任务阶段提测，这部操作把分支代码合并到dev和bug分支
```
# 形式：gitm combine <type> <name>
gitm combine bugfix 20001
```

任务完成，合并并删除分支，这个操作会把20001这个分支代码合并到bug分支并删除20001分支
```
# 形式：gitm end <type> <name>
gitm end bugfix 20001
```

把bug分支的最新代码同步到20001分支上
```
# 形式：gitm update <type> <name>
gitm update bugfix 20001
```

## 扩展
合并分支，类似git merge功能
```
# 形式：gitm merge <name>
gitm merge 20001
```

cherry-pick方式合并单次提交
```
# 形式：gitm copy [commitid...] [--grep] [--author]
gitm copy xxxxxx xxxxxx

# 或者
gitm copy --grep 100000 --author saqqdy

# 或者
gitm copy -w 100000 -a saqqdy
```

暂存代码
```
gitm save
```

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

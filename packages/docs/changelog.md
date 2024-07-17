# 更新日志

## 2024.07.17 v7.2.0

1. `miniprogramToken` `miniprogramSession` 参数从git配置中取

## 2024.06.18 v7.1.0

1. 增加`--push`传值，是否在copy之后推送目标分支到远程

## 2024.05.10 v7.0.1

1. 修复版本控制BUG

## 2024.05.10 v7.0.0

1. 重构项目，合理规划代码
2. 新增`build-mp`指令构建小程序
3. 新增`miniprogram`指令操作小程序
4. `end` `combine` 指令支持批量操作
5. `build`指令改造成可选参数形式，project参数取消必填限制
6. 构建配置支持在list里面设置token
7. 清理不需要的依赖包
8. 升级依赖包

## 2024.03.17 v6.4.0

1. 优化提示信息
2. 升级依赖包

## 2024.03.01 v6.3.0

1. `admin` `combine` 指令增加构建提示
2. 升级依赖包

## 2024.02.02 v6.2.0

1. `build`指令增加`--confirm`参数，为 true 时不显示确认框

## 2024.02.01 v6.1.0

1. build指令增加参数确认环节
2. 移除构建参数转码
3. 升级依赖包

## 2024.01.08 v6.0.0

1. 移除 `server` `ui` 两个子项目
2. 6.0.0 版本开始`token`从git config里面取`user.token`，接口不需要再返回token
3. 弃用 `gitm merge` 指令
4. 升级依赖包

## 2023.09.09 v5.3.0

1. `combine` `admin publish` `build` 指令传参增加 `--data`，用来传入其他自定义构建参数
2. 修复 `upgrade` 使用registry不生效的问题
3. 移除 `compareVersion` 方法，改用js-cool提供的compareVersion方法
4. 升级依赖包

## 2023.08.16 v5.2.0

1. 修复一些问题
2. 升级依赖包

## 2023.07.03 v5.1.6

1. 使用 [os-lang](https://githun.com/saqqdy/os-lang) 获取系统语言
2. 升级依赖包

## 2023.05.31 v5.1.5

1. 修复 bug 优化体验
2. 升级依赖包

## 2023.03.26 v5.1.3

1. 使用 [userdir](https://githun.com/saqqdy/userdir)
2. 修复类型输出
3. 升级依赖包

## 2023.02.17 v5.1.1

1. 修复`spawnSync`解析指令出错问题
2. 版本控制兼顾到 `prerelease` `premajor` `preminor` `prepatch` 版本
3. 构建输出 gitmars 类型文件
4. 升级依赖包

## 2023.02.04 v5.0.0

1. 全面改用 rollup v3.0
2. 配置参数新增 `versionControlType` 用于控制强制更新版本的类型，传入 false 则不强制更新
3. 升级依赖包，开始使用 commander v10，reinstaller v2

## 2023.01.14 v4.1.1

1. 升级依赖包

## 2023.01.05 v4.1.0

1. 增加`stringify` `isWin32` 两个方法，处理 windows 环境脚本兼容问题
2. 修复`getIsMergedTargetBranch`在 windows 下的兼容问题
3. 升级 spawn 和 spawnSync 处理 windows 环境脚本兼容问题

## 2023.01.05 v4.0.4

1. 修复`getIsMergedTargetBranch`在 windows 下的兼容问题

## 2023.01.04 v4.0.3

1. 修复`getIsMergedTargetBranch`在 windows 下的兼容问题
2. os-local 降级

## 2023.01.02 v4.0.1

1. 开始使用[reinstaller](https://github.com/saqqdy/reinstaller)

## 2022.12.30 v4.0.0

1. 适配多语言，目前支持`zh-CN` `en-US`
2. `getIsMergedTargetBranch` 方法更改入参方式，新增 strictly，更换默认的判断方式
3. 全面改用 esm 规范，放弃支持 node12 及以下版本
4. config 配置取消`msgUrl`项
5. 修复`update`指令判断是否需要合并不准确的 bug
6. global 从 core 迁出，移到 gitmars 下面
7. 重构`copy`指令，改造成自选提交记录的方式
8. 新增`prune`方法
9. 修复`checkGitStatus`方法 bug
10. 移除`lastet` `limit` 默认值设置
11. 依赖包升级

## 2022.08.22 v3.3.5

1. `combine` `update` `admin publish` `admin update`指增加`--force`，强制发起合并请求

## 2022.08.14 v3.3.4

1. `postmsg`指令支持脱离 git 目录使用

## 2022.08.12 v3.3.3

1. 修复`admin`指令合并判断不准确的遗留问题
2. 新增`fetch`公共方法

## 2022.08.12 v3.3.2

1. 修复构建流程导致 gitm-ui 无法运

## 2022.08.11 v3.3.1

1. 修复`admin`指令合并判断不准确的问题

## 2022.08.09 v3.3.0

1. `combine` `update` `admin`指令增加合并判断，不需要合并时不再合并
2. 升级依赖包版本

## 2022.07.19 v3.2.0

1. 修复`gitm get`指令取不到对应暂存内容问题
2. 修复`gitm undo`指令报错
3. 完善 typescript 类型

## 2022.07.03 v3.1.0

1. 更新 versionControl 策略,正式弃用 lite 通道

## 2022.06.12 v3.0.1

1. 优化体验
2. 修复一些问题

## 2022.06.10 v3.0.0

1. monorepo 改造，拆分成`core` `gitmars` `server` `ui` `docs`五个子项目
2. 放开`alias` 指令只能在 git 项目下面执行的限制
3. 升级依赖包版本

## 2022.04.07 v2.18.1

1. 删除分支自动执行`git remote prune origin`清理记录
2. 升级依赖包

## 2022.03.24 v2.18.0

1. 新增`gitm alias`指令，初始化：`git alias init`，移除：`git alias remove`
2. 新增别名指令使用 gitmars，可使用`git mars xxx` 或 `git flow xxx`，均等价于`gitm xxx`
3. config 配置增加`apis`，原`config.api`迁移到`config.apis.userInfo`
4. 新增`config.apis.buildConfig`接口配置，用于读取构建配置，优先级高于`config.apolloConfig`
5. 升级依赖包

## 2022.02.24 v2.17.0

1. 新增`level=3`审核员权限，审核员有合并权限可以执行`admin publish`动作，但是与管理员不同的是审核员提交代码会推送到远程。原开发者权限调整为 4

## 2022.02.24 v2.16.6

1. 优化取项目名称的逻辑

## 2021.12.27 v2.16.5

1. `approve` `review`指令增加`--quiet`，移除`--postmsg`，默认发送消息

## 2021.12.27 v2.16.4

1. 扩展`request`方法支持 gzip

## 2021.12.23 v2.16.3

1. `approve`指令优化批量操作体验

## 2021.12.23 v2.16.2

1. `approve`指令增加显示评论数量
2. 提示语调整

## 2021.12.20 v2.16.0

### 功能

1. 新增`approve`指令用于审批远程合并请求，支持差异预览，新增`gitm admin approve`指令，引用`approve`指令
2. 新增`review`指令用于 review 代码，提交 review 记录
3. 扩展`request`方法支持`PUT` `DELETE`

### 优化

1. 修复`service`缓存问题
2. 优化文档

## 2021.12.14 v2.15.4

1. 新增`status`指令查看当前分支状态

## 2021.12.13 v2.15.3

1. `log`指令增加`--json`传值，是否以 json 格式输出日志，默认表格方式

## 2021.12.12 v2.15.2

1. 新增`debug`方法，开启 debug 功能

## 2021.12.11 v2.15.1

1. `gitm ui`增加支持`undo`和`redo`
2. `gitm go`增加支持`undo`和`redo`

## 2021.12.06 v2.15.0

### 功能

1. 改用性能更好的原生脚本执行器，替代 shelljs 的`sh.exec`
2. 新增`undo`指令，用于撤回代码
3. 新增`redo`指令，用于恢复撤销的代码
4. `cleanbranch`指令流程优化，预览之后可选择分支进行清理
5. `undo`指令新增`--no-merges` `--limit` `--lastet` `--calc` `--calcAll`传参
6. `log`指令增加`--no-merges`传参，用于排除 merge 记录
7. `process.exit`替换`sh.exit`

### 优化

1. 优化读取`git log`的体验
2. 新增`echo` `gitLogsFormatter` `revertCache` `writeFileSync`等方法
3. 移除`filterBranch`方法
4. 完善`typescript`类型

## 2021.12.02 v2.14.6

1. 替换调起构建和推送群消息的`curl`脚本，处理 win7 不能执行 curl 的兼容问题

## 2021.12.02 v2.14.5

1. `queue`方法扩展支持 promise 函数
2. 替换创建远程合并请求的`curl`脚本，处理 win7 不能执行 curl 的兼容问题
3. 解决脚本队列`continue`缓存保存失败的问题
4. 解决`circular dependency`问题

## 2021.11.30 v2.14.4

1. 替换`curl`脚本，处理 win7 不能执行 curl 的兼容问题
2. 封装`request`方法

## 2021.11.28 v2.14.3

1. `cleanbranch`指令不再主动切换分支
2. `log`指令体验优化

## 2021.11.27 v2.14.2

1. `cleanbranch`指令优化提示信息
2. `ui`界面支持`cleanbranch`/`admin publish`/`clean`/`log`四个指令

## 2021.11.26 v2.14.1

1. 优化代码
2. 开源协议换成`GPL-3.0`

## 2021.11.26 v2.14.0

1. 重构核心代码
2. `cleanbranch`指令放开仅支持二级分支的限制

## 2021.11.22 v2.13.9

1. `cleanbranch`指令增加`--key`传参，传递筛选关键词
2. `cleanbranch`指令新增`--include`传参，用于正则筛选分支
3. `cleanbranch`指令`--except`传参更改为`--exclude`，用法不变

## 2021.11.21 v2.13.8

1. 优化脚本执行提示，增加`processing`状态提示
2. `clean`指令不再清理 gitmars 配置，`--force`传参改为是否要删除执行缓存
3. 优化`upgrade`指令流程
4. 优化`clean`指令体验

## 2021.11.20 v2.13.7

1. `cleanbranch`指令增加`branches`参数，用于指定清理分支，多个分支空格隔开
2. `cleanbranch`指令增加`--target`传参，用于指定需要判断是否合过的目标分支，多个分支逗号隔开，默认：develop,release
3. 优化提示

## 2021.11.20 v2.13.6

1. `cleanbranch`指令兼容旧版本 git

## 2021.11.19 v2.13.5

1. `cleanbranch`指令增加`--confirm`参数，为 true 时不显示确认框
2. 修复判断不准确的问题

## 2021.11.19 v2.13.3

1. `cleanbranch`指令放开权限控制
2. `go`指令支持 cleanbranch

## 2021.11.19 v2.13.2

1. `searchBranches`方法改进，删除`local`参数
2. 纠正 branchs 单词错误

## 2021.11.19 v2.13.1

1. `cleanbranch`指令增加`--list`参数，删除前可以先预览
2. `cleanbranch`指令流程优化，加上了动效和提示
3. `cleanbranch`增加短指令`gitm clb`
4. `cleanbranch`指令增加权限控制，仅管理员以上的级别（level < 3）可执行
5. `cleanbranch`指令执行前自动切分支

## 2021.11.18 v2.13.0

1. 新增`cleanbranch`指令，清理合并过的功能分支
2. `searchBranches`方法改进，支持多类型查找，增加`local`参数和`exclude`正则排除

## 2021.11.18 v2.12.8

1. `go`指令支持 clean 方法
2. `clean`指令流程优化

## 2021.11.17 v2.12.7

1. 修复`start`指令从 tag 创建分支报 code 不存在的问题

## 2021.11.16 v2.12.6

1. 构建配置支持保存多个了
2. `clean`指令支持清理`packageInfo`缓存

## 2021.11.14 v2.12.5

1. `continue`指令执行前检测是否遗忘了 commit 代码

## 2021.11.12 v2.12.3

1. 解决 Windows 环境`UI`界面的`xterm`运行报错问题

## 2021.11.11 v2.12.2

1. 运行构建支持多应用逗号隔开

## 2021.11.11 v2.12.1

1. `copy`指令去掉执行推送动作

## 2021.11.10 v2.12.0

### 功能

1. `combine` `end` `start` `update`指令加上了版本检测，解决碎片化问题
2. `apollo`配置缓存方案调整
3. 新增`packageInfo`缓存

### 优化

1. typescript 类型完善
2. `apollo`读配置方案优化

## 2021.11.08 v2.11.1

1. 修复是否合并过`dev`分支判断不准确的问题

## 2021.11.08 v2.11.0

### 功能

1. 增加全局配置`descriptionValidator`，用于校验提交的原因描述，支持输入正则表达式和正则字符串
2. `combine` `end` `admin.publish` `admin.update`这几个需要调起远程合并请求的方法增加`--description`传参，增加校验

### 优化

1. 抽离出生成 shell 脚本的方法

## 2021.11.06 v2.10.2

### 功能

1. `upgrade`指令增加`--registry`和`--client`传参，用于指定镜像地址和执行客户端

## 2021.11.05 v2.10.1

### 优化

1. `combine`和`end`指令判断是否合并过 dev 默认使用远程分支

## 2021.11.02 v2.10.0

### 功能

1. `copy`指令使用方式调整，from 参数改成`--source`传参。使用：`gitm copy [commitid...]` 或者 `gitm copy [-s --source [source]] [-k --key [keyword]] [-a --author [author]]`
2. `copy`指令在使用模糊查询批量 copy 时，`--key`参数必传，且不能少于 3 个字

### 优化

1. `continue`指令在执行成功后清理执行缓存

## 2021.10.31 v2.9.7

1. 调整数据库存放位置，避免升级之后数据丢失
2. `log`指令开放更多日志详情

## 2021.10.30 v2.9.6

1. `end`指令智能判断是否需要合并代码，不传`--no-combine`时，不需要合并的时候不会发起合并操作
2. `getIsMergedDevBranch`改为`getIsMergedTargetBranch`，新增`remote`参数
3. 抽象`getIsBranchOrCommitExist`方法的判断分支或 commit 是否存在

## 2021.10.29 v2.9.5

1. 优化`getIsUpdatedInTime`方法的判断策略

## 2021.10.28 v2.9.4

1. 新增`nameValidator`配置参数，用于校验分支名合法性，支持输入正则表达式和正则字符串
2. 分支名支持输入斜杠：`gitm start feature saqqdy/10000`

## 2021.10.28 v2.9.3

1. 修复自定义端口启动`UI`不生效的问题

## 2021.10.25 v2.9.2

1. `ui`指令增加`--port`参数，自定义端口号

## 2021.10.24 v2.9.1

1. 依赖包升级
2. 完善文档

## 2021.10.23 v2.9.0

1. `go`指令增加`command`参数，直接进入对应的指令
2. 完善每个指令的 help 提示信息
3. 完善 type 类型

## 2021.10.22 v2.8.9

1. 完善 UI 界面创建分支的功能
2. 优化用户体验

## 2021.10.22 v2.8.8

1. 解决跨平台脚本转义问题

## 2021.10.22 v2.8.6

1. `gitm ui`执行后自动打开浏览器

## 2021.10.21 v2.8.5

1. 修复是否合并过`dev`判断不准确的问题

## 2021.10.20 v2.8.3

1. 解决判断是否合过 dev 的 BUG
2. 解决方法导出方式错误

## 2021.10.20 v2.8.0

1. `start`指令支持从 tag 创建 bugfix 分支

## 2021.10.19 v2.7.0

1. 纠正`log`和`hook`指令参数错误：`latest`改成`lastet`
2. `combine`指令新增是否同步过 dev 分支判断，没有同步过的不允许合 prod
3. `combine`指令新增是否超过 1 周没有同步过主干代码判断

## 2021.10.18 v2.6.5

1. 优化`ui`用户体验
2. `end`指令删除分支时加上了判断
3. 修复几个配置 BUG

## 2021.10.18 v2.6.4

1. 修复`end`指令`--no-combine`参数不生效的问题

## 2021.10.17 v2.6.3

1. `ui`界面优化，task 和工作流分拆成 2 个 Terminal，互不干扰
2. 体验和样式优化

## 2021.10.16 v2.6.2

1. 修复`ui`的几个 bug

## 2021.10.15 v2.6.1

1. `end`指令增加`--as-feature`和`--no-combine`参数
2. 依赖包升级
3. 优化代码

## 2021.09.17 v2.6.0

1. typescript 重构`server`
2. `get`指令优化

## 2021.09.12 v2.5.1

1. `upgrade`指令的`version`参数支持输入 tag 名称：`alpha`、`beta`、`release`、`lite`、`latest`、`next`、`x.x.x`，默认值为`latest`

## 2021.09.12 v2.5.0

1. typescript 重构项目
2. 清理`bin`目录减小 npm 包体积
3. 修复`upgrade`执行报错

## 2021.09.04 v2.4.0

1. `gitm ui`迁移到`vue3+vite+typescript`框架
2. 清理`static`目录减小 npm 包体积

## 2021.08.28 v2.3.0

1. 调整`link`/`unlink`使用方式
2. 减小`npm`包体积

## 2021.08.25 v2.2.10

1. 调整构建配置的存放目录
2. 指令加上运行环境校验
3. 依赖包升级

## 2021.08.20 v2.2.9

1. `gitm end`指令同步删除远程分支
2. `branch`指令开放删除远程分支功能
3. `go`指令新增支持`link`/`unlink`/`postmsg`

## 2021.08.10 v2.2.8

1. 解决`postmsg`中文乱码问题

## 2021.08.10 v2.2.7

1. 发起`git`操作请求时发送群消息通知
2. `postmsg`指令支持配置自定义消息通知`url`

## 2021.08.05 v2.2.6

1. 修复`windows`发起合并请求失败的问题

## 2021.07.22 v2.2.5

1. 修复无合并权限调不了`dev`构建的问题
2. 弃用`babel`拥抱`esbuild`
3. 清理不需要的依赖包，修复了几处代码问题

## 2021.07.15 v2.2.4

1. 修复无合并权限调起了构建的问题

## 2021.07.04 v2.2.3

1. `gitm update`支持`--all`一键升级本地所有分支
2. `gitm update`改为默认使用`merge`方式更新代码，新增`--use-rebase`参数
3. 新增一个搜索分支的方法，提升搜索性能

## 2021.05.29 v2.2.2

1. 整理文档

## 2021.05.15 v2.2.1

1. 整理代码

## 2021.05.15 v2.2.0

1. `gitmars UI`界面启动方式优化
2. 依赖包升级
3. 修复一些 BUG

## 2021.05.03 v2.1.0

1. `go`指令新增支持 `admin.create`/`admin.update`/`admin.clean`/`branch`/`get`/`save`/`copy`/`revert` 这些指令
2. 参数验证优先使用子选项的配置

## 2021.04.27 v2.0.3

1. 新增`admin`指令自动创建`merge`请求,优化判断逻辑

## 2021.03.27 v2.0.2

1. 新增`gitm ui`指令，启动 UI 界面
2. 新增无 git 权限自动调起合并请求的功能，需要配置`api`、`gitHost`、`gitID`，具体配置查阅：[Gitmars 基本配置](http://www.saqqdy.com/gitmars/guide/basic-config.html)
3. 升级`checkBranch`、`searchBranches`、`getCurrentBranch`方法，执行更加高效
4. 取消强制配置 api
5. `git config`和`git init`加入对`api`/`gitHost`/`gitID`参数设置的支持

## 2021.1.29 v1.4.2

1. 依赖包升级
2. 解决 bug

## 2021.1.11 v1.4.1

1. 升级获取 `config` 的方法,升级更新 `config` 的方法
2. 优化读取 `gitmars` 配置和 git 配置的方式
3. 更改配置方式，逐步弃用 `gitmarsconfig.json`，改用`.gitmarsrc`
4. 修复 `Apollo` 配置问题

## 2020.12.29 v1.4.0

1. 新增 `go` 指令，免去记指令的烦恼，目前支持 `admin.publish`/`build`/`combine`/`end`/`start`/`update` 这些指令

## 2020.10.16 v1.3.6

1. 新增 `postmsg` 指令用于推送消息

## 2020.08.14 v1.3.4

1. `bugfix` 分支使用`--as-feature` 合并时不主动和 `bug` 线
2. 指令配置抽离，为 `gitmars ui` 做准备

## 2020.08.14 v1.3.3

1. 更换获取当前分支状态的方法

## 2020.08.02 v1.3.2

1. 更换获取当前分支名称的方式，解决 Windows 环境兼容问题

## 2020.07.23 v1.3.1

1. 优化 `link`/`unlink`，兼容 Windows 系统

## 2020.07.22 v1.3.0

1. 新增 `link` 指令，用来创建本地包软链接

## 2020.07.07 v1.2.9

1. `combine` 指令判断 `status` 优化
2. 依赖包升级

## 2020.07.07 v1.2.8

1. 修复 `jenkins` 调不起 BUG

## 2020.06.30 v1.2.7

1. 升级 `combine`/`end`/`update` 指令，分支名称可以不传，默认合并/结束/更新当前分支
2. `combine` 指令新增`-a` 和`-m` 参数，传入可自动执行 `add` 和 `commit`
3. 文档升级

## 2020.06.27 v1.2.6

1. 升级 `upgrade` 指令，Windows 用户终于能用上升级指令了！

## 2020.06.27 v1.2.5

1. 升级 `get`/`save` 指令，暂存区“绑定”git 分支，新增高级用法
2. 修复 `config` 指令 bug
3. 修复 `continue` 指令 bug

## 2020.06.16 v1.2.4

1. 修复在 node v14 版本下的兼容问题
2. 修复包缺失 BUG
3. 代码转 ES5 发布

## 2020.05.29 v1.2.2

1. 新增 `build` 指令调起 Jenkins 构建
2. `combine` 和 `admin publish` 指令新增`--build` 参数，在合并完代码时调起 Jenkins 构建
3. 构建配置从远程获取并缓存 24 小时，过期或者执行 `gitm clean` 后会自动重新请求配置
4. 优化代码结构，清理冗余操作，提升性能
5. 修复历史 BUG

## 2020.05.21 v1.1.2

1. 修复 `permission` 偶尔判断不准确的问题（重要）

## 2020.05.19 v1.1.1

1. 增加 `clean` 指令用来清除 gitmars 缓存和配置文件
2. `upgrade` 指令增加 `version` 参数支持升级指定版本

## 2020.05.19 v1.1.0

1. 新增 `permission` 指令，用来限制 `master` 分支直接提交的错误操作
2. 优化执行逻辑，允许在子目录运行 `gitm`
3. 优化日志功能和执行时的输出信息，不再输出大段乱码

## 2020.05.15 v1.0.20

1. 修复 `copy` 指令 BUG

## 2020.05.13 v1.0.19

1. `update` 指令新增`--use-merge` 配置
2. `admin` 指令`--rebase` 配置调整为`--use-rebase`

## 2020.05.11 v1.0.18

1. `copy` 指令去除关键词限制
2. 版本升级指令优化
3. 指令运行提示优化

## 2020.04.28 v1.0.17

1. `combine` 指令新增`--as-feature` 配置，`bugfix` 分支特殊情况需要合并到 `release` 时，传入`--as-feature`

## 2020.04.17 v1.0.16

1. 优化消息提示

## 2020.04.08 v1.0.15

1. 优化指令
2. 新增支持 `postmsg` 的指令

## 2020.04.08 v1.0.14

1. `combine` 指令合并 `support` 类型的分支时允许传入`--no-bugfix` 不合并到 `bug` 分支
2. 新增 `postmsg` 开关
3. 优化指令执行消息提示

## 2020.04.02 v1.0.13

1. `gitm branch`支持设置与远程分支关联
2. 新增 `upgrade` 方法

## 2020.03.31 v1.0.12

1. `start` 指令创建分支自动拉取最新代码

## 2020.03.27 v1.0.11

1. 更新 `bugfix` 和 `release` 分支支持强制使用传入代码或当前代码
2. 推送消息支持模板配置。目前支持参数：`message`、`time`、`project`、`pwd`(执行目录)、`user`(本地配置的用户名)。默认模板：`${message}；项目：${project}；路径：${pwd}`

## 2020.03.25 v1.0.10

1. 加入了消息推送
2. 切换分支判断有未加入版本的文件时不再阻止运行
3. `admin` 方法优化

## 2020.03.22 v1.0.9

1. 调整 `admin` 合并策略
2. 修复部分 Windows 兼容问题

## 2020.03.18 v1.0.8

1. 新增对 `support` 分支支持

## 2020.03.08 v1.0.7

1. 优化 `gitm revert` 功能
2. 优化指令执行提示方式

## 2020.03.04 v1.0.6

1. `admin` 新增 `clean` 指令，用于 Jenkins 构建时候清理分支
2. 更新 `readme`

## 2020.03.02 v1.0.5

1. 新增 `continue` 和 `branch` 方法;
2. 改进执行执行主程序;
3. 加入 `log`;
4. 改进 `copy` 功能;
5. 修改部分 BUG;
6. 指令执行方法优化;
7. 代码优化;
8. 完善 `readme`;
9. 完善 `end` 和 `start` 功能;
10. 完善 `admin` 功能：`update`、`create`、`publish`

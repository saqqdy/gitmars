# 2021.08.28 v2.3.0 更新日志

1. 调整link/unlink使用方式

# 2021.08.25 v2.2.10 更新日志

1. 调整构建配置的存放目录
2. 指令加上运行环境校验
3. 依赖包升级

# 2021.08.20 v2.2.9 更新日志

1. gitm end指令同步删除远程分支
2. branch指令开放删除远程分支功能
3. go指令新增支持link/unlink/postmsg

# 2021.08.10 v2.2.8 更新日志

1. 解决postmsg中文乱码问题

# 2021.08.10 v2.2.7 更新日志

1. 发起git操作请求时发送群消息通知
2. postmsg指令支持配置自定义消息通知url

# 2021.08.05 v2.2.6 更新日志

1. 修复windows发起合并请求失败的问题

# 2021.07.22 v2.2.5 更新日志

1. 修复无合并权限调不了dev构建的问题
2. 弃用babel拥抱esbuild
3. 清理不需要的依赖包，修复了几处代码问题

# 2021.07.15 v2.2.4 更新日志

1. 修复无合并权限调起了构建的问题

# 2021.07.04 v2.2.3 更新日志

1. gitm update支持--all一键升级本地所有分支
2. gitm update改为默认使用merge方式更新代码，新增--use-rebase参数
3. 新增一个搜索分支的方法，提升搜索性能

# 2021.05.29 v2.2.2 更新日志

1. 整理文档

# 2021.05.15 v2.2.1 更新日志

1. 整理代码

# 2021.05.15 v2.2.0 更新日志

1. gitmars UI界面启动方式优化
2. 依赖包升级
3. 修复一些BUG

# 2021.05.03 v2.1.0 更新日志

1. go指令新增支持 admin.create/admin.update/admin.clean/branch/get/save/copy/revert 这些指令
2. 参数验证优先使用子选项的配置

# 2021.04.27 v2.0.3更新日志
1. 新增admin指令自动创建merge请求,优化判断逻辑

# 2021.03.27 v2.0.2更新日志
1. 新增gitm ui指令，启动UI界面
2. 新增无git权限自动调起合并请求的功能，需要配置api、gitHost、gitID，具体配置查阅：[Gitmars基本配置](http://www.saqqdy.com/gitmars/guide/basic-config.html)
3. 升级checkBranch、searchBranchs、getCurrent方法，执行更加高效
4. 取消强制配置api
5. git config和git init加入对api/gitHost/gitID参数设置的支持

# 2021.1.29 v1.4.2 更新日志

1. 依赖包升级
2. 解决 bug

# 2021.1.11 v1.4.1 更新日志

1. 升级获取 config 的方法,升级更新 config 的方法
2. 优化读取 gitmars 配置和 git 配置的方式
3. 更改配置方式，逐步弃用 gitmarsconfig.json，改用.gitmarsrc
4. 修复 Apollo 配置问题

# 2020.12.29 v1.4.0 更新日志

1. 新增 go 指令，免去记指令的烦恼，目前支持 admin.publish/build/combine/end/start/update 这些指令

# 2020.10.16 v1.3.6 更新日志

1. 新增 postmsg 指令用于推送消息

# 2020.08.14 v1.3.4 更新日志

1. bugfix 分支使用--as-feature 合并时不主动和 bug 线
2. 指令配置抽离，为 gitmars ui 做准备

# 2020.08.14 v1.3.3 更新日志

1. 更换获取当前分支状态的方法

# 2020.08.02 v1.3.2 更新日志

1. 更换获取当前分支名称的方式，解决 Windows 环境兼容问题

# 2020.07.23 v1.3.1 更新日志

1. 优化 link/unlink，兼容 Windows 系统

# 2020.07.22 v1.3.0 更新日志

1. 新增 link 指令，用来创建本地包软链接

# 2020.07.07 v1.2.9 更新日志

1. combine 指令判断 status 优化
2. 依赖包升级

# 2020.07.07 v1.2.8 更新日志

1. 修复 jerkins 调不起 BUG

# 2020.06.30 v1.2.7 更新日志

1. 升级 combine/end/update 指令，分支名称可以不传，默认合并/结束/更新当前分支
2. combine 指令新增-a 和-m 参数，传入可自动执行 add 和 commit
3. 文档升级

# 2020.06.27 v1.2.6 更新日志

1. 升级 upgrade 指令，Windows 用户终于能用上升级指令了！

# 2020.06.27 v1.2.5 更新日志

1. 升级 get/save 指令，暂存区“绑定”git 分支，新增高级用法
2. 修复 config 指令 bug
3. 修复 continue 指令 bug

# 2020.06.16 v1.2.4 更新日志

1. 修复在 node v14 版本下的兼容问题
2. 修复包缺失 BUG
3. 代码转 ES5 发布

# 2020.05.29 v1.2.2 更新日志

1. 新增 build 指令调起 Jenkins 构建
2. combine 和 admin publish 指令新增--build 参数，在合并完代码时调起 Jenkins 构建
3. 构建配置从远程获取并缓存 24 小时，过期或者执行 gitm clean 后会自动重新请求配置
4. 优化代码结构，清理冗余操作，提升性能
5. 修复历史 BUG

# 2020.05.21 v1.1.2 更新日志

1. 修复 permission 偶尔判断不准确的问题（重要）

# 2020.05.19 v1.1.1 更新日志

1. 增加 clean 指令用来清除 gitmars 缓存和配置文件
2. upgrade 指令增加 version 参数支持升级指定版本

# 2020.05.19 v1.1.0 更新日志

1. 新增 permission 指令，用来限制 master 分支直接提交的错误操作
2. 优化执行逻辑，允许在子目录运行 gitm
3. 优化日志功能和执行时的输出信息，不再输出大段乱码

# 2020.05.15 v1.0.20 更新日志

1.  修复 copy 指令 BUG

# 2020.05.13 v1.0.19 更新日志

1.  update 指令新增--use-merge 配置
2.  admin 指令--rebase 配置调整为--use-rebase

# 2020.05.11 v1.0.18 更新日志

1. copy 指令去除关键词限制
2. 版本升级指令优化
3. 指令运行提示优化

# 2020.04.28 v1.0.17 更新日志

1. combine 指令新增--as-feature 配置，bugfix 分支特殊情况需要合并到 release 时，传入--as-feature

# 2020.04.17 v1.0.16 更新日志

1. 优化消息提示

# 2020.04.08 v1.0.15 更新日志

1. 优化指令
2. 新增支持 postmsg 的指令

# 2020.04.08 v1.0.14 更新日志

1. combine 指令合并 support 类型的分支时允许传入--no-bugfix 不合并到 bug 分支
2. 新增 postmsg 开关
3. 优化指令执行消息提示

# 2020.04.02 v1.0.13 更新日志

1. gitm branch 支持设置与远程分支关联
2. 新增 upgrade 方法

# 2020.03.31 v1.0.12 更新日志

1. start 指令创建分支自动拉取最新代码

# 2020.03.27 v1.0.11 更新日志

1. 更新 bugfix 和 release 分支支持强制使用传入代码或当前代码
2. 云之家推送消息支持模板配置。目前支持参数：message、time、project、pwd(执行目录)、user(本地配置的用户名)。默认模板：`${message}；项目：${project}；路径：${pwd}`

# 2020.03.25 v1.0.10 更新日志

1. 加入了云之家消息推送
2. 切换分支判断有未加入版本的文件时不再阻止运行
3. admin 方法优化

# 2020.03.22 v1.0.9 更新日志

1. 调整 admin 合并策略
2. 修复部分 Windows 兼容问题

# 2020.03.18 v1.0.8 更新日志

1. 新增对 support 分支支持

# 2020.03.08 v1.0.7 更新日志

1. 优化 gitm revert 功能
2. 优化指令执行提示方式

# 2020.03.04 v1.0.6 更新日志

1. admin 新增 clean 指令，用于 Jenkins 构建时候清理分支
2. 更新 readme

# 2020.03.02 v1.0.5 更新日志

1. 新增 continue 和 branch 方法;
2. 改进执行执行主程序;
3. 加入 log;
4. 改进 copy 功能;
5. 修改部分 BUG;
6. 指令执行方法优化;
7. 代码优化;
8. 完善 readme;
9. 完善 end 和 start 功能;
10. 完善 admin 功能：update、create、publish

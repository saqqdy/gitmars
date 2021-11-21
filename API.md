## Functions

<dl>
<dt><a href="#checkGitDirEnv">checkGitDirEnv()</a></dt>
<dd><p>检查git环境变量</p>
</dd>
<dt><a href="#getConfig">getConfig()</a> ⇒ <code>Object</code></dt>
<dd><p>读取配置</p>
</dd>
<dt><a href="#getConfigFrom">getConfigFrom()</a> ⇒ <code>Number</code></dt>
<dd><p>读取配置来源</p>
</dd>
<dt><a href="#debug">debug()</a></dt>
<dd><p>debug</p>
</dd>
<dt><a href="#getConfig">getConfig(pathName)</a> ⇒ <code>Object</code></dt>
<dd><p>读取配置</p>
</dd>
<dt><a href="#getGitConfig">getGitConfig()</a> ⇒ <code>Object</code></dt>
<dd><p>获取git配置</p>
</dd>
<dt><a href="#getGitVersion">getGitVersion()</a> ⇒ <code>String</code></dt>
<dd><p>获取git版本</p>
</dd>
<dt><a href="#gitRevParse">gitRevParse()</a> ⇒ <code>Object</code></dt>
<dd><p>获取git路径</p>
</dd>
<dt><a href="#writeFile">writeFile()</a></dt>
<dd><p>写文件</p>
</dd>
<dt><a href="#mapTemplate">mapTemplate()</a></dt>
<dd><p>获取模板数据</p>
</dd>
<dt><a href="#getSeconds">getSeconds()</a></dt>
<dd><p>传入字符串转换成时间（秒）</p>
</dd>
<dt><a href="#wait">wait()</a></dt>
<dd><p>递归执行程序</p>
</dd>
<dt><a href="#queue">queue(list)</a></dt>
<dd><p>脚本执行主程序</p>
</dd>
<dt><a href="#getCache">getCache()</a> ⇒ <code>Array</code></dt>
<dd><p>获取未执行脚本列表</p>
</dd>
<dt><a href="#setCache">setCache()</a></dt>
<dd><p>存储未执行脚本列表</p>
</dd>
<dt><a href="#setLog">setLog()</a></dt>
<dd><p>存储错误日志</p>
</dd>
<dt><a href="#getStatusInfo">getStatusInfo()</a> ⇒ <code>Boolean</code></dt>
<dd><p>获取分支状态</p>
</dd>
<dt><a href="#getStatus">getStatus()</a> ⇒ <code>Boolean</code></dt>
<dd><p>获取是否有未提交的文件</p>
</dd>
<dt><a href="#getLogs">getLogs()</a> ⇒ <code>Array</code></dt>
<dd><p>获取日志</p>
</dd>
<dt><a href="#checkBranch">checkBranch()</a> ⇒ <code>Boolean</code></dt>
<dd><p>获取是否有某个分支</p>
</dd>
<dt><a href="#getCurrent">getCurrent()</a> ⇒ <code>String</code></dt>
<dd><p>获取当前分支</p>
</dd>
<dt><a href="#searchBranch">searchBranch()</a> ⇒ <code>Array</code></dt>
<dd><p>获取当前分支</p>
</dd>
<dt><a href="#searchBranches">searchBranches()</a> ⇒ <code>Array</code></dt>
<dd><p>获取当前分支</p>
</dd>
<dt><a href="#filterBranch">filterBranch()</a> ⇒ <code>Array</code></dt>
<dd><p>搜索分支</p>
</dd>
<dt><a href="#getStashList">getStashList()</a> ⇒ <code>String</code></dt>
<dd><p>获取暂存区列表</p>
</dd>
<dt><a href="#getMessage">getMessage()</a></dt>
<dd><p>解析模板数据</p>
</dd>
<dt><a href="#postMessage">postMessage()</a></dt>
<dd><p>生成消息</p>
</dd>
<dt><a href="#sendMessage">sendMessage()</a></dt>
<dd><p>发送消息</p>
</dd>
<dt><a href="#getCommandMessage">getCommandMessage()</a></dt>
<dd><p>获取通用的指令提示信息</p>
</dd>
<dt><a href="#compareVersion">compareVersion(appName, compareVer, userAgent)</a> ⇒ <code>Boolean</code> | <code>null</code></dt>
<dd><p>compareVersion版本号大小对比</p>
</dd>
<dt><a href="#getBranchesFromID">getBranchesFromID()</a> ⇒ <code>Array</code></dt>
<dd><p>获取包含commitID的分支</p>
</dd>
<dt><a href="#getGitUser">getGitUser()</a> ⇒ <code>String</code></dt>
<dd><p>获取git用户名称</p>
</dd>
<dt><a href="#getGitEmail">getGitEmail()</a> ⇒ <code>String</code></dt>
<dd><p>获取git用户邮箱</p>
</dd>
<dt><a href="#getIsGitProject">getIsGitProject()</a> ⇒ <code>String</code></dt>
<dd><p>获取当前是否git项目目录</p>
</dd>
<dt><a href="#readPkg">readPkg()</a> ⇒ <code>Object</code></dt>
<dd><p>读取配置</p>
</dd>
<dt><a href="#sendGroupMessage">sendGroupMessage()</a></dt>
<dd><p>发送群消息</p>
</dd>
<dt><a href="#writeFile">writeFile()</a></dt>
<dd><p>写文件</p>
</dd>
<dt><a href="#createArgs">createArgs()</a></dt>
<dd><p>生成参数</p>
</dd>
<dt><a href="#encodeUnicode">encodeUnicode(str)</a> ⇒ <code>String</code></dt>
<dd><p>中文转unioncode</p>
</dd>
<dt><a href="#decodeUnicode">decodeUnicode(str)</a> ⇒ <code>String</code></dt>
<dd><p>中文转unioncode</p>
</dd>
</dl>

<a name="checkGitDirEnv"></a>

## checkGitDirEnv()

检查 git 环境变量

**Kind**: global function  
<a name="getConfig"></a>

## getConfig() ⇒ <code>Object</code>

读取配置

**Kind**: global function  
**Returns**: <code>Object</code> - arr 返回配置对象  
<a name="getConfigFrom"></a>

## getConfigFrom() ⇒ <code>Number</code>

读取配置来源

**Kind**: global function  
**Returns**: <code>Number</code> - 返回来源 0，1，2  
<a name="debug"></a>

## debug()

debug

**Kind**: global function  
<a name="getConfig"></a>

## getConfig(pathName) ⇒ <code>Object</code>

读取配置

**Kind**: global function  
**Returns**: <code>Object</code> - arr 返回配置对象

| Param    | Type                | Description                                  |
| -------- | ------------------- | -------------------------------------------- |
| pathName | <code>String</code> | 可传入目录或者文件，传入文件时，直接读取文件 |

<a name="getGitConfig"></a>

## getGitConfig() ⇒ <code>Object</code>

获取 git 配置

**Kind**: global function  
**Returns**: <code>Object</code> - arr 返回对象  
<a name="getGitVersion"></a>

## getGitVersion() ⇒ <code>String</code>

获取 git 版本

**Kind**: global function  
**Returns**: <code>String</code> - str 返回版本号  
<a name="gitRevParse"></a>

## gitRevParse() ⇒ <code>Object</code>

获取 git 路径

**Kind**: global function  
**Returns**: <code>Object</code> - arr 返回对象  
<a name="writeFile"></a>

## writeFile()

写文件

**Kind**: global function  
<a name="mapTemplate"></a>

## mapTemplate()

获取模板数据

**Kind**: global function  
<a name="getSeconds"></a>

## getSeconds()

传入字符串转换成时间（秒）

**Kind**: global function  
<a name="wait"></a>

## wait()

递归执行程序

**Kind**: global function  
<a name="queue"></a>

## queue(list)

脚本执行主程序

**Kind**: global function

| Param | Type               | Description |
| ----- | ------------------ | ----------- |
| list  | <code>Array</code> | 脚本序列    |

<a name="getCache"></a>

## getCache() ⇒ <code>Array</code>

获取未执行脚本列表

**Kind**: global function  
**Returns**: <code>Array</code> - arr 返回数组  
<a name="setCache"></a>

## setCache()

存储未执行脚本列表

**Kind**: global function  
<a name="setLog"></a>

## setLog()

存储错误日志

**Kind**: global function  
<a name="getStatusInfo"></a>

## getStatusInfo() ⇒ <code>Boolean</code>

获取分支状态

**Kind**: global function  
**Returns**: <code>Boolean</code> - true 返回 true/false  
<a name="getStatus"></a>

## getStatus() ⇒ <code>Boolean</code>

获取是否有未提交的文件

**Kind**: global function  
**Returns**: <code>Boolean</code> - true 返回 true/false  
<a name="getLogs"></a>

## getLogs() ⇒ <code>Array</code>

获取日志

**Kind**: global function  
**Returns**: <code>Array</code> - true 返回列表  
<a name="checkBranch"></a>

## checkBranch() ⇒ <code>Boolean</code>

获取是否有某个分支

**Kind**: global function  
**Returns**: <code>Boolean</code> - true 返回 true/false  
<a name="getCurrent"></a>

## getCurrent() ⇒ <code>String</code>

获取当前分支

**Kind**: global function  
**Returns**: <code>String</code> - 返回名称  
<a name="searchBranch"></a>

## searchBranch() ⇒ <code>Array</code>

获取当前分支

**Kind**: global function  
**Returns**: <code>Array</code> - 返回列表数组  
<a name="searchBranches"></a>

## searchBranches() ⇒ <code>Array</code>

获取当前分支

**Kind**: global function  
**Returns**: <code>Array</code> - 返回列表数组  
<a name="filterBranch"></a>

## filterBranch() ⇒ <code>Array</code>

搜索分支

**Kind**: global function  
**Returns**: <code>Array</code> - 返回列表数组  
<a name="getStashList"></a>

## getStashList() ⇒ <code>String</code>

获取暂存区列表

**Kind**: global function  
**Returns**: <code>String</code> - 返回名称  
<a name="getMessage"></a>

## getMessage()

解析模板数据

**Kind**: global function  
<a name="postMessage"></a>

## postMessage()

生成消息

**Kind**: global function  
<a name="sendMessage"></a>

## sendMessage()

发送消息

**Kind**: global function  
<a name="getCommandMessage"></a>

## getCommandMessage()

获取通用的指令提示信息

**Kind**: global function  
<a name="compareVersion"></a>

## compareVersion(appName, compareVer, userAgent) ⇒ <code>Boolean</code> \| <code>null</code>

compareVersion 版本号大小对比

**Kind**: global function  
**Returns**: <code>Boolean</code> \| <code>null</code> - null/true/false

| Param      | Type                | Description                             |
| ---------- | ------------------- | --------------------------------------- |
| appName    | <code>String</code> | app 名称                                |
| compareVer | <code>String</code> | 必传 需要对比的版本号                   |
| userAgent  | <code>String</code> | ua，可不传，默认取 navigator.appVersion |

<a name="getBranchesFromID"></a>

## getBranchesFromID() ⇒ <code>Array</code>

获取包含 commitID 的分支

**Kind**: global function  
**Returns**: <code>Array</code> - 返回数组  
<a name="getGitUser"></a>

## getGitUser() ⇒ <code>String</code>

获取 git 用户名称

**Kind**: global function  
**Returns**: <code>String</code> - 返回字符串  
<a name="getGitEmail"></a>

## getGitEmail() ⇒ <code>String</code>

获取 git 用户邮箱

**Kind**: global function  
**Returns**: <code>String</code> - 返回字符串  
<a name="getIsGitProject"></a>

## getIsGitProject() ⇒ <code>String</code>

获取当前是否 git 项目目录

**Kind**: global function  
**Returns**: <code>String</code> - 返回字符串  
<a name="readPkg"></a>

## readPkg() ⇒ <code>Object</code>

读取配置

**Kind**: global function  
**Returns**: <code>Object</code> - arr 返回配置对象  
<a name="sendGroupMessage"></a>

## sendGroupMessage()

发送群消息

**Kind**: global function  
<a name="writeFile"></a>

## writeFile()

写文件

**Kind**: global function  
<a name="createArgs"></a>

## createArgs()

生成参数

**Kind**: global function  
<a name="encodeUnicode"></a>

## encodeUnicode(str) ⇒ <code>String</code>

中文转 unioncode

**Kind**: global function  
**Returns**: <code>String</code> - 返回字符串

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| str   | <code>string</code> | 字符串      |

<a name="decodeUnicode"></a>

## decodeUnicode(str) ⇒ <code>String</code>

中文转 unioncode

**Kind**: global function  
**Returns**: <code>String</code> - 返回字符串

| Param | Type                | Description |
| ----- | ------------------- | ----------- |
| str   | <code>string</code> | 字符串      |

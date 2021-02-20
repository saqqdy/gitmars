---
sidebar: auto
sidebarDepth: 2
---

# 示例

## 工作流

### feature

::: tip

feature 分支用来开发新需求，一般用于相对较大的功能

:::

#### 创建 feature 分支

例如今天收到开发一个新闻页面的新需求，需求编号为 10088

> 这里假设我们设置的 release 分支名称为 release，bugfix 主干分支为 bug，develop 测试分支为 dev

-   使用：`gitm start feature 10088`
-   参考：[gitm start](/api/#gitm-start)

::: tip 其他写法

-   使用简写 `gitm st feature 10088`

:::

-   结果：程序会自动拉取远程分支代码，创建一个跟踪 release 分支的新分支`feature/10088`，创建之后程序会自动切到该新分支

<highlight-code lang="vue">
    ➜  gitmars git:(feature/10088) gitm start feature 10088
    抓取成功
    切换分支成功
    拉取代码成功
    切换分支成功
    10088分支创建成功，该分支基于release创建，您当前已经切换到feature/10088
    如果需要提测，请执行gitm combine feature 10088
    开发完成后，记得执行: gitm end feature 10088
    ➜  gitmars git:(feature/10088) 
</highlight-code>

::: warning

注意该分支不需要 push 到远程，在本地开发后执行 commit 就行了，不用 push

:::

#### 合并分支到测试环境

-   使用：`gitm combine feature 10088 --dev`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb feature 10088 -d`
-   不写分支名 `gitm cb -d`
-   合并后构建 dev 环境 `gitm cb -db`

:::

-   结果：程序会自动拉取 dev 远程分支代码，执行 merge 动作把`feature/10088`合并到 dev 分支，然后自动执行`git push`，并且自动切回`feature/10088`分支

<highlight-code lang="vue">
    ➜  gitmars git:(feature/10088) gitm cb -d
    <!-- 如果本地有需要执行add的文件会出现下面三行提示 start -->
    您有未加入版本的文件,
    如果需要暂存文件请执行: gitm save --force
    恢复时执行：gitm get
    <!-- end -->
    抓取成功
    切换分支成功
    拉取代码成功
    feature/10088合并到dev成功
    推送成功
    切换分支成功
    ➜  gitmars git:(feature/10088) 
</highlight-code>

#### 合并分支到 release(prod 环境)

-   使用：`gitm combine feature 10088 --prod`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb feature 10088 -p`
-   不写分支名 `gitm cb -p`
-   同时合并 dev 和 release `gitm cb -dp`
-   合并后构建 dev 环境 `gitm cb -dpb` **注意这里执行-b 并不会构建 prod 环境，因为 feature 功能分支的 prod 环境构建分支是 master，需要执行 publish 才会构建 prod；另外`gitm cb -dpb`连写时 b 必须在最后，因为-b 是带传参的**

:::

-   结果：程序会自动拉取 release 远程分支代码，执行 merge 动作把`feature/10088`合并到 release 分支，然后自动执行`git push`，并且自动切回`feature/10088`分支

<highlight-code lang="vue">
    ➜  gitmars git:(feature/10088) gitm cb -p
    抓取成功
    切换分支成功
    拉取代码成功
    feature/10088合并到release成功
    推送成功
    切换分支成功
    ➜  gitmars git:(feature/10088) 
</highlight-code>

#### 发版之后结束 feature 分支

-   使用：`gitm end feature 10088`
-   参考：[gitm end](/api/#gitm-end)

::: tip 其他写法

-   使用简写 `gitm ed feature 10088`
-   不写分支名 `gitm ed`

:::

-   结果：程序会把 feature 分支代码合并到 dev 和 release，然后在删除分支，并且自动切回`dev`分支

<highlight-code lang="vue">
    ➜  gitmars git:(feature/10088) gitm end
    抓取成功
    切换分支成功
    拉取代码成功
    feature/10088合并到dev成功
    推送成功
    切换分支成功
    抓取成功
    切换分支成功
    拉取代码成功
    feature/10088合并到release成功
    推送成功
    切换分支成功
    ➜  gitmars git:(dev) 
</highlight-code>

### bugfix

::: tip

bugfix 分支用来日常修复 bug，必要时可作为 feature 分支合并到 release

:::

#### 创建 bugfix 分支

例如今天需要修复一个弹窗报错问题，需求编号为 10088

-   使用：`gitm start bugfix 10088`
-   参考：[gitm start](/api/#gitm-start)

::: tip 其他写法

-   使用简写 `gitm st bugfix 10088`

:::

-   结果：程序会自动拉取远程分支代码，创建一个跟踪 bug 分支的新分支`bugfix/10088`，创建之后程序会自动切到该新分支

<highlight-code lang="vue">
    ➜  gitmars git:(bugfix/10088) gitm start bugfix 10088
    抓取成功
    切换分支成功
    拉取代码成功
    切换分支成功
    10088分支创建成功，该分支基于bug创建，您当前已经切换到bugfix/10088
    如果需要提测，请执行gitm combine bugfix 10088
    开发完成后，记得执行: gitm end bugfix 10088
    ➜  gitmars git:(bugfix/10088) 
</highlight-code>

::: warning

注意该分支不需要 push 到远程，在本地开发后执行 commit 就行了，不用 push

:::

#### 合并分支到测试环境

-   使用：`gitm combine bugfix 10088 --dev`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb bugfix 10088 -d`
-   不写分支名 `gitm cb -d`
-   合并后构建 dev 环境 `gitm cb -db`

:::

-   结果：程序会自动拉取 dev 远程分支代码，执行 merge 动作把`bugfix/10088`合并到 dev 分支，然后自动执行`git push`，并且自动切回`bugfix/10088`分支

<highlight-code lang="vue">
    ➜  gitmars git:(bugfix/10088) gitm cb -d
    <!-- 如果本地有需要执行add的文件会出现下面三行提示 start -->
    您有未加入版本的文件,
    如果需要暂存文件请执行: gitm save --force
    恢复时执行：gitm get
    <!-- end -->
    抓取成功
    切换分支成功
    拉取代码成功
    bugfix/10088合并到dev成功
    推送成功
    切换分支成功
    ➜  gitmars git:(bugfix/10088) 
</highlight-code>

#### 合并分支到 bug(prod 环境)

-   使用：`gitm combine bugfix 10088 --prod`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb bugfix 10088 -p`
-   不写分支名 `gitm cb -p`
-   同时合并 dev 和 bug `gitm cb -dp`
-   合并后构建 dev 和 prod 环境 `gitm cb -dpb` **注意连写时 b 必须在最后，因为-b 是带传参的**

:::

-   结果：程序会自动拉取 bug 远程分支代码，执行 merge 动作把`bugfix/10088`合并到 bug 分支，然后自动执行`git push`，并且自动切回`bugfix/10088`分支

<highlight-code lang="vue">
    ➜  gitmars git:(bugfix/10088) gitm cb -p
    抓取成功
    切换分支成功
    拉取代码成功
    bugfix/10088合并到bug成功
    推送成功
    切换分支成功
    ➜  gitmars git:(bugfix/10088) 
</highlight-code>

#### 发版之后结束 bugfix 分支

-   使用：`gitm end bugfix 10088`
-   参考：[gitm end](/api/#gitm-end)

::: tip 其他写法

-   使用简写 `gitm ed bugfix 10088`
-   不写分支名 `gitm ed`

:::

-   结果：程序会把 bugfix 分支代码合并到 dev 和 bug，然后在删除分支，并且自动切回`dev`分支

<highlight-code lang="vue">
    ➜  gitmars git:(bugfix/10088) gitm end
    抓取成功
    切换分支成功
    拉取代码成功
    bugfix/10088合并到dev成功
    推送成功
    切换分支成功
    抓取成功
    切换分支成功
    拉取代码成功
    bugfix/10088合并到bug成功
    推送成功
    切换分支成功
    ➜  gitmars git:(dev) 
</highlight-code>

### support

::: tip

support 分支用来做框架或者公共代码调整，从 master 拉取，合并时同时更新到 bug 和 release

:::

#### 创建 support 分支

例如今天要在原框架基础上新增对 graphql 的支持

-   使用：`gitm start support graphql`
-   参考：[gitm start](/api/#gitm-start)

::: tip 其他写法

-   使用简写 `gitm st support graphql`

:::

-   结果：程序会自动拉取远程分支代码，创建一个跟踪 master 分支的新分支`support/graphql`，创建之后程序会自动切到该新分支

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm start support graphql
    抓取成功
    切换分支成功
    拉取代码成功
    切换分支成功
    graphql分支创建成功，该分支基于master创建，您当前已经切换到support/graphql
    如果需要提测，请执行gitm combine support graphql
    开发完成后，记得执行: gitm end support graphql
    ➜  gitmars git:(support/graphql) 
</highlight-code>

::: warning

注意该分支不需要 push 到远程，在本地开发后执行 commit 就行了，不用 push

:::

#### 合并分支到测试环境

-   使用：`gitm combine support graphql --dev`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb support graphql -d`
-   不写分支名 `gitm cb -d`
-   合并后构建 dev 环境 `gitm cb -db`

:::

-   结果：程序会自动拉取 dev 远程分支代码，执行 merge 动作把`support/graphql`合并到 dev 分支，然后自动执行`git push`，并且自动切回`support/graphql`分支

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm cb -d
    <!-- 如果本地有需要执行add的文件会出现下面三行提示 start -->
    您有未加入版本的文件,
    如果需要暂存文件请执行: gitm save --force
    恢复时执行：gitm get
    <!-- end -->
    抓取成功
    切换分支成功
    拉取代码成功
    support/graphql合并到dev成功
    推送成功
    切换分支成功
    ➜  gitmars git:(support/graphql) 
</highlight-code>

#### 合并分支到 bug 和 release(prod 环境)

-   使用：`gitm combine support graphql --prod`
-   参考：[gitm combine](/api/#gitm-combine)

::: tip 其他写法

-   使用简写 `gitm cb support graphql -p`
-   不写分支名 `gitm cb -p`
-   同时合并 dev 和 bug 和 release `gitm cb -dp`
-   合并后构建 dev 和 prod 环境 `gitm cb -dpb` **注意这里执行-b 并不会构建 prod 环境，因为 feature 功能分支的 prod 环境构建分支是 master，需要执行 publish 才会构建 prod；另外`gitm cb -dpb`连写时 b 必须在最后，因为-b 是带传参的**

:::

-   结果：程序会自动拉取 bug 和 release 远程分支代码，执行 merge 动作把`support/graphql`合并到 bug 和 release 分支，然后自动执行`git push`，并且自动切回`support/graphql`分支

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm cb -p
    抓取成功
    切换分支成功
    拉取代码成功
    support/graphql合并到bug成功
    推送成功
    切换分支成功
    拉取代码成功
    support/graphql合并到release成功
    推送成功
    切换分支成功
    ➜  gitmars git:(support/graphql) 
</highlight-code>

#### 发版之后结束 support 分支

-   使用：`gitm end support graphql`
-   参考：[gitm end](/api/#gitm-end)

::: tip 其他写法

-   使用简写 `gitm ed support graphql`
-   不写分支名 `gitm ed`

:::

-   结果：程序会把 support 分支代码合并到 dev 和 bug 和 release，然后在删除分支，并且自动切回`dev`分支

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm end
    抓取成功
    切换分支成功
    拉取代码成功
    support/graphql合并到dev成功
    推送成功
    切换分支成功
    抓取成功
    切换分支成功
    拉取代码成功
    support/graphql合并到bug成功
    推送成功
    切换分支成功
    拉取代码成功
    support/graphql合并到release成功
    推送成功
    切换分支成功
    ➜  gitmars git:(dev) 
</highlight-code>

### publish

#### 发布 feature

feature 分支基于 release 创建，所以发布的时候会吧 release 合并到 master

-   使用：`gitm admin publish release`
-   参考：[gitm admin publish](/api/#gitm-admin-publish)

::: tip 其他写法

-   发布后构建 prod `gitm admin publich release -b`

:::

-   结果：程序会自动拉取远程分支代码，合并 release 分支到 master，合并之后程序会自动切回该分支

<highlight-code lang="vue">
    ➜  gitmars git:(feature/10088) gitm admin publich release
    抓取成功
    切换分支成功
    拉取代码成功
    release合并到master成功
    推送成功
    切换分支成功
    ➜  gitmars git:(feature/10088) 
</highlight-code>

#### 发布 bugfix

bugfix 分支基于 bug 创建，所以发布的时候会吧 bug 合并到 master

-   使用：`gitm admin publish bugfix`
-   参考：[gitm admin publish](/api/#gitm-admin-publish)

::: tip 其他写法

-   发布后构建 prod `gitm admin publich bugfix -b`

:::

-   结果：程序会自动拉取远程分支代码，合并 bug 分支到 master，合并之后程序会自动切回该分支

<highlight-code lang="vue">
    ➜  gitmars git:(bugfix/10088) gitm admin publich bugfix
    抓取成功
    切换分支成功
    拉取代码成功
    bug合并到master成功
    推送成功
    切换分支成功
    ➜  gitmars git:(bugfix/10088) 
</highlight-code>

#### 发布 support

-   使用：`gitm admin publich support`
-   参考：[gitm admin publish](/api/#gitm-admin-publish)

::: tip 其他写法

-   发布后构建 prod `gitm admin publich support -b`

:::

-   结果：程序会自动拉取远程分支代码，合并 support/graphql 分支到 master，合并之后程序会自动切回该分支

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm admin publich support
    抓取成功
    切换分支成功
    拉取代码成功
    support/graphql合并到master成功
    推送成功
    切换分支成功
    ➜  gitmars git:(support/graphql) 
</highlight-code>

## 效率

### merge

#### 合并分支（--no-ff）

-   使用：`gitm merge feature/10088`
-   参考：[gitm merge](/api/#gitm-merge)

::: tip 其他写法

-   使用简写 `gitm mg feature/10088`

:::

-   结果：

<highlight-code lang="vue">
    ➜  gitmars git:(support/graphql) gitm merge feature/10088
    ...
    ➜  gitmars git:(support/graphql) 
</highlight-code>

### copy

#### 复制 commit 记录

-   参考：[gitm copy](/api/#gitm-copy)
-   结果：

### build

#### 构建项目

-   参考：[gitm build](/api/#gitm-build)
-   结果：

### branch

#### 分支操作

-   参考：[gitm branch](/api/#gitm-branch)
-   结果：

### ...

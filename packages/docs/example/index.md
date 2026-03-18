---
sidebar: auto
sidebarDepth: 2
---

# Examples

## Workflow

### feature

::: tip

feature branches are used for developing new requirements, typically for relatively large features

:::

#### Create feature branch

For example, today you received a new requirement to develop a news page with requirement number 10088

> Here we assume our release branch name is release, bugfix main branch is bug, develop test branch is dev

- Usage: `gitm start feature 10088`
- Reference: [gitm start](../api/#gitm-start)

::: tip Alternative syntax

- Use shorthand `gitm st feature 10088`

:::

- Result: The program will automatically pull remote branch code, create a new branch `feature/10088` tracking the release branch, and automatically switch to the new branch after creation

```shell
    ➜  gitmars git:(feature/10088) gitm start feature 10088
    Fetch successful
    Branch switch successful
    Code pull successful
    Branch switch successful
    10088 branch created successfully, based on release, you have switched to feature/10088
    To submit for testing, run: gitm combine feature 10088
    After development, remember to run: gitm end feature 10088
    ➜  gitmars git:(feature/10088)
```

::: warning

Note that this branch does not need to be pushed to remote. After local development, just execute commit, no need to push

:::

#### Merge branch to test environment

- Usage: `gitm combine feature 10088 --dev`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb feature 10088 -d`
- Omit branch name `gitm cb -d`
- Merge and build dev environment `gitm cb -db`

:::

- Result: The program will automatically pull dev remote branch code, execute merge action to merge `feature/10088` to dev branch, then automatically execute `git push`, and automatically switch back to `feature/10088` branch

```shell
    ➜  gitmars git:(feature/10088) gitm cb -d
    <!-- If there are files that need to be added locally, the following three lines will appear start -->
    You have files not added to version,
    To stage files, run: gitm save --force
    To restore, run: gitm get
    <!-- end -->
    Fetch successful
    Branch switch successful
    Code pull successful
    feature/10088 merged to dev successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(feature/10088)
```

#### Merge branch to release (prod environment)

- Usage: `gitm combine feature 10088 --prod`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb feature 10088 -p`
- Omit branch name `gitm cb -p`
- Merge to both dev and release `gitm cb -dp`
- Merge and build dev environment `gitm cb -dpb` **Note that -b here will not build prod environment, because feature branch's prod environment build branch is master, need to execute publish to build prod; also `gitm cb -dpb` when written together, b must be at the end, because -b takes parameters**

:::

- Result: The program will automatically pull release remote branch code, execute merge action to merge `feature/10088` to release branch, then automatically execute `git push`, and automatically switch back to `feature/10088` branch

```shell
    ➜  gitmars git:(feature/10088) gitm cb -p
    Fetch successful
    Branch switch successful
    Code pull successful
    feature/10088 merged to release successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(feature/10088)
```

#### End feature branch after release

- Usage: `gitm end feature 10088`
- Reference: [gitm end](../api/#gitm-end)

::: tip Alternative syntax

- Use shorthand `gitm ed feature 10088`
- Omit branch name `gitm ed`

:::

- Result: The program will merge feature branch code to dev and release, then delete the branch, and automatically switch back to `dev` branch

```shell
    ➜  gitmars git:(feature/10088) gitm end
    Fetch successful
    Branch switch successful
    Code pull successful
    feature/10088 merged to dev successfully
    Push successful
    Branch switch successful
    Fetch successful
    Branch switch successful
    Code pull successful
    feature/10088 merged to release successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(dev)
```

### bugfix

::: tip

bugfix branches are used for daily bug fixes, can be merged to release as feature branch when necessary

:::

#### Create bugfix branch

For example, today you need to fix a popup error issue with requirement number 10088

- Usage: `gitm start bugfix 10088`
- Reference: [gitm start](../api/#gitm-start)

::: tip Alternative syntax

- Use shorthand `gitm st bugfix 10088`

:::

- Result: The program will automatically pull remote branch code, create a new branch `bugfix/10088` tracking the bug branch, and automatically switch to the new branch after creation

```shell
    ➜  gitmars git:(bugfix/10088) gitm start bugfix 10088
    Fetch successful
    Branch switch successful
    Code pull successful
    Branch switch successful
    10088 branch created successfully, based on bug, you have switched to bugfix/10088
    To submit for testing, run: gitm combine bugfix 10088
    After development, remember to run: gitm end bugfix 10088
    ➜  gitmars git:(bugfix/10088)
```

::: warning

Note that this branch does not need to be pushed to remote. After local development, just execute commit, no need to push

:::

#### Merge branch to test environment

- Usage: `gitm combine bugfix 10088 --dev`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb bugfix 10088 -d`
- Omit branch name `gitm cb -d`
- Merge and build dev environment `gitm cb -db`

:::

- Result: The program will automatically pull dev remote branch code, execute merge action to merge `bugfix/10088` to dev branch, then automatically execute `git push`, and automatically switch back to `bugfix/10088` branch

```shell
    ➜  gitmars git:(bugfix/10088) gitm cb -d
    <!-- If there are files that need to be added locally, the following three lines will appear start -->
    You have files not added to version,
    To stage files, run: gitm save --force
    To restore, run: gitm get
    <!-- end -->
    Fetch successful
    Branch switch successful
    Code pull successful
    bugfix/10088 merged to dev successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(bugfix/10088)
```

#### Merge branch to bug (prod environment)

- Usage: `gitm combine bugfix 10088 --prod`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb bugfix 10088 -p`
- Omit branch name `gitm cb -p`
- Merge to both dev and bug `gitm cb -dp`
- Merge and build dev and prod environment `gitm cb -dpb` **Note that when written together, b must be at the end, because -b takes parameters**

:::

- Result: The program will automatically pull bug remote branch code, execute merge action to merge `bugfix/10088` to bug branch, then automatically execute `git push`, and automatically switch back to `bugfix/10088` branch

```shell
    ➜  gitmars git:(bugfix/10088) gitm cb -p
    Fetch successful
    Branch switch successful
    Code pull successful
    bugfix/10088 merged to bug successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(bugfix/10088)
```

#### End bugfix branch after release

- Usage: `gitm end bugfix 10088`
- Reference: [gitm end](../api/#gitm-end)

::: tip Alternative syntax

- Use shorthand `gitm ed bugfix 10088`
- Omit branch name `gitm ed`

:::

- Result: The program will merge bugfix branch code to dev and bug, then delete the branch, and automatically switch back to `dev` branch

```shell
    ➜  gitmars git:(bugfix/10088) gitm end
    Fetch successful
    Branch switch successful
    Code pull successful
    bugfix/10088 merged to dev successfully
    Push successful
    Branch switch successful
    Fetch successful
    Branch switch successful
    Code pull successful
    bugfix/10088 merged to bug successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(dev)
```

### support

::: tip

support branches are used for framework or common code adjustments, created from master, and merged to both bug and release when merging

:::

#### Create support branch

For example, today you need to add graphql support to the existing framework

- Usage: `gitm start support graphql`
- Reference: [gitm start](../api/#gitm-start)

::: tip Alternative syntax

- Use shorthand `gitm st support graphql`

:::

- Result: The program will automatically pull remote branch code, create a new branch `support/graphql` tracking the master branch, and automatically switch to the new branch after creation

```shell
    ➜  gitmars git:(support/graphql) gitm start support graphql
    Fetch successful
    Branch switch successful
    Code pull successful
    Branch switch successful
    graphql branch created successfully, based on master, you have switched to support/graphql
    To submit for testing, run: gitm combine support graphql
    After development, remember to run: gitm end support graphql
    ➜  gitmars git:(support/graphql)
```

::: warning

Note that this branch does not need to be pushed to remote. After local development, just execute commit, no need to push

:::

#### Merge branch to test environment

- Usage: `gitm combine support graphql --dev`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb support graphql -d`
- Omit branch name `gitm cb -d`
- Merge and build dev environment `gitm cb -db`

:::

- Result: The program will automatically pull dev remote branch code, execute merge action to merge `support/graphql` to dev branch, then automatically execute `git push`, and automatically switch back to `support/graphql` branch

```shell
    ➜  gitmars git:(support/graphql) gitm cb -d
    <!-- If there are files that need to be added locally, the following three lines will appear start -->
    You have files not added to version,
    To stage files, run: gitm save --force
    To restore, run: gitm get
    <!-- end -->
    Fetch successful
    Branch switch successful
    Code pull successful
    support/graphql merged to dev successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(support/graphql)
```

#### Merge branch to bug and release (prod environment)

- Usage: `gitm combine support graphql --prod`
- Reference: [gitm combine](../api/#gitm-combine)

::: tip Alternative syntax

- Use shorthand `gitm cb support graphql -p`
- Omit branch name `gitm cb -p`
- Merge to dev and bug and release `gitm cb -dp`
- Merge and build dev and prod environment `gitm cb -dpb` **Note that -b here will not build prod environment, because feature branch's prod environment build branch is master, need to execute publish to build prod; also `gitm cb -dpb` when written together, b must be at the end, because -b takes parameters**

:::

- Result: The program will automatically pull bug and release remote branch code, execute merge action to merge `support/graphql` to bug and release branches, then automatically execute `git push`, and automatically switch back to `support/graphql` branch

```shell
    ➜  gitmars git:(support/graphql) gitm cb -p
    Fetch successful
    Branch switch successful
    Code pull successful
    support/graphql merged to bug successfully
    Push successful
    Branch switch successful
    Code pull successful
    support/graphql merged to release successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(support/graphql)
```

#### End support branch after release

- Usage: `gitm end support graphql`
- Reference: [gitm end](../api/#gitm-end)

::: tip Alternative syntax

- Use shorthand `gitm ed support graphql`
- Omit branch name `gitm ed`

:::

- Result: The program will merge support branch code to dev and bug and release, then delete the branch, and automatically switch back to `dev` branch

```shell
    ➜  gitmars git:(support/graphql) gitm end
    Fetch successful
    Branch switch successful
    Code pull successful
    support/graphql merged to dev successfully
    Push successful
    Branch switch successful
    Fetch successful
    Branch switch successful
    Code pull successful
    support/graphql merged to bug successfully
    Push successful
    Branch switch successful
    Code pull successful
    support/graphql merged to release successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(dev)
```

### publish

#### Publish feature

feature branch is based on release, so when publishing, release will be merged to master

- Usage: `gitm admin publish release`
- Reference: [gitm admin publish](../api/#gitm-admin-publish)

::: tip Alternative syntax

- Publish and build prod `gitm admin publish release -b`

:::

- Result: The program will automatically pull remote branch code, merge release branch to master, and automatically switch back to the branch after merging

```shell
    ➜  gitmars git:(feature/10088) gitm admin publish release
    Fetch successful
    Branch switch successful
    Code pull successful
    release merged to master successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(feature/10088)
```

#### Publish bugfix

bugfix branch is based on bug, so when publishing, bug will be merged to master

- Usage: `gitm admin publish bugfix`
- Reference: [gitm admin publish](../api/#gitm-admin-publish)

::: tip Alternative syntax

- Publish and build prod `gitm admin publish bugfix -b`

:::

- Result: The program will automatically pull remote branch code, merge bug branch to master, and automatically switch back to the branch after merging

```shell
    ➜  gitmars git:(bugfix/10088) gitm admin publish bugfix
    Fetch successful
    Branch switch successful
    Code pull successful
    bug merged to master successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(bugfix/10088)
```

#### Publish support

- Usage: `gitm admin publish support`
- Reference: [gitm admin publish](../api/#gitm-admin-publish)

::: tip Alternative syntax

- Publish and build prod `gitm admin publish support -b`

:::

- Result: The program will automatically pull remote branch code, merge support/graphql branch to master, and automatically switch back to the branch after merging

```shell
    ➜  gitmars git:(support/graphql) gitm admin publish support
    Fetch successful
    Branch switch successful
    Code pull successful
    support/graphql merged to master successfully
    Push successful
    Branch switch successful
    ➜  gitmars git:(support/graphql)
```

## Efficiency

### copy

#### Copy commit records

- Reference: [gitm copy](../api/#gitm-copy)
- Result:

### build

#### Build project

- Reference: [gitm build](../api/#gitm-build)
- Result:

### branch

#### Branch operations

- Reference: [gitm branch](../api/#gitm-branch)
- Result:

### ...

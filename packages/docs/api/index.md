---
sidebar: auto
sidebarDepth: 2
---

# API Reference

Welcome to the Gitmars API reference documentation.

## Categories

### [Smart Navigation](#gitm-go)
One command to access all features

### [Configuration](#gitm-init)
Initialize and manage settings

### [Workflow](#gitm-start)
Core workflow commands for branch creation, merging, and updates

### [Productivity](#gitm-copy)
Copy, build, stash and other efficiency tools

### [Admin](#gitm-admin-create)
Administrator commands

## Command Index

| Command | Description |
| ------- | ----------- |
| [gitm go](#gitm-go) | Smart navigation |
| [gitm init](#gitm-init) | Initialize config |
| [gitm config](#gitm-config) | View/set config |
| [gitm start](#gitm-start) | Create branch |
| [gitm combine](#gitm-combine) | Branch testing stage |
| [gitm end](#gitm-end) | Finish development |
| [gitm update](#gitm-update) | Update branch |
| [gitm continue](#gitm-continue) | Continue unfinished operation |
| [gitm copy](#gitm-copy) | Cherry-pick simplified |
| [gitm build](#gitm-build) | Build Jenkins |
| [gitm build-mp](#gitm-build-mp) | Build mini-program Jenkins |
| [gitm miniprogram](#gitm-miniprogram) | Mini-program commands |
| [gitm branch](#gitm-branch) | Branch operations |
| [gitm revert](#gitm-revert) | Revert commit |
| [gitm undo](#gitm-undo) | Undo commit record |
| [gitm redo](#gitm-redo) | Redo commit record |
| [gitm save](#gitm-save) | Stash files |
| [gitm get](#gitm-get) | Restore stashed files |
| [gitm cleanbranch](#gitm-cleanbranch) | Clean branches |
| [gitm log](#gitm-log) | View logs |
| [gitm hook](#gitm-hook) | Git hook commands |
| [gitm run](#gitm-run) | Run git hooks |
| [gitm upgrade](#gitm-upgrade) | Upgrade gitmars |
| [gitm clean](#gitm-clean) | Clear cache |
| [gitm suggest](#gitm-suggest) | Git operation suggestions |
| [gitm approve](#gitm-approve) | Handle remote merge requests |
| [gitm review](#gitm-review) | Remote code review |
| [gitm status](#gitm-status) | View branch status |
| [gitm link](#gitm-link) | Create symlink |
| [gitm unlink](#gitm-unlink) | Remove symlink |
| [gitm postmsg](#gitm-postmsg) | Post message |
| [gitm alias](#gitm-alias) | Install/remove shortcuts |
| [gitm admin create](#gitm-admin-create) | Admin create main branch |
| [gitm admin publish](#gitm-admin-publish) | Publish branch |
| [gitm admin update](#gitm-admin-update) | Update main branch code |
| [gitm admin clean](#gitm-admin-clean) | Clean branches |
| [gitm permission](#gitm-permission) | Submit permission |
| [gitm version](#gitm-version) | View version |

---

## Smart Navigation

### gitm go

Smart navigation command - remember one command to access all features

- Usage: `gitm go`
- Arguments:

<div class="table-prop">

| Parameter | Description | Type | Options | Required | Default |
| --------- | ----------- | ---- | ------- | -------- | ------- |
| command | Command name | `String` | combine, end, update, build, build-mp, miniprogram, start, undo, redo, suggest, approve, review, admin.publish, admin.update, admin.create, admin.clean, admin.approve, branch, copy, get, save, cleanbranch, clean, revert, link, unlink, postmsg | No | - |

</div>

- Example:

```shell
gitm go build
```

## Configuration

### gitm init

Initialize configuration, follow the prompts to input settings

- Usage: `gitm init`
- Reference: [Configuration Parameters](../guide/basic-config)

### gitm config

View and set configuration

#### Set Single Config

- Usage: `gitm config <option> [value]`
- Arguments:

<div class="table-prop">

| Parameter | Description | Type | Options | Required | Default |
| --------- | ----------- | ---- | ------- | -------- | ------- |
| option | Config name | `String` | - | Yes | - |
| value | Config value | `String` | - | No | - |

</div>

- Example:

```shell
# Set master branch name to main
gitm config master main
```

#### View Config

- Usage: `gitm config list [option]`
- Arguments:

<div class="table-prop">

| Parameter | Description | Type | Options | Required | Default |
| --------- | ----------- | ---- | ------- | -------- | ------- |
| option | Config name | `String` | - | No | - |

</div>

- Example:

```shell
# View all config
gitm config list
```

## Workflow

### gitm start

Create bugfix branch or create/merge release branch

- Usage: `gitm start <type> <name>`
- Arguments:

<div class="table-prop">

| Parameter | Description | Type | Options | Required | Default |
| --------- | ----------- | ---- | ------- | -------- | ------- |
| type | Branch type | `String` | feature, bugfix, support | Yes | - |
| name | Branch name | `String` | - | Yes | - |

</div>

- Example:

```shell
# Create feature branch
gitm start feature 10000
```

### gitm combine

Branch testing stage

- Usage: `gitm combine [-d --dev] [-p --prod]`

### gitm end

Finish development of a feature

- Usage: `gitm end`

### gitm update

Update bug task branch or feature development branch

- Usage: `gitm update`

### gitm continue

Continue unfinished operation

- Usage: `gitm continue`

## Productivity

### gitm copy

Simplified git cherry-pick operation

- Usage: `gitm copy [commits]`

### gitm branch

Branch operations

- Usage: `gitm branch <action> [name]`

### gitm save

Stash current branch files

- Usage: `gitm save`

### gitm get

Restore last stashed files

- Usage: `gitm get`

### gitm build

Build Jenkins

- Usage: `gitm build`

### gitm build-mp

Build mini-program Jenkins

- Usage: `gitm build-mp`

### gitm miniprogram

Mini-program specific commands

- Usage: `gitm miniprogram`

### gitm undo

Undo a commit or merge record

- Usage: `gitm undo`

### gitm redo

Redo a commit or merge record

- Usage: `gitm redo`

### gitm revert

Revert commits

- Usage: `gitm revert`

### gitm cleanbranch

Clean merged feature branches

- Usage: `gitm cleanbranch`

### gitm status

View current branch status

- Usage: `gitm status`

### gitm log

View logs

- Usage: `gitm log`

## Admin

### gitm admin create

Admin create main branch

- Usage: `gitm admin create`

### gitm admin publish

Publish branch

- Usage: `gitm admin publish`

### gitm admin update

Update main branch code

- Usage: `gitm admin update`

### gitm admin clean

Clean branches

- Usage: `gitm admin clean`

## Others

### gitm upgrade

Upgrade gitmars

- Usage: `gitm upgrade`

### gitm clean

Clear cache

- Usage: `gitm clean`

### gitm suggest

Git operation suggestions

- Usage: `gitm suggest`

### gitm hook

Git hook commands

- Usage: `gitm hook`

### gitm run

Run git hooks

- Usage: `gitm run`

### gitm link

Create symlink

- Usage: `gitm link`

### gitm unlink

Remove symlink

- Usage: `gitm unlink`

### gitm postmsg

Post message

- Usage: `gitm postmsg`

### gitm alias

Install and remove shortcuts

- Usage: `gitm alias`

### gitm permission

Submit permission

- Usage: `gitm permission`

### gitm version

View version

- Usage: `gitm version`

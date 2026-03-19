<div style="text-align: center;" align="center">

## ![logo.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/logo.png)

</div>

<div style="text-align: center;" align="center">

**A Powerful Git Workflow CLI Tool**

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![License][license-image]][license-url]

[![Sonar][sonar-image]][sonar-url]

</div>

<div style="text-align: center; margin-bottom: 20px;" align="center">

### **[Documentation](http://www.saqqdy.com/gitmars/api/)**&nbsp; &nbsp; &nbsp; &nbsp;[Changelog](http://www.saqqdy.com/gitmars/changelog.html)

</div>

## Features

- **Intuitive API Design** - Simple and easy-to-understand command interface
- **Enhanced Git Operations** - Wraps complex git commands into user-friendly methods
- **Shell Utilities** - Built-in shell helpers for common development tasks

## Quick Start

> **Guide:** [Getting Started](http://www.saqqdy.com/gitmars/guide/getting-start.html)
> **Config:** [Configuration Reference](http://www.saqqdy.com/gitmars/guide/basic-config.html)

```shell
# Initialize gitmars in your project
gitm init

# View current configuration
gitm config list [option]

# Upgrade to latest version
# Use -m/--mirror for Taobao registry (faster in China)
# Mac:
sudo gitm upgrade -m -c npm
# Windows (PowerShell or CMD):
gitm upgrade latest -m -c npm.cmd

# Check version
gitm -v

# Show help
gitm --help
gitm copy --help
```

## Installation

```shell
# Using npm
npm install -g gitmars

# Using yarn
yarn global add gitmars
```

## Workflow Models

### Dual Main Branch Mode

Ideal for projects with separate development and production branches.

![gitmars-branch.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch.png)

### Single Main Branch Mode

Streamlined workflow for simpler release processes.

![gitmars-branch.png](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch2.png)

## Command Reference

| Command | Description |
|---------|-------------|
| [`gitm init`](http://www.saqqdy.com/gitmars/api/#gitm-init) | Initialize gitmars configuration |
| [`gitm config`](http://www.saqqdy.com/gitmars/api/#gitm-config) | View or modify configuration settings |
| [`gitm combine`](http://www.saqqdy.com/gitmars/api/#gitm-combine) | Merge branch for testing phase |
| [`gitm start`](http://www.saqqdy.com/gitmars/api/#gitm-start) | Create bugfix branch or release branch |
| [`gitm end`](http://www.saqqdy.com/gitmars/api/#gitm-end) | Complete feature development |
| [`gitm update`](http://www.saqqdy.com/gitmars/api/#gitm-update) | Sync bugfix/feature branch with upstream |
| [`gitm branch`](http://www.saqqdy.com/gitmars/api/#gitm-branch) | Branch management operations |
| [`gitm save`](http://www.saqqdy.com/gitmars/api/#gitm-save) | Stash current branch changes |
| [`gitm get`](http://www.saqqdy.com/gitmars/api/#gitm-get) | Restore latest stashed changes |
| [`gitm suggest`](http://www.saqqdy.com/gitmars/api/#gitm-suggest) | Get smart git operation suggestions |
| [`gitm approve`](http://www.saqqdy.com/gitmars/api/#gitm-approve) | Process remote merge requests |
| [`gitm review`](http://www.saqqdy.com/gitmars/api/#gitm-review) | Perform remote code review |
| [`gitm cleanbranch`](http://www.saqqdy.com/gitmars/api/#gitm-cleanbranch) | Clean up merged feature branches |
| [`gitm copy`](http://www.saqqdy.com/gitmars/api/#gitm-copy) | Simplified cherry-pick operations |
| [`gitm continue`](http://www.saqqdy.com/gitmars/api/#gitm-continue) | Resume interrupted operations |
| [`gitm revert`](http://www.saqqdy.com/gitmars/api/#gitm-revert) | Revert commits |
| [`gitm undo`](http://www.saqqdy.com/gitmars/api/#gitm-undo) | Undo commit or merge record |
| [`gitm redo`](http://www.saqqdy.com/gitmars/api/#gitm-redo) | Redo commit or merge record |
| [`gitm status`](http://www.saqqdy.com/gitmars/api/#gitm-status) | Display current branch status |
| [`gitm upgrade`](http://www.saqqdy.com/gitmars/api/#gitm-upgrade) | Upgrade gitmars version |
| [`gitm build`](http://www.saqqdy.com/gitmars/api/#gitm-build) | Trigger Jenkins build |
| [`gitm unlink`](http://www.saqqdy.com/gitmars/api/#gitm-unlink) | Remove symbolic link |
| [`gitm link`](http://www.saqqdy.com/gitmars/api/#gitm-link) | Create symbolic link |
| [`gitm clean`](http://www.saqqdy.com/gitmars/api/#gitm-clean) | Clear gitmars cache |
| [`gitm postmsg`](http://www.saqqdy.com/gitmars/api/#gitm-postmsg) | Send notification messages |
| [`gitm permission`](http://www.saqqdy.com/gitmars/api/#gitm-permission) | Manage commit permissions |
| [`gitm hook`](http://www.saqqdy.com/gitmars/api/#gitm-hook) | Configure git hooks |
| [`gitm run`](http://www.saqqdy.com/gitmars/api/#gitm-run) | Execute git hooks |
| [`gitm log`](http://www.saqqdy.com/gitmars/api/#gitm-log) | Query commit logs |
| [`gitm go`](http://www.saqqdy.com/gitmars/api/#gitm-go) | Interactive command navigator |
| [`gitm alias`](http://www.saqqdy.com/gitmars/api/#gitm-alias) | Manage command shortcuts |

### Admin Commands

| Command | Description |
|---------|-------------|
| [`gitm admin create`](http://www.saqqdy.com/gitmars/api/#gitm-admin-create) | Create main branches |
| [`gitm admin publish`](http://www.saqqdy.com/gitmars/api/#gitm-admin-publish) | Publish release branches |
| [`gitm admin update`](http://www.saqqdy.com/gitmars/api/#gitm-admin-update) | Update main branch code |
| [`gitm admin clean`](http://www.saqqdy.com/gitmars/api/#gitm-admin-clean) | Clean up branches |

## Smart Navigation

### `gitm go` - One Command for Everything

Can't remember a command? Just type `gitm go` and let gitmars guide you.

**Usage:**
```shell
gitm go [command]
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| command | String | No | Command name to execute |

**Available commands:** `combine`, `end`, `update`, `build`, `start`, `undo`, `redo`, `suggest`, `approve`, `review`, `admin.publish`, `admin.update`, `admin.create`, `admin.clean`, `admin.approve`, `branch`, `copy`, `get`, `save`, `cleanbranch`, `clean`, `revert`, `link`, `unlink`, `postmsg`

**Example:**
```shell
gitm go build
```

**Demo:**

![gitmars-go.gif](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-go.gif)

## License

[GPL](LICENSE)

[npm-image]: https://img.shields.io/npm/v/gitmars.svg?style=flat-square
[npm-url]: https://npmjs.com/package/gitmars
[travis-image]: https://travis-ci.com/saqqdy/gitmars.svg?branch=master
[travis-url]: https://travis-ci.com/saqqdy/gitmars
[codecov-image]: https://img.shields.io/codecov/c/github/saqqdy/gitmars.svg?style=flat-square
[codecov-url]: https://codecov.io/github/saqqdy/gitmars?branch=master
[download-image]: https://img.shields.io/npm/dm/gitmars.svg?style=flat-square
[download-url]: https://npmjs.com/package/gitmars
[license-image]: https://img.shields.io/badge/License-GPL-blue.svg
[license-url]: LICENSE
[sonar-image]: https://sonarcloud.io/api/project_badges/quality_gate?project=saqqdy_gitmars
[sonar-url]: https://sonarcloud.io/dashboard?id=saqqdy_gitmars

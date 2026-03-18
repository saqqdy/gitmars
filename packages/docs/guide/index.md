---
title: Introduction
---

# Introduction

**Gitmars** is an efficient Git workflow tool designed for team collaboration and high-frequency release scenarios.

## Why Gitmars?

- **🚀 Efficient** - Auto branch switching and code pulling after actions
- **🧠 Smart** - Intelligent command detection and navigation
- **🛡️ Safe** - Built-in operation detection to prevent non-compliant operations
- **📦 Zero Config** - Works out of the box with customizable settings
- **🔧 Flexible** - Multi-environment support for various Git branching models
- **📖 Well Documented** - Detailed API documentation and examples

## Quick Start

```shell
# Install
# Note: Windows users need to install Python first
npm install -g gitmars
# or
yarn global add gitmars

# Create gitmars config
cd my-project
gitm init

# Create feature branch
gitm start feature 10000

# Merge feature/10000 to develop
gitm combine -d

# Finish development
gitm end
```

## Workflow Models

### Dual Main Branch Model

![Dual Main Branch](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch.png)

Monday to Wednesday: Release minor versions with bug fixes only, create bugfix/xxxx branches from bug branch. Thursday to Friday: Release major versions with new features and bug fixes, create feature/xxxx branches from release branch.

### Single Main Branch Model

![Single Main Branch](https://raw.githubusercontent.com/saqqdy/gitmars/master/static/img/gitmars-branch2.png)

## Environment Support

| Environment | Support |
| ----------- | ------- |
| macOS | ✅ |
| Linux | ✅ |
| Windows | ✅ (requires Python) |
| Node.js | ✅ >= 14 |

## Commands

| Command | Description |
| ------- | ----------- |
| [gitm init](/api/#gitm-init) | Initialize config |
| [gitm config](/api/#gitm-config) | View/set config |
| [gitm start](/api/#gitm-start) | Create branch |
| [gitm combine](/api/#gitm-combine) | Branch testing stage |
| [gitm end](/api/#gitm-end) | Finish development |
| [gitm update](/api/#gitm-update) | Update branch |
| [gitm go](/api/#gitm-go) | Smart navigation |
| [gitm copy](/api/#gitm-copy) | Cherry-pick simplified |
| [gitm branch](/api/#gitm-branch) | Branch operations |
| [gitm undo](/api/#gitm-undo) | Undo commit |
| [gitm redo](/api/#gitm-redo) | Redo commit |
| [gitm status](/api/#gitm-status) | View branch status |

See [API Reference](/api/) for complete command list.

## Why Not GitFlow?

GitFlow doesn't support high-frequency releases. Gitmars is designed for such scenarios with dual and single main branch models.

## License

[GPL-3.0 License](https://github.com/saqqdy/gitmars/blob/master/LICENSE)

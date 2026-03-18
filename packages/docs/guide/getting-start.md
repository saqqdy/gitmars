## Installation

> Windows users need to install Python environment

```shell
# Install via npm
npm install -g gitmars
# Or install via yarn
yarn global add gitmars
```

## Usage

```shell
# Install
yarn global add gitmars # or: npm install -g gitmars

# Create gitmars config file
cd my-project
# Follow the prompts to enter desired configuration
# Initialize
gitm init

# Create feature branch, auto switch to new branch
gitm start feature 10000

# Merge feature/10000 branch to develop, add -p to also merge to release
gitm combine -d

# Finish development and end branch
gitm end
```

## Advanced

```shell
# View config
gitm config list [option]

# Upgrade version [-m --mirror] Use Taobao mirror for upgrade
Mac users: gitm upgrade -m
Windows users: npm i -g gitmars@latest

# View version
gitm -v

# View help info
gitm --help

# View subcommand help info
gitm copy -h
```

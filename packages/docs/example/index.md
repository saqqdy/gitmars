# Examples

## Workflow

### feature

Feature development workflow

```shell
# Create feature branch
gitm start feature 10000

# Develop...
git add .
git commit -m "feat: add feature"

# Merge to develop
gitm combine -d

# Finish development
gitm end
```

### bugfix

Bug fix workflow

```shell
# Create bugfix branch
gitm start bugfix 10001

# Fix bug...
git add .
git commit -m "fix: fix bug"

# Merge to bug branch
gitm combine -d

# Finish
gitm end
```

### support

Support branch workflow

### publish

Publish workflow

## Efficiency

### copy

Copy commits between branches

```shell
# Copy specific commit
gitm copy abc123

# Copy multiple commits
gitm copy abc123,def456
```

### build

Build project

```shell
# Build current branch
gitm build
```

### branch

Branch operations

```shell
# List branches
gitm branch list

# Delete branch
gitm branch delete feature/10000
```

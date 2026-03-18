# Go Command

`gitm go` is a smart navigation command that helps you quickly execute common operations.

## Usage

```shell
gitm go [command]
```

## Available Commands

| Command | Description |
| ------- | ----------- |
| start | Create branch |
| combine | Branch testing stage |
| end | Finish development |
| update | Update branch |
| build | Build Jenkins |
| build-mp | Build mini-program |
| copy | Cherry-pick |
| undo | Undo commit |
| redo | Redo commit |
| branch | Branch operations |
| clean | Clear cache |
| revert | Revert commit |
| suggest | Git suggestions |
| approve | Handle merge request |
| review | Code review |
| status | View status |
| link | Create symlink |
| unlink | Remove symlink |
| postmsg | Post message |

## Example

```shell
# Quick build
gitm go build

# Quick copy
gitm go copy abc123
```

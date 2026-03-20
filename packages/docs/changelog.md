# Changelog

## 2026.03.20 v7.8.0 (Released)

**v7.8.0 "Foundation Solidification" Release!**

This release focuses on quality assurance, ensuring users can confidently use the tool.

### Core Improvements

1. Fixed build compatibility issue with `import ... with { type: 'json' }` syntax
2. Migrated ESLint configuration to `@eslint-sets/eslint-config`
3. Migrated sub-package devDependencies to use pnpm `catalog:` format for centralized version management
4. Added `catalog` configuration to `pnpm-workspace.yaml` for unified dependency versions
5. Changed publish script from `npm publish` to `pnpm publish` for automatic workspace protocol conversion
6. Fixed lint errors across multiple files
7. Extracted common `AnyFunction` type for callback function signatures
8. Optimized README documentation structure
9. Upgraded dependencies

### Test Coverage Significantly Improved

- Expanded test coverage for `@gitmars/git` package from 5.4% to 82.67%
- Added comprehensive tests for git functions: getConfig, readPkg, searchBranches, getAheadLogs, getBehindLogs, getBranchesFromID, getGitLogs, getGitLogsByCommitIDs, checkout, fetch, prune, checkGitStatus, getStashList, getCommandMessage, getIsMergeAction, getIsMergedTargetBranch, getIsUpdatedInTime
- Added `@gitmars/gitmars` core workflow test files:
  - `commands.test.ts` - Core command tests (start, update, combine, end)
  - `workflow.test.ts` - Workflow tests (copy, undo, redo, save, get)
  - `p0-validation.test.ts` - P0 priority command validation tests
  - `error-handling.test.ts` - Error handling and boundary case tests
- Total test cases reached **422+**, with **10** test files and over **4355** lines of test code

### v7.8.0 Acceptance Criteria Achieved

- [x] Core workflow test coverage ≥70%
- [x] All P0 command functionality verified
- [x] Quick start documentation complete
- [x] Zero P1 level bugs

## 2025.12.10 v7.7.0

1. Optimized `gitm copy`
2. Upgraded dependencies

## 2025.01.10 v7.6.0

1. Switched to `git switch`
2. Optimized `gitm start` branch creation flow
3. Upgraded dependencies

## 2024.08.08 v7.4.0

1. `build-mp` added version type selection step, added baseInfo input

## 2024.08.02 v7.3.0

1. Fixed `miniprogramToken` `miniprogramSession` required parameter issue

## 2024.07.17 v7.2.0

1. `miniprogramToken` `miniprogramSession` parameters now read from git config

## 2024.06.18 v7.1.0

1. Added `--push` parameter to push target branch to remote after copy

## 2024.05.10 v7.0.1

1. Fixed version control bug

## 2024.05.10 v7.0.0

1. Refactored project, reorganized code structure
2. Added `build-mp` command for building miniprograms
3. Added `miniprogram` command for operating miniprograms
4. `end` and `combine` commands now support batch operations
5. `build` command refactored to optional parameters, project parameter no longer required
6. Build config now supports setting token in list
7. Cleaned up unnecessary dependencies
8. Upgraded dependencies

## 2024.03.17 v6.4.0

1. Optimized prompts
2. Upgraded dependencies

## 2024.03.01 v6.3.0

1. `admin` and `combine` commands added build prompts
2. Upgraded dependencies

## 2024.02.02 v6.2.0

1. `build` command added `--confirm` parameter, skip confirmation when true

## 2024.02.01 v6.1.0

1. Added parameter confirmation step to build command
2. Removed build parameter encoding
3. Upgraded dependencies

## 2024.01.08 v6.0.0

1. Removed `server` and `ui` sub-projects
2. From v6.0.0, `token` is read from git config `user.token`, API no longer needs to return token
3. Deprecated `gitm merge` command
4. Upgraded dependencies

## 2023.09.09 v5.3.0

1. `combine`, `admin publish`, `build` commands added `--data` parameter for custom build parameters
2. Fixed `upgrade` not working with registry
3. Removed `compareVersion` method, using js-cool's compareVersion instead
4. Upgraded dependencies

## 2023.08.16 v5.2.0

1. Fixed some issues
2. Upgraded dependencies

## 2023.07.03 v5.1.6

1. Using [os-lang](https://github.com/saqqdy/os-lang) to get system language
2. Upgraded dependencies

## 2023.05.31 v5.1.5

1. Fixed bugs and improved experience
2. Upgraded dependencies

## 2023.03.26 v5.1.3

1. Using [userdir](https://github.com/saqqdy/userdir)
2. Fixed type output
3. Upgraded dependencies

## 2023.02.17 v5.1.1

1. Fixed `spawnSync` command parsing error
2. Version control now supports `prerelease`, `premajor`, `preminor`, `prepatch` versions
3. Build outputs gitmars type files
4. Upgraded dependencies

## 2023.02.04 v5.0.0

1. Fully migrated to rollup v3.0
2. Added `versionControlType` config parameter for controlling forced update version type, pass false to disable
3. Upgraded dependencies, now using commander v10, reinstarter v2

## 2023.01.14 v4.1.1

1. Upgraded dependencies

## 2023.01.05 v4.1.0

1. Added `stringify` and `isWin32` methods to handle Windows environment script compatibility
2. Fixed `getIsMergedTargetBranch` compatibility issue on Windows
3. Upgraded spawn and spawnSync to handle Windows environment script compatibility

## 2023.01.05 v4.0.4

1. Fixed `getIsMergedTargetBranch` compatibility issue on Windows

## 2023.01.04 v4.0.3

1. Fixed `getIsMergedTargetBranch` compatibility issue on Windows
2. Downgraded os-local

## 2023.01.02 v4.0.1

1. Started using [reinstaller](https://github.com/saqqdy/reinstaller)

## 2022.12.30 v4.0.0

1. Added multi-language support, currently supports `zh-CN` and `en-US`
2. `getIsMergedTargetBranch` method changed parameter passing, added strictly, changed default judgment method
3. Fully migrated to ESM specification, dropped support for node12 and below
4. Removed `msgUrl` from config
5. Fixed `update` command inaccurate merge detection bug
6. Moved global from core to gitmars
7. Refactored `copy` command to self-select commit records
8. Added `prune` method
9. Fixed `checkGitStatus` method bug
10. Removed default values for `lastet` and `limit`
11. Upgraded dependencies

## 2022.08.22 v3.3.5

1. `combine`, `update`, `admin publish`, `admin update` commands added `--force` to force merge request

## 2022.08.14 v3.3.4

1. `postmsg` command now works outside git directory

## 2022.08.12 v3.3.3

1. Fixed remaining `admin` command merge detection issues
2. Added `fetch` public method

## 2022.08.12 v3.3.2

1. Fixed build process causing gitm-ui to not run

## 2022.08.11 v3.3.1

1. Fixed `admin` command inaccurate merge detection

## 2022.08.09 v3.3.0

1. `combine`, `update`, `admin` commands added merge detection, no longer merge when not needed
2. Upgraded dependencies

## 2022.07.19 v3.2.0

1. Fixed `gitm get` command not finding corresponding stash content
2. Fixed `gitm undo` command error
3. Improved typescript types

## 2022.07.03 v3.1.0

1. Updated versionControl strategy, officially deprecated lite channel

## 2022.06.12 v3.0.1

1. Improved experience
2. Fixed some issues

## 2022.06.10 v3.0.0

1. Monorepo refactoring, split into `core`, `gitmars`, `server`, `ui`, `docs` sub-projects
2. Removed restriction that `alias` command only works in git projects
3. Upgraded dependencies

## 2022.04.07 v2.18.1

1. Deleting branches now auto-executes `git remote prune origin` to clean records
2. Upgraded dependencies

## 2022.03.24 v2.18.0

1. Added `gitm alias` command, init: `git alias init`, remove: `git alias remove`
2. Added alias commands to use gitmars, can use `git mars xxx` or `git flow xxx`, both equivalent to `gitm xxx`
3. Added `apis` to config, original `config.api` moved to `config.apis.userInfo`
4. Added `config.apis.buildConfig` API config for reading build config, higher priority than `config.apolloConfig`
5. Upgraded dependencies

## 2022.02.24 v2.17.0

1. Added `level=3` reviewer permission, reviewers have merge permission and can execute `admin publish`, but unlike admins, reviewers push code to remote. Developer permission adjusted to 4

## 2022.02.24 v2.16.6

1. Optimized project name extraction logic

## 2021.12.27 v2.16.5

1. `approve` and `review` commands added `--quiet`, removed `--postmsg`, now send messages by default

## 2021.12.27 v2.16.4

1. Extended `request` method to support gzip

## 2021.12.23 v2.16.3

1. Optimized `approve` command batch operation experience

## 2021.12.23 v2.16.2

1. `approve` command now shows comment count
2. Adjusted prompts

## 2021.12.20 v2.16.0

### Features

1. Added `approve` command for approving remote merge requests, supports diff preview, added `gitm admin approve` command
2. Added `review` command for code review, submits review records
3. Extended `request` method to support `PUT` and `DELETE`

### Improvements

1. Fixed `service` cache issue
2. Optimized documentation

## 2021.12.14 v2.15.4

1. Added `status` command to view current branch status

## 2021.12.13 v2.15.3

1. `log` command added `--json` parameter for JSON output, defaults to table

## 2021.12.12 v2.15.2

1. Added `debug` method, enable debug functionality

## 2021.12.11 v2.15.1

1. `gitm ui` now supports `undo` and `redo`
2. `gitm go` now supports `undo` and `redo`

## 2021.12.06 v2.15.0

### Features

1. Switched to native script executor for better performance, replacing shelljs `sh.exec`
2. Added `undo` command for reverting code
3. Added `redo` command for restoring reverted code
4. Optimized `cleanbranch` command flow, can select branches to clean after preview
5. `undo` command added `--no-merges`, `--limit`, `--lastet`, `--calc`, `--calcAll` parameters
6. `log` command added `--no-merges` parameter to exclude merge records
7. Replaced `sh.exit` with `process.exit`

### Improvements

1. Optimized `git log` reading experience
2. Added `echo`, `gitLogsFormatter`, `revertCache`, `writeFileSync` methods
3. Removed `filterBranch` method
4. Improved `typescript` types

## 2021.12.02 v2.14.6

1. Replaced `curl` scripts for build and group message, handled win7 curl compatibility issue

## 2021.12.02 v2.14.5

1. Extended `queue` method to support promise functions
2. Replaced `curl` script for creating remote merge requests, handled win7 curl compatibility issue
3. Fixed script queue `continue` cache save failure issue
4. Fixed `circular dependency` issue

## 2021.11.30 v2.14.4

1. Replaced `curl` scripts, handled win7 curl compatibility issue
2. Encapsulated `request` method

## 2021.11.28 v2.14.3

1. `cleanbranch` command no longer auto-switches branches
2. Optimized `log` command experience

## 2021.11.27 v2.14.2

1. Optimized `cleanbranch` command prompts
2. `ui` interface now supports `cleanbranch`/`admin publish`/`clean`/`log` commands

## 2021.11.26 v2.14.1

1. Optimized code
2. Changed license to `GPL-3.0`

## 2021.11.26 v2.14.0

1. Refactored core code
2. `cleanbranch` command removed restriction on secondary branches only

## 2021.11.22 v2.13.9

1. `cleanbranch` command added `--key` parameter for filter keywords
2. `cleanbranch` command added `--include` parameter for regex branch filtering
3. `cleanbranch` command changed `--except` to `--exclude`, usage unchanged

## 2021.11.21 v2.13.8

1. Optimized script execution prompts, added `processing` status
2. `clean` command no longer cleans gitmars config, `--force` now deletes execution cache
3. Optimized `upgrade` command flow
4. Optimized `clean` command experience

## 2021.11.20 v2.13.7

1. `cleanbranch` command added `branches` parameter to specify branches to clean, multiple branches separated by spaces
2. `cleanbranch` command added `--target` parameter for target branches to check merge status, multiple branches separated by commas, default: develop,release
3. Optimized prompts

## 2021.11.20 v2.13.6

1. `cleanbranch` command compatible with older git versions

## 2021.11.19 v2.13.5

1. `cleanbranch` command added `--confirm` parameter, skip confirmation when true
2. Fixed inaccurate detection issue

## 2021.11.19 v2.13.3

1. `cleanbranch` command removed permission control
2. `go` command now supports cleanbranch

## 2021.11.19 v2.13.2

1. Improved `searchBranches` method, removed `local` parameter
2. Corrected branchs spelling error

## 2021.11.19 v2.13.1

1. `cleanbranch` command added `--list` parameter to preview before deleting
2. Optimized `cleanbranch` command flow with animations and prompts
3. `cleanbranch` added short command `gitm clb`
4. `cleanbranch` command added permission control, only admin level and above (level < 3) can execute
5. `cleanbranch` command auto-switches branches before execution

## 2021.11.18 v2.13.0

1. Added `cleanbranch` command to clean merged feature branches
2. Improved `searchBranches` method, supports multi-type search, added `local` parameter and `exclude` regex

## 2021.11.18 v2.12.8

1. `go` command now supports clean method
2. Optimized `clean` command flow

## 2021.11.17 v2.12.7

1. Fixed `start` command code not found when creating branch from tag

## 2021.11.16 v2.12.6

1. Build config now supports saving multiple configs
2. `clean` command now cleans `packageInfo` cache

## 2021.11.14 v2.12.5

1. `continue` command now checks for forgotten commit code before execution

## 2021.11.12 v2.12.3

1. Fixed Windows environment `UI` interface `xterm` runtime error

## 2021.11.11 v2.12.2

1. Build now supports multiple apps separated by commas

## 2021.11.11 v2.12.1

1. `copy` command removed push action

## 2021.11.10 v2.12.0

### Features

1. `combine`, `end`, `start`, `update` commands added version detection to solve fragmentation issue
2. Adjusted `apollo` config caching scheme
3. Added `packageInfo` cache

### Improvements

1. Improved typescript types
2. Optimized `apollo` config reading scheme

## 2021.11.08 v2.11.1

1. Fixed inaccurate `dev` branch merge detection

## 2021.11.08 v2.11.0

### Features

1. Added global config `descriptionValidator` for validating commit reason description, supports regex and regex string
2. `combine`, `end`, `admin.publish`, `admin.update` methods added `--description` parameter with validation

### Improvements

1. Extracted shell script generation method

## 2021.11.06 v2.10.2

### Features

1. `upgrade` command added `--registry` and `--client` parameters for specifying mirror address and client

## 2021.11.05 v2.10.1

### Improvements

1. `combine` and `end` commands now use remote branches by default to check if merged to dev

## 2021.11.02 v2.10.0

### Features

1. `copy` command usage adjusted, from parameter changed to `--source`. Usage: `gitm copy [commitid...]` or `gitm copy [-s --source [source]] [-k --key [keyword]] [-a --author [author]]`
2. `copy` command now requires `--key` parameter for fuzzy batch copy, minimum 3 characters

### Improvements

1. `continue` command now cleans execution cache after successful execution

## 2021.10.31 v2.9.7

1. Adjusted database storage location to prevent data loss after upgrade
2. `log` command now exposes more log details

## 2021.10.30 v2.9.6

1. `end` command now intelligently determines whether to merge code, won't merge when not needed without `--no-combine`
2. `getIsMergedDevBranch` changed to `getIsMergedTargetBranch`, added `remote` parameter
3. Abstracted `getIsBranchOrCommitExist` method for checking branch or commit existence

## 2021.10.29 v2.9.5

1. Optimized `getIsUpdatedInTime` method detection strategy

## 2021.10.28 v2.9.4

1. Added `nameValidator` config parameter for validating branch name, supports regex and regex string
2. Branch name now supports slashes: `gitm start feature saqqdy/10000`

## 2021.10.28 v2.9.3

1. Fixed custom port `UI` startup not working

## 2021.10.25 v2.9.2

1. `ui` command added `--port` parameter for custom port number

## 2021.10.24 v2.9.1

1. Upgraded dependencies
2. Improved documentation

## 2021.10.23 v2.9.0

1. `go` command added `command` parameter to directly enter corresponding command
2. Improved help prompts for each command
3. Improved type definitions

## 2021.10.22 v2.8.9

1. Improved UI interface branch creation functionality
2. Optimized user experience

## 2021.10.22 v2.8.8

1. Fixed cross-platform script escaping issue

## 2021.10.22 v2.8.6

1. `gitm ui` now auto-opens browser

## 2021.10.21 v2.8.5

1. Fixed inaccurate `dev` merge detection

## 2021.10.20 v2.8.3

1. Fixed `dev` merge detection bug
2. Fixed method export error

## 2021.10.20 v2.8.0

1. `start` command now supports creating bugfix branch from tag

## 2021.10.19 v2.7.0

1. Corrected `log` and `hook` command parameter error: changed `latest` to `lastet`
2. `combine` command added `dev` branch sync check, won't allow prod merge if not synced
3. `combine` command added check for not syncing main branch code for over 1 week

## 2021.10.18 v2.6.5

1. Optimized `ui` user experience
2. `end` command now has checks when deleting branches
3. Fixed some config bugs

## 2021.10.18 v2.6.4

1. Fixed `end` command `--no-combine` parameter not working

## 2021.10.17 v2.6.3

1. Optimized `ui` interface, split task and workflow into 2 Terminals
2. Optimized experience and styles

## 2021.10.16 v2.6.2

1. Fixed several `ui` bugs

## 2021.10.15 v2.6.1

1. `end` command added `--as-feature` and `--no-combine` parameters
2. Upgraded dependencies
3. Optimized code

## 2021.09.17 v2.6.0

1. Refactored `server` with typescript
2. Optimized `get` command

## 2021.09.12 v2.5.1

1. `upgrade` command `version` parameter now supports tag names: `alpha`, `beta`, `release`, `lite`, `latest`, `next`, `x.x.x`, default `latest`

## 2021.09.12 v2.5.0

1. Refactored project with typescript
2. Cleaned `bin` directory to reduce npm package size
3. Fixed `upgrade` execution error

## 2021.09.04 v2.4.0

1. Migrated `gitm ui` to `vue3+vite+typescript` framework
2. Cleaned `static` directory to reduce npm package size

## 2021.08.28 v2.3.0

1. Adjusted `link`/`unlink` usage
2. Reduced npm package size

## 2021.08.25 v2.2.10

1. Adjusted build config storage directory
2. Added runtime environment checks to commands
3. Upgraded dependencies

## 2021.08.20 v2.2.9

1. `gitm end` command now deletes remote branch
2. `branch` command now supports deleting remote branches
3. `go` command now supports `link`/`unlink`/`postmsg`

## 2021.08.10 v2.2.8

1. Fixed `postmsg` Chinese encoding issue

## 2021.08.10 v2.2.7

1. Send group message notification when making git operation requests
2. `postmsg` command supports custom message notification `url`

## 2021.08.05 v2.2.6

1. Fixed `windows` merge request failure issue

## 2021.07.22 v2.2.5

1. Fixed build issue without merge permission
2. Deprecated `babel`, using `esbuild`
3. Cleaned unnecessary dependencies, fixed code issues

## 2021.07.15 v2.2.4

1. Fixed build being triggered without merge permission

## 2021.07.04 v2.2.3

1. `gitm update` supports `--all` to update all local branches at once
2. `gitm update` now uses `merge` by default, added `--use-rebase` parameter
3. Added branch search method for better performance

## 2021.05.29 v2.2.2

1. Organized documentation

## 2021.05.15 v2.2.1

1. Organized code

## 2021.05.15 v2.2.0

1. Optimized `gitmars UI` interface startup
2. Upgraded dependencies
3. Fixed some bugs

## 2021.05.03 v2.1.0

1. `go` command now supports `admin.create`/`admin.update`/`admin.clean`/`branch`/`get`/`save`/`copy`/`revert`
2. Parameter validation now uses sub-option config first

## 2021.04.27 v2.0.3

1. Added `admin` command auto-creates `merge` request, optimized logic

## 2021.03.27 v2.0.2

1. Added `gitm ui` command to start UI interface
2. Added auto merge request for no git permission, need to configure `api`, `gitHost`, `gitID`
3. Upgraded `checkBranch`, `searchBranches`, `getCurrentBranch` methods for better performance
4. Removed forced api config
5. `git config` and `git init` now support `api`/`gitHost`/`gitID` parameter settings

## 2021.1.29 v1.4.2

1. Upgraded dependencies
2. Fixed bugs

## 2021.1.11 v1.4.1

1. Upgraded get `config` method, upgraded update `config` method
2. Optimized reading `gitmars` config and git config
3. Changed config method, deprecating `gitmarsconfig.json`, using `.gitmarsrc`
4. Fixed `Apollo` config issue

## 2020.12.29 v1.4.0

1. Added `go` command, supports `admin.publish`/`build`/`combine`/`end`/`start`/`update`

## 2020.10.16 v1.3.6

1. Added `postmsg` command for pushing messages

## 2020.08.14 v1.3.4

1. `bugfix` branch with `--as-feature` no longer auto-merges to `bug` line
2. Extracted command config, preparing for `gitmars ui`

## 2020.08.14 v1.3.3

1. Changed method to get current branch status

## 2020.08.02 v1.3.2

1. Changed method to get current branch name, fixed Windows compatibility

## 2020.07.23 v1.3.1

1. Optimized `link`/`unlink` for Windows compatibility

## 2020.07.22 v1.3.0

1. Added `link` command for creating local package symlinks

## 2020.07.07 v1.2.9

1. Optimized `combine` command `status` check
2. Upgraded dependencies

## 2020.07.07 v1.2.8

1. Fixed `jenkins` not starting bug

## 2020.06.30 v1.2.7

1. Upgraded `combine`/`end`/`update` commands, branch name is optional, defaults to current branch
2. `combine` command added `-a` and `-m` parameters for auto `add` and `commit`
3. Upgraded documentation

## 2020.06.27 v1.2.6

1. Upgraded `upgrade` command, Windows users can now use upgrade command!

## 2020.06.27 v1.2.5

1. Upgraded `get`/`save` commands, stash now "bound" to git branch, added advanced usage
2. Fixed `config` command bug
3. Fixed `continue` command bug

## 2020.06.16 v1.2.4

1. Fixed compatibility issue with node v14
2. Fixed missing package bug
3. Code transpiled to ES5 for publishing

## 2020.05.29 v1.2.2

1. Added `build` command to trigger Jenkins build
2. `combine` and `admin publish` commands added `--build` parameter to trigger Jenkins build after merging
3. Build config fetched from remote and cached for 24 hours, auto-refreshed after expiration or `gitm clean`
4. Optimized code structure, cleaned redundant operations, improved performance
5. Fixed historical bugs

## 2020.05.21 v1.1.2

1. Fixed `permission` occasional inaccurate detection (important)

## 2020.05.19 v1.1.1

1. Added `clean` command to clear gitmars cache and config files
2. `upgrade` command added `version` parameter for upgrading to specific version

## 2020.05.19 v1.1.0

1. Added `permission` command to restrict direct commits to `master` branch
2. Optimized execution logic, allows running `gitm` in subdirectories
3. Optimized logging and execution output, no more large garbled text

## 2020.05.15 v1.0.20

1. Fixed `copy` command bug

## 2020.05.13 v1.0.19

1. `update` command added `--use-merge` config
2. `admin` command `--rebase` config changed to `--use-rebase`

## 2020.05.11 v1.0.18

1. `copy` command removed keyword limit
2. Optimized version upgrade command
3. Optimized command execution prompts

## 2020.04.28 v1.0.17

1. `combine` command added `--as-feature` config, pass `--as-feature` when `bugfix` branch needs to merge to `release`

## 2020.04.17 v1.0.16

1. Optimized message prompts

## 2020.04.08 v1.0.15

1. Optimized commands
2. Added `postmsg` support to commands

## 2020.04.08 v1.0.14

1. `combine` command allows `--no-bugfix` when merging `support` type branches to not merge to `bug` branch
2. Added `postmsg` switch
3. Optimized command execution message prompts

## 2020.04.02 v1.0.13

1. `gitm branch` supports setting remote branch association
2. Added `upgrade` method

## 2020.03.31 v1.0.12

1. `start` command now auto-pulls latest code when creating branch

## 2020.03.27 v1.0.11

1. Updated `bugfix` and `release` branch support for forcing use of incoming or current code
2. Message push supports template config. Supported params: `message`, `time`, `project`, `pwd`(execution directory), `user`(local config username). Default template: `${message}; Project: ${project}; Path: ${pwd}`

## 2020.03.25 v1.0.10

1. Added message push
2. No longer blocks execution when switching branches with unversioned files
3. Optimized `admin` method

## 2020.03.22 v1.0.9

1. Adjusted `admin` merge strategy
2. Fixed some Windows compatibility issues

## 2020.03.18 v1.0.8

1. Added `support` branch support

## 2020.03.08 v1.0.7

1. Optimized `gitm revert` functionality
2. Optimized command execution prompt method

## 2020.03.04 v1.0.6

1. `admin` added `clean` command for Jenkins build branch cleanup
2. Updated `readme`

## 2020.03.02 v1.0.5

1. Added `continue` and `branch` methods
2. Improved execution main program
3. Added `log`
4. Improved `copy` functionality
5. Fixed some bugs
6. Optimized command execution methods
7. Optimized code
8. Improved `readme`
9. Improved `end` and `start` functionality
10. Improved `admin` functionality: `update`, `create`, `publish`

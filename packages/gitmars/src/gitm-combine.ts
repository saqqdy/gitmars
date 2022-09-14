#!/usr/bin/env ts-node
import { createRequire } from 'node:module'
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import getType from 'js-cool/es/getType'
import { queue } from '@gitmars/core/lib/queue'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import getGitConfig from '@gitmars/core/lib/git/getGitConfig'
import getIsMergedTargetBranch from '@gitmars/core/lib/git/getIsMergedTargetBranch'
import getIsUpdatedInTime from '@gitmars/core/lib/git/getIsUpdatedInTime'
import checkGitStatus from '@gitmars/core/lib/git/checkGitStatus'
import searchBranches from '@gitmars/core/lib/git/searchBranches'
import { createArgs } from '@gitmars/core/lib/utils/command'
import { isNeedUpgrade, upgradeGitmars } from '@gitmars/core/lib/versionControl'
import getConfig from '@gitmars/core/lib/getConfig'
import getUserToken from '@gitmars/core/lib/api/getUserToken'
import type {
    CommandType,
    FetchDataType,
    GitmarsOptionOptionsType
} from '../typings'
import { defaults } from '#lib/common/global'
import i18n from '#lib/locales/index'
import combineConfig from '#lib/conf/combine'

const require = createRequire(import.meta.url)
const { red, yellow } = chalk

if (!getIsGitProject()) {
    sh.echo(
        red(i18n.__('The current directory is not a git project directory'))
    )
    process.exit(1)
}

const mergeRequestModule = require.resolve('@gitmars/core/lib/api/mergeRequest')

interface GitmBuildOption {
    dev?: boolean
    prod?: boolean
    build?: boolean | string
    commit?: boolean | string
    description?: string
    add?: boolean
    noBugfix?: boolean
    asFeature?: boolean
    force?: boolean
}

const { args, options } = combineConfig
const { appName } = getGitConfig()
const config = getConfig()

/**
 * gitm combine
 */
program
    .name('gitm combine')
    .usage(
        '[type] [name] [-d --dev] [-p --prod] [-b --build [app]] [-a --add] [-m --commit <commit>] [--description [description]] [--as-feature] [--no-bugfix] [-f --force]'
    )
    .description(
        i18n.__(
            'Merge bugfix task branch, merge feature development branch, merge support branch'
        )
    )
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('-d, --dev', i18n.__('Whether to sync to alpha test environment'), false)
// .option('-p, --prod', i18n.__('Whether to sync to pre-release environment'), false)
// .option('-b, --build [build]', i18n.__('Application to be built'))
// .option('-m, --commit <commit>', i18n.__('commit information'), '')
// .option('--description [description]', i18n.__('Description of the reason for this commit'), '')
// .option('-a, --add', i18n.__('Need to add'), false)
// .option('--no-bugfix', i18n.__('Do not sync to bug branch'))
// .option('--as-feature', i18n.__('bug branch merge to release'))
// .option('-f, --force', i18n.__('Whether to force a merge request'), false)
program.action(
    async (type: string, name: string, opt: GitmBuildOption): Promise<void> => {
        const userInfoApi =
            (config.apis && config.apis.userInfo && config.apis.userInfo.url) ||
            config.api
        // Detecting if a version upgrade is needed
        const needUpgrade = await isNeedUpgrade()
        needUpgrade && upgradeGitmars()
        const allow = ['bugfix', 'feature', 'support'] // Permissible commands
        const deny = [
            defaults.master,
            defaults.develop,
            defaults.release,
            defaults.bugfix,
            defaults.support
        ]
        const {
            token,
            level,
            nickname = ''
        } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
        const status = !opt.add && opt.commit === '' ? checkGitStatus() : true
        let _nameArr: string[] = [], // Branch name array
            isDescriptionCorrect = true // Does the description of the reason for this submission meet the specification
        if (!opt.dev && !opt.prod) {
            sh.echo(i18n.__('Please enter the environment to sync to.'))
            process.exit(1)
        }
        if (!status) process.exit(1)
        if (opt.commit === true) {
            sh.echo(red(i18n.__('Please enter the message to be submitted')))
            process.exit(1)
        }
        // When there is a descriptionValidator configured, the description information needs to be verified
        if (config.descriptionValidator) {
            // Verify the description for this commit
            const reg =
                getType(config.descriptionValidator) === 'regexp'
                    ? config.descriptionValidator
                    : new RegExp(config.descriptionValidator)
            isDescriptionCorrect = opt.description && reg.test(opt.description)
        }
        if (!type) {
            // type and name are not passed and the current branch is a development branch
            ;[type, ..._nameArr] = getCurrentBranch().split('/')
            name = _nameArr.join('/')
            if (!name) {
                deny.includes(type) &&
                    sh.echo(
                        red(
                            i18n.__(
                                'Hey bro, what is the fuck are you doing by executing this command in the {{type}} branch?',
                                { type }
                            )
                        )
                    )
                process.exit(1)
            }
        } else if (!name) {
            // passed type but not name
            if (allow.includes(type)) {
                sh.echo(i18n.__('Please enter branch name'))
                process.exit(1)
            }
            const branches = searchBranches({ type })
            if (branches.length === 1) {
                ;[type, _nameArr] = branches[0].split('/')
                name = _nameArr.join('/')
            } else {
                sh.echo(
                    branches.length > 1
                        ? i18n.__(
                              'If you find multiple branches with names containing {{type}}, please enter the branch type',
                              { type }
                          )
                        : red(
                              i18n.__(
                                  'Branch does not exist, please enter it correctly'
                              )
                          )
                )
                process.exit(1)
            }
        }
        if (allow.includes(type) && name) {
            const base: string =
                type === 'bugfix' ? config.bugfix : config.release
            let cmd: Array<CommandType | string> = []
            // Get whether the upstream branch code has been synchronized within a week
            if (
                !getIsUpdatedInTime({ lastet: '7d', limit: 1000, branch: base })
            ) {
                sh.echo(
                    yellow(
                        i18n.__(
                            'This branch has not been synced for more than 1 week, please sync it at least once a week, execute: gitm update'
                        )
                    )
                )
            }
            if (opt.add) {
                cmd = cmd.concat(['git add .'])
            }
            if (opt.commit) {
                cmd = cmd.concat([`git commit -m "${opt.commit}"`])
            }
            // combine to dev
            if (opt.dev) {
                // Is it necessary to merge dev
                const isNeedCombineDevelop = !getIsMergedTargetBranch(
                    `${type}/${name}`,
                    config.develop,
                    true
                )
                cmd = cmd.concat(
                    isNeedCombineDevelop || opt.force
                        ? [
                              'git fetch',
                              `git checkout ${config.develop}`,
                              'git pull',
                              {
                                  cmd: `git merge --no-ff ${type}/${name}`,
                                  config: {
                                      again: false,
                                      success: i18n.__(
                                          'Merge {{source}} into {{target}} successfully',
                                          {
                                              source: `${type}/${name}`,
                                              target: config.develop
                                          }
                                      ),
                                      fail: i18n.__(
                                          'An error occurred merging {{source}} to {{target}}, Please follow the instructions',
                                          {
                                              source: `${type}/${name}`,
                                              target: config.develop
                                          }
                                      )
                                  }
                              },
                              {
                                  cmd: 'git push',
                                  config: {
                                      again: true,
                                      success: i18n.__('Successful Pushed'),
                                      fail: i18n.__(
                                          'Push failed, please follow the prompts'
                                      )
                                  }
                              },
                              `git checkout ${type}/${name}`
                          ]
                        : [
                              {
                                  message: i18n.__(
                                      '{{source}} has been merged with {{target}}',
                                      {
                                          source: `${type}/${name}`,
                                          target: config.develop
                                      }
                                  )
                              }
                          ]
                )
                if (opt.build) {
                    cmd = cmd.concat([
                        {
                            cmd: `gitm build ${appName} --env dev --app ${
                                opt.build === true ? 'all' : opt.build
                            }`,
                            config: {
                                again: false,
                                success: i18n.__(
                                    'Pulling up the build was successful'
                                ),
                                fail: i18n.__('Failed to pull up the build')
                            }
                        }
                    ])
                }
            }
            // Start merging to prod
            if (opt.prod) {
                // Determine if has merged dev branch
                if (
                    !opt.dev &&
                    !getIsMergedTargetBranch(
                        `${type}/${name}`,
                        config.develop,
                        true
                    )
                ) {
                    sh.echo(
                        yellow(
                            i18n.__(
                                'If your branch has not been merged into {{target}}, please merge it into the {{target}} branch first',
                                { target: config.develop }
                            )
                        )
                    )
                    process.exit(1)
                } else {
                    // merge to prod
                    if (!opt.noBugfix && !opt.asFeature) {
                        // noBugfix - do not merge to bug branch
                        if (!level || level < 3) {
                            // Is it necessary to merge prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                base,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
                                    ? [
                                          'git fetch',
                                          `git checkout ${base}`,
                                          'git pull',
                                          {
                                              cmd: `git merge --no-ff ${type}/${name}`,
                                              config: {
                                                  again: false,
                                                  success: i18n.__(
                                                      'Merge {{source}} into {{target}} successfully',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: base
                                                      }
                                                  ),
                                                  fail: i18n.__(
                                                      'An error occurred merging {{source}} to {{target}}, Please follow the instructions',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: base
                                                      }
                                                  )
                                              }
                                          },
                                          {
                                              cmd: 'git push',
                                              config: {
                                                  again: true,
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: i18n.__(
                                                  '{{source}} has been merged with {{target}}',
                                                  {
                                                      source: `${type}/${name}`,
                                                      target: base
                                                  }
                                              )
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: base,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${i18n.__(
                                    '{{nickname}} submitted a merge request for {{source}} branch to {{target}} branch in {{app}} project',
                                    {
                                        nickname,
                                        app: appName,
                                        source: `${type}/${name}`,
                                        target: base
                                    }
                                )}"`
                            ])
                        }
                    }
                    // bugfix分支走release发布
                    if (type === 'bugfix' && opt.asFeature) {
                        if (!level || level < 3) {
                            // Is it necessary to merge prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                config.release,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
                                    ? [
                                          'git fetch',
                                          `git checkout ${config.release}`,
                                          'git pull',
                                          {
                                              cmd: `git merge --no-ff ${type}/${name}`,
                                              config: {
                                                  again: false,
                                                  success: i18n.__(
                                                      'Merge {{source}} into {{target}} successfully',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: config.release
                                                      }
                                                  ),
                                                  fail: i18n.__(
                                                      'An error occurred merging {{source}} to {{target}}, Please follow the instructions',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: config.release
                                                      }
                                                  )
                                              }
                                          },
                                          {
                                              cmd: 'git push',
                                              config: {
                                                  again: true,
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: i18n.__(
                                                  '{{source}} has been merged with {{target}}',
                                                  {
                                                      source: `${type}/${name}`,
                                                      target: config.release
                                                  }
                                              )
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: config.release,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${i18n.__(
                                    '{{nickname}} submitted a merge request for {{source}} branch to {{target}} branch in {{app}} project',
                                    {
                                        nickname,
                                        app: appName,
                                        source: `${type}/${name}`,
                                        target: config.release
                                    }
                                )}"`
                            ])
                        }
                    }
                    // support分支需要合到bugfix
                    if (type === 'support' && opt.noBugfix) {
                        if (!level || level < 3) {
                            // Is it necessary to merge prod
                            const isNeedCombineProd = !getIsMergedTargetBranch(
                                `${type}/${name}`,
                                config.bugfix,
                                true
                            )
                            cmd = cmd.concat(
                                isNeedCombineProd || opt.force
                                    ? [
                                          'git fetch',
                                          `git checkout ${config.bugfix}`,
                                          'git pull',
                                          {
                                              cmd: `git merge --no-ff ${type}/${name}`,
                                              config: {
                                                  again: false,
                                                  success: i18n.__(
                                                      'Merge {{source}} into {{target}} successfully',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: config.bugfix
                                                      }
                                                  ),
                                                  fail: i18n.__(
                                                      'An error occurred merging {{source}} to {{target}}, Please follow the instructions',
                                                      {
                                                          source: `${type}/${name}`,
                                                          target: config.bugfix
                                                      }
                                                  )
                                              }
                                          },
                                          {
                                              cmd: 'git push',
                                              config: {
                                                  again: true,
                                                  success:
                                                      i18n.__(
                                                          'Successful Pushed'
                                                      ),
                                                  fail: i18n.__(
                                                      'Push failed, please follow the prompts'
                                                  )
                                              }
                                          },
                                          `git checkout ${type}/${name}`
                                      ]
                                    : [
                                          {
                                              message: i18n.__(
                                                  '{{source}} has been merged with {{target}}',
                                                  {
                                                      source: `${type}/${name}`,
                                                      target: config.bugfix
                                                  }
                                              )
                                          }
                                      ]
                            )
                        } else {
                            if (!isDescriptionCorrect) {
                                sh.echo(
                                    red(
                                        i18n.__(
                                            'The description of the reason for submission does not meet the specification'
                                        )
                                    )
                                )
                                process.exit(1)
                            }
                            cmd = cmd.concat([
                                {
                                    cmd: `git push --set-upstream origin ${type}/${name}`,
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Push remote and associate remote branch successfully'
                                        ),
                                        fail: i18n.__(
                                            'Push remote failed, please follow the prompts'
                                        )
                                    }
                                },
                                {
                                    cmd: {
                                        module: mergeRequestModule,
                                        entry: 'createMergeRequest',
                                        options: {
                                            source_branch: `${type}/${name}`,
                                            target_branch: config.bugfix,
                                            token,
                                            description: opt.description
                                        }
                                    },
                                    config: {
                                        again: true,
                                        success: i18n.__(
                                            'Successfully created merge request'
                                        ),
                                        fail: i18n.__(
                                            'There was an error creating the merge request, please follow the instructions'
                                        )
                                    }
                                },
                                `gitm postmsg "${i18n.__(
                                    '{{nickname}} submitted a merge request for {{source}} branch to {{target}} branch in {{app}} project',
                                    {
                                        nickname,
                                        app: appName,
                                        source: `${type}/${name}`,
                                        target: config.bugfix
                                    }
                                )}"`
                            ])
                        }
                    }
                    // 仅支持构建bug
                    if (opt.build && (!level || level < 3)) {
                        if (type === 'bugfix') {
                            cmd = cmd.concat([
                                {
                                    cmd: `gitm build ${appName} --env bug --app ${
                                        opt.build === true ? 'all' : opt.build
                                    }`,
                                    config: {
                                        again: false,
                                        success: i18n.__(
                                            'Pulling up the build was successful'
                                        ),
                                        fail: i18n.__(
                                            'Failed to pull up the build'
                                        )
                                    }
                                }
                            ])
                        }
                        // support分支要构建bug和release
                        if (type === 'support' && opt.noBugfix) {
                            cmd = cmd.concat([
                                {
                                    cmd: `gitm build ${appName} --env bug --app ${
                                        opt.build === true ? 'all' : opt.build
                                    }`,
                                    config: {
                                        again: false,
                                        success: i18n.__(
                                            'Pulling up the build was successful'
                                        ),
                                        fail: i18n.__(
                                            'Failed to pull up the build'
                                        )
                                    }
                                }
                            ])
                        }
                    }
                }
            }
            queue(cmd)
        } else {
            sh.echo(
                red(
                    i18n.__('type only allows input') +
                        ': ' +
                        JSON.stringify(allow)
                )
            )
            process.exit(1)
        }
    }
)
program.parse(process.argv)
export {}

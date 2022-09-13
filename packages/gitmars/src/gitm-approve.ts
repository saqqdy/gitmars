#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import getUserToken from '@gitmars/core/lib/api/getUserToken'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitConfig from '@gitmars/core/lib/git/getGitConfig'
import sendGroupMessage from '@gitmars/core/lib/sendGroupMessage'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import getConfig from '@gitmars/core/lib/getConfig'
import {
    acceptMergeRequest,
    deleteMergeRequest,
    getMergeRequestChanges,
    getMergeRequestList,
    updateMergeRequest
} from '@gitmars/core/lib/api/mergeRequest'
import { getMergeRequestNotesList } from '@gitmars/core/lib/api/mergeRequestNotes'
import type {
    FetchDataType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType
} from '../typings'
import i18n from '#lib/locales/index'
import approveConfig from '#lib/conf/approve'

const { blue, cyan, green, magenta, red, yellow } = chalk
const { args, options } = approveConfig

if (!getIsGitProject()) {
    echo(red(i18n.__('The current directory is not a git project directory')))
    process.exit(1)
}

const { appName } = getGitConfig()
const config = getConfig()
interface GitmBuildOption {
    state?: string
    quiet: boolean
}

/**
 * gitm approve
 */
program
    .name('gitm approve')
    .usage('[--state [state]] [--quiet]')
    .description(i18n.__('Approve remote merge request'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--state [state]', i18n.__('Filter merge request status, there are 2 types: opened, closed, not passed then default all'), null)
// .option('--quiet', i18n.__('Do not push the message'), false)
program.action(async (opt: GitmBuildOption): Promise<void> => {
    const userInfoApi =
        (config.apis && config.apis.userInfo && config.apis.userInfo.url) ||
        config.api
    const {
        token,
        level,
        nickname = ''
    } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
    if (level && level > 3) {
        echo(
            red(
                i18n.__("Hey {{name}}, you don't have permission", { nickname })
            )
        )
        process.exit(1)
    }
    const mrList = await getMergeRequestList({ token, state: opt.state })
    // 没有任何记录
    if (mrList.length === 0) {
        echo(
            yellow(i18n.__('No merge request record found, process has exited'))
        )
        process.exit(0)
    }
    const prompt: InitInquirerPromptType[] = [
        {
            type: 'checkbox',
            message: i18n.__('Please select the merge request to be operated'),
            name: 'iids',
            choices: []
        },
        {
            type: 'list',
            message: i18n.__('Please select the action below.'),
            name: 'accept',
            choices: [
                i18n.__('View Details'),
                i18n.__('Passed'),
                i18n.__('Not passed'),
                i18n.__('Failed and deleted'),
                i18n.__('Exit')
            ],
            when(answers) {
                return answers.iids.length
            }
        }
    ]
    for (const mr of mrList) {
        const {
            iid,
            author,
            source_branch,
            target_branch,
            merge_status,
            created_at
        } = mr
        mr.notes = (
            (await getMergeRequestNotesList({
                token,
                iid
            })) || []
        ).filter((note: any) => !note.system)
        const disabled = merge_status !== 'can_be_merged'
        const _time = dayjs(created_at).format('YYYY/MM/DD HH:mm')
        prompt[0].choices.push({
            name: `${green(iid + '：')} 请求合并 ${green(
                source_branch
            )} 到 ${green(target_branch)} ${
                disabled
                    ? red(`[ ${i18n.__('Conflict or no need to merge')} ]`)
                    : ''
            } | ${yellow(author.name)} | ${green(
                mr.notes.length + '条评论'
            )} | ${blue(_time)}`,
            value: iid,
            // disabled,
            checked: false
        })
    }
    const { iids, accept } = await inquirer.prompt(prompt)
    // 没有选择任何记录
    if (iids.length === 0) {
        echo(
            yellow(
                i18n.__('No merge request record selected, process has exited')
            )
        )
        process.exit(0)
    }

    // 开始执行操作
    for (const iid of iids) {
        const { merge_status, source_branch, target_branch } = mrList.find(
            (item: any) => item.iid === iid
        )
        const CAN_BE_MERGED = merge_status === 'can_be_merged'
        if (accept === i18n.__('Passed')) {
            if (!CAN_BE_MERGED) {
                echo(
                    yellow(
                        i18n.__(
                            "Requests that can't be merged can't be clicked for review and approval"
                        )
                    )
                )
                process.exit(0)
            }
            await acceptMergeRequest({ token, iid })
            !opt.quiet &&
                sendGroupMessage(
                    i18n.__(
                        '{{app}} item {{source}} merged to {{target}} request ID {{id}} has been merged',
                        {
                            app: appName,
                            source: source_branch,
                            target: target_branch,
                            id: iid
                        }
                    )
                )
            echo(green(i18n.__('Merge request {{id}}: Merged', { id: iid })))
        } else if (accept === i18n.__('View Details')) {
            const { changes, changes_count } = await getMergeRequestChanges({
                token,
                iid
            })
            echo(green(`\n${iid}：一共变动了${changes_count}个文件`))
            for (const { old_path, new_path, diff } of changes) {
                echo(
                    magenta(
                        '\n----------------------------------------------------------------------------------'
                    )
                )
                echo(magenta(old_path))
                old_path !== new_path &&
                    echo(magenta(new_path + `(${i18n.__('New path')})`))
                echo(
                    diff
                        .replace(
                            /(@@.+)\n/g,
                            (m: string, p1: string) => cyan(p1) + '\n'
                        )
                        .replace(
                            /\n(-.+)/g,
                            (m: string, p1: string) => '\n' + red(p1)
                        )
                        .replace(
                            /\n(\+.+)/g,
                            (m: string, p1: string) => '\n' + green(p1)
                        )
                )
            }
        } else if (accept === i18n.__('Failed and deleted')) {
            await deleteMergeRequest({ token, iid })
            !opt.quiet &&
                sendGroupMessage(
                    i18n.__(
                        '{{app}} item {{source}} merged to {{target}} request ID {{id}} has been deleted',
                        {
                            app: appName,
                            source: source_branch,
                            target: target_branch,
                            id: iid
                        }
                    )
                )
            echo(green(i18n.__('Merge request {{id}}: Deleted', { id: iid })))
        } else if (accept === i18n.__('Not passed')) {
            // 删除
            await updateMergeRequest({
                token,
                iid,
                data: { state_event: 'close' }
            })
            !opt.quiet &&
                sendGroupMessage(
                    i18n.__(
                        '{{app}} item {{source}} merged to {{target}} request ID {{id}} has been closed',
                        {
                            app: appName,
                            source: source_branch,
                            target: target_branch,
                            id: iid
                        }
                    )
                )
            echo(green(i18n.__('Merge request {{id}}: Closed', { id: iid })))
        }
    }
})

program.parse(process.argv)
export {}

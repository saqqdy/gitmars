#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import columnify from 'columnify'
import chalk from 'chalk'
import getUserToken from '@gitmars/core/lib/api/getUserToken'
import getIsGitProject from '@gitmars/core/lib/git/getIsGitProject'
import getGitConfig from '@gitmars/core/lib/git/getGitConfig'
import sendGroupMessage from '@gitmars/core/lib/sendGroupMessage'
import { createArgs } from '@gitmars/core/lib/utils/command'
import echo from '@gitmars/core/lib/utils/echo'
import getConfig from '@gitmars/core/lib/getConfig'
import {
    deleteMergeRequest,
    getMergeRequestChanges,
    getMergeRequestList,
    updateMergeRequest
} from '@gitmars/core/lib/api/mergeRequest'
import {
    createMergeRequestNotes,
    getMergeRequestNotesList
} from '@gitmars/core/lib/api/mergeRequestNotes'
import type {
    FetchDataType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType
} from '../typings'
import i18n from '#lib/locales/index'
import reviewConfig from '#lib/conf/review'

const { blue, cyan, green, magenta, red, yellow } = chalk
const { args, options } = reviewConfig

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
 * gitm review
 */
program
    .name('gitm review')
    .usage('[--state [state]] [--quiet]')
    .description(i18n.__('review remote code'))
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
    const { token } = userInfoApi ? await getUserToken() : ({} as FetchDataType)
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
            message: '请选择下面的操作?',
            name: 'accept',
            choices: [
                i18n.__('View Details'),
                i18n.__('Comments'),
                '关闭',
                '删除',
                i18n.__('Exit')
            ],
            when(answers) {
                return answers.iids.length
            }
        }
    ]
    mrList.forEach((mr: any) => {
        const {
            iid,
            author,
            source_branch,
            target_branch,
            merge_status,
            created_at
        } = mr
        const disabled = merge_status !== 'can_be_merged'
        const _time = dayjs(created_at).format('YYYY/MM/DD HH:mm')
        prompt[0].choices.push({
            name: `${green(iid + '：')} 请求合并 ${green(
                source_branch
            )} 到 ${green(target_branch)} ${
                disabled
                    ? red(`[ ${i18n.__('Conflict or no need to merge')} ]`)
                    : ''
            } | ${yellow(author.name)} | ${blue(_time)}`,
            value: iid,
            // disabled,
            checked: false
        })
    })
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
        const { source_branch, target_branch } = mrList.find(
            (item: any) => item.iid === iid
        )
        if (accept === i18n.__('View Details')) {
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
                old_path !== new_path && echo(magenta(new_path + '(新路径)'))
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
            // 日志
            const notes = (
                (await getMergeRequestNotesList({
                    token,
                    iid
                })) || []
            )
                .filter((note: any) => !note.system)
                .map((note: any) => ({
                    body: green(note.body),
                    name: yellow(note.author.name),
                    date: blue(
                        dayjs(note.updated_at).format('YYYY/MM/DD HH:mm:ss')
                    )
                }))
            echo(
                magenta(
                    '\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
                )
            )
            echo(magenta(i18n.__('Comment List')))
            echo(
                columnify(notes, {
                    columns: ['body', 'name', 'date']
                })
            )
        } else if (accept === '删除') {
            await deleteMergeRequest({ token, iid })
            !opt.quiet &&
                sendGroupMessage(
                    `${appName}项目${source_branch}合并到${target_branch}请求ID${iid}已删除`
                )
            echo(green(`合并请求${iid}：已删除`))
        } else if (accept === '关闭') {
            // 删除
            await updateMergeRequest({
                token,
                iid,
                data: { state_event: 'close' }
            })
            !opt.quiet &&
                sendGroupMessage(
                    `${appName}项目${source_branch}合并到${target_branch}请求ID${iid}已暂时关闭`
                )
            echo(green(`合并请求${iid}：已关闭`))
        } else if (accept === i18n.__('Comments')) {
            // 评论
            const { note } = await inquirer.prompt({
                type: 'input',
                name: 'note',
                message: '请输入评论内容',
                default: '',
                transformer: (val: string) => val.trim(),
                validate: (val: string) => (!val ? '请输入可用评论' : true)
            })
            !opt.quiet &&
                sendGroupMessage(
                    `${appName}项目${source_branch}合并到${target_branch}请求ID${iid}有新评论：${note}`
                )
            await createMergeRequestNotes({ token, iid, body: note })
            echo(green('已提交'))
        }
    }
})

program.parse(process.argv)
export {}

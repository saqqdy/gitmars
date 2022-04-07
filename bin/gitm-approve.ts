#!/usr/bin/env ts-node
import {
    FetchDataType,
    GitmarsOptionOptionsType,
    InitInquirerPromptType
} from '../typings'
const { program } = require('commander')
const dayjs = require('dayjs')
const inquirer = require('inquirer')
const { green, yellow, blue, red, cyan, magenta } = require('colors')
const { options, args } = require('./conf/approve')
const getUserToken = require('./core/api/getUserToken')
const getIsGitProject = require('./core/git/getIsGitProject')
const getGitConfig = require('./core/git/getGitConfig')
const sendGroupMessage = require('./core/sendGroupMessage')
const { createArgs } = require('./core/utils/command')
const echo = require('./core/utils/echo')
if (!getIsGitProject()) {
    echo(red('当前目录不是git项目目录'))
    process.exit(1)
}
const { appName } = getGitConfig()
const getConfig = require('./core/getConfig')
const config = getConfig()
const {
    getMergeRequestList,
    getMergeRequestChanges,
    acceptMergeRequest,
    updateMergeRequest,
    deleteMergeRequest
} = require('./core/api/mergeRequest')
const { getMergeRequestNotesList } = require('./core/api/mergeRequestNotes')
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
    .description('审批远程合并请求')
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
    program.option(o.flags, o.description, o.defaultValue)
})
// .option('--state [state]', '筛选合并请求状态，共有2种：opened、closed，不传则默认全部', null)
// .option('--quiet', '不要推送消息', false)
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
        echo(red(`${nickname}同学，你的权限不足`))
        process.exit(1)
    }
    const mrList = await getMergeRequestList({ token, state: opt.state })
    // 没有任何记录
    if (mrList.length === 0) {
        echo(yellow('没有发现合并请求记录，进程已退出'))
        process.exit(0)
    }
    const prompt: InitInquirerPromptType[] = [
        {
            type: 'checkbox',
            message: '请选择要操作的合并请求',
            name: 'iids',
            choices: []
        },
        {
            type: 'list',
            message: '请选择下面的操作?',
            name: 'accept',
            choices: ['查看详情', '通过', '不通过', '不通过并删除', '退出'],
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
                disabled ? red('[ 有冲突或不需要合并 ]') : ''
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
        echo(yellow('没有选择合并请求记录，进程已退出'))
        process.exit(0)
    }

    // 开始执行操作
    for (const iid of iids) {
        const { merge_status, source_branch, target_branch } = mrList.find(
            (item: any) => item.iid === iid
        )
        const CAN_BE_MERGED = merge_status === 'can_be_merged'
        if (accept === '通过') {
            if (!CAN_BE_MERGED) {
                echo(yellow('不能合并的请求不能点审核通过'))
                process.exit(0)
            }
            await acceptMergeRequest({ token, iid })
            !opt.quiet &&
                sendGroupMessage(
                    `${appName}项目${source_branch}合并到${target_branch}请求ID${iid}已合并`
                )
            echo(green(`合并请求${iid}：已合并`))
        } else if (accept === '查看详情') {
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
        } else if (accept === '不通过并删除') {
            await deleteMergeRequest({ token, iid })
            !opt.quiet &&
                sendGroupMessage(
                    `${appName}项目${source_branch}合并到${target_branch}请求ID${iid}已删除`
                )
            echo(green(`合并请求${iid}：已删除`))
        } else if (accept === '不通过') {
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
        }
    }
})

program.parse(process.argv)
export {}

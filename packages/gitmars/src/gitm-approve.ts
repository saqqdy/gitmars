#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import getUserInfo from '@gitmars/core/lib/api/getUserInfo'
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
import type { FetchDataType, GitmarsOptionOptionsType } from '../typings/gitmars'
import lang from '#lib/common/local'
import approveConfig from '#lib/conf/approve'

const { t } = lang
const { blue, cyan, green, magenta, red, yellow } = chalk
const { args, options } = approveConfig

if (!getIsGitProject()) {
	echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const { appName } = getGitConfig()
const config = getConfig()
interface GitmBuildOption {
	state?: 'merged' | 'opened' | 'closed' | 'all'
	quiet: boolean
}

/**
 * gitm approve
 */
program
	.name('gitm approve')
	.usage('[--state [state]] [--quiet]')
	.description(t('Approve remote merge request'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--state [state]', t('Filter merge request status, there are 2 types: opened, closed, not passed then default all'), null)
// .option('--quiet', t('Do not push the message'), false)
program.action(async (opt: GitmBuildOption): Promise<void> => {
	const userInfoApi = config.apis?.userInfo?.url || config.api
	const { level, nickname = '' } = userInfoApi ? await getUserInfo() : ({} as FetchDataType)
	if (level && level > 3) {
		echo(red(t("Hey {name}, you don't have permission", { nickname })))
		process.exit(1)
	}
	const mrList = await getMergeRequestList({ state: opt.state })
	// no records
	if (mrList.length === 0) {
		echo(yellow(t('No merge request record found, process has exited')))
		process.exit(0)
	}
	const prompt: any = [
		{
			type: 'checkbox',
			message: t('Please select the merge request to be operated'),
			name: 'iids',
			choices: []
		},
		{
			type: 'list',
			message: t('Please select the action below.'),
			name: 'accept',
			choices: [
				t('View Details'),
				t('Passed'),
				t('Not passed'),
				t('Failed and deleted'),
				t('Exit')
			],
			when(answers: any) {
				return answers.iids.length
			}
		}
	]
	for (const mr of mrList) {
		const { iid, author, source_branch, target_branch, merge_status, created_at } = mr
		mr.notes = (
			(await getMergeRequestNotesList({
				iid
			})) || []
		).filter((note: any) => !note.system)
		const disabled = merge_status !== 'can_be_merged'
		const _time = dayjs(created_at).format('YYYY/MM/DD HH:mm')
		prompt[0].choices.push({
			name: t(
				'{id} request merge {source} to {target} {disabled} | {name} | {comments} | {time}',
				{
					id: green(iid + ': '),
					source: green(source_branch),
					target: green(target_branch),
					disabled: disabled ? red(`[ ${t('Conflict or no need to merge')} ]`) : '',
					name: yellow(author.name),
					comments: green(
						t('{length} comments', {
							length: String(mr.notes.length)
						})
					),
					time: blue(_time)
				}
			),
			value: iid,
			// disabled,
			checked: false
		})
	}
	const { iids, accept } = await inquirer.prompt(prompt)
	// no records
	if (iids.length === 0) {
		echo(yellow(t('No merge request record selected, process has exited')))
		process.exit(0)
	}

	// start
	for (const iid of iids) {
		const { merge_status, source_branch, target_branch } = mrList.find(
			(item: any) => item.iid === iid
		)
		const CAN_BE_MERGED = merge_status === 'can_be_merged'
		if (accept === t('Passed')) {
			if (!CAN_BE_MERGED) {
				echo(
					yellow(
						t("Requests that can't be merged can't be clicked for review and approval")
					)
				)
				process.exit(0)
			}
			await acceptMergeRequest({ iid })
			!opt.quiet &&
				sendGroupMessage(
					t('{app} item {source} merged to {target} request ID {id} has been merged', {
						app: appName,
						source: source_branch,
						target: target_branch,
						id: iid
					})
				)
			echo(green(t('Merge request {id}: Merged', { id: iid })))
		} else if (accept === t('View Details')) {
			const { changes, changes_count } = await getMergeRequestChanges({
				iid
			})
			echo(
				green(
					'\n' +
						t('{id}: total {total} files changed', {
							id: iid,
							total: changes_count
						})
				)
			)
			for (const { old_path, new_path, diff } of changes) {
				echo(
					magenta(
						'\n----------------------------------------------------------------------------------'
					)
				)
				echo(magenta(old_path))
				old_path !== new_path && echo(magenta(new_path + `(${t('New path')})`))
				echo(
					diff
						.replace(/(@@.+)\n/g, (m: string, p1: string) => cyan(p1) + '\n')
						.replace(/\n(-.+)/g, (m: string, p1: string) => '\n' + red(p1))
						.replace(/\n(\+.+)/g, (m: string, p1: string) => '\n' + green(p1))
				)
			}
		} else if (accept === t('Failed and deleted')) {
			await deleteMergeRequest({ iid })
			!opt.quiet &&
				sendGroupMessage(
					t('{app} item {source} merged to {target} request ID {id} has been deleted', {
						app: appName,
						source: source_branch,
						target: target_branch,
						id: iid
					})
				)
			echo(green(t('Merge request {id}: Deleted', { id: iid })))
		} else if (accept === t('Not passed')) {
			// delete
			await updateMergeRequest({
				iid,
				data: { state_event: 'close' }
			})
			!opt.quiet &&
				sendGroupMessage(
					t('{app} item {source} merged to {target} request ID {id} has been closed', {
						app: appName,
						source: source_branch,
						target: target_branch,
						id: iid
					})
				)
			echo(green(t('Merge request {id}: Closed', { id: iid })))
		}
	}
})

program.parse(process.argv)
export {}

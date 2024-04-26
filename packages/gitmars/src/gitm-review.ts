#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import { checkbox, input, select } from '@inquirer/prompts'
import columnify from 'columnify'
import chalk from 'chalk'
import { getGitConfig, getIsGitProject } from '@gitmars/git'
import { sendGroupMessage } from '@gitmars/core'
import { createArgs, echo } from '@gitmars/utils'
import {
	createMergeRequestNotes,
	deleteMergeRequest,
	getMergeRequestChanges,
	getMergeRequestList,
	getMergeRequestNotesList,
	updateMergeRequest
} from '@gitmars/api'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import reviewConfig from './conf/review'

const { t } = lang
const { blue, cyan, green, magenta, red, yellow } = chalk
const { args, options } = reviewConfig

if (!getIsGitProject()) {
	echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}

const { appName } = getGitConfig()

interface GitmBuildOption {
	state: 'all' | 'opened' | 'closed' | 'merged'
	quiet: boolean
}

/**
 * gitm review
 */
program
	.name('gitm review')
	.usage('[--state [state]] [--quiet]')
	.description(t('review remote code'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('--state [state]', t('Filter merge request status, there are 2 types: opened, closed, not passed then default all'), null)
// .option('--quiet', t('Do not push the message'), false)
program.action(async (opt: GitmBuildOption): Promise<void> => {
	const mrList = await getMergeRequestList({ state: opt.state })
	// 没有任何记录
	if (mrList.length === 0) {
		echo(yellow(t('No merge request record found, process has exited')))
		process.exit(0)
	}
	const iids = await checkbox<number>({
		message: t('Please select the merge request to be operated'),
		choices: mrList.map((mr: any) => {
			const { iid, author, source_branch, target_branch, merge_status, created_at } = mr
			const disabled = merge_status !== 'can_be_merged'
			const _time = dayjs(created_at).format('YYYY/MM/DD HH:mm')
			return {
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
			}
		})
	})
	// no records
	if (iids.length === 0) {
		echo(yellow(t('No merge request record selected, process has exited')))
		process.exit(0)
	}

	const accept = await select({
		message: t('Please select the action below.'),
		choices: [
			{ name: t('View Details'), value: 1, description: 'Show diff' },
			{ name: t('Comments'), value: 2 },
			{ name: t('Close'), value: 3 },
			{ name: t('Deleted'), value: 4 },
			{ name: t('Exit'), value: 5 }
		]
	})

	// 开始执行操作
	for (const iid of iids) {
		const { source_branch, target_branch } = mrList.find((item: any) => item.iid === iid)
		if (accept === 1) {
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
			// 日志
			const notes = (
				(await getMergeRequestNotesList({
					iid
				})) || []
			)
				.filter((note: any) => !note.system)
				.map((note: any) => ({
					body: green(note.body),
					name: yellow(note.author.name),
					date: blue(dayjs(note.updated_at).format('YYYY/MM/DD HH:mm:ss'))
				}))
			echo(
				magenta(
					'\n++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
				)
			)
			echo(magenta(t('Comment List')))
			echo(
				columnify(notes, {
					columns: ['body', 'name', 'date']
				})
			)
		} else if (accept === 4) {
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
		} else if (accept === 3) {
			// 删除
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
		} else if (accept === 2) {
			// 评论
			const note = await input({
				message: t('Enter the comment content'),
				default: '',
				transformer: (val: string) => val.trim(),
				validate: (val: string) => (!val ? t('Enter the available comments') : true)
			})
			!opt.quiet &&
				sendGroupMessage(
					t(
						'{app} item {source} merged to {target} request ID {id} has new comments: {note}',
						{
							app: appName,
							source: source_branch,
							target: target_branch,
							id: iid,
							note
						}
					)
				)
			await createMergeRequestNotes({ iid, body: note })
			echo(green(t('Submitted')))
		}
	}
})

program.parse(process.argv)
export {}

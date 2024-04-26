#!/usr/bin/env ts-node
import { program } from 'commander'
import dayjs from 'dayjs'
import { checkbox, select } from '@inquirer/prompts'
import chalk from 'chalk'
import to from 'await-to-done'
import {
	acceptMergeRequest,
	deleteMergeRequest,
	getMergeRequestChanges,
	getMergeRequestList,
	getMergeRequestNotesList,
	getUserInfo,
	updateMergeRequest
} from '@gitmars/api'
import { getConfig, getGitConfig, getIsGitProject } from '@gitmars/git'
import { sendGroupMessage } from '@gitmars/core'
import { createArgs, echo } from '@gitmars/utils'
import type { FetchDataType, GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import approveConfig from './conf/approve'

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
	const [, iids = []] = await to(
		checkbox<number>({
			message: t('Please select the merge request to be operated'),
			choices: mrList.map(async (mr: any) => {
				const { iid, author, source_branch, target_branch, merge_status, created_at } = mr
				mr.notes = (
					(await getMergeRequestNotesList({
						iid
					})) || []
				).filter((note: any) => !note.system)
				const disabled = merge_status !== 'can_be_merged'
				const _time = dayjs(created_at).format('YYYY/MM/DD HH:mm')
				return {
					name: t(
						'{id} request merge {source} to {target} {disabled} | {name} | {comments} | {time}',
						{
							id: green(iid + ': '),
							source: green(source_branch),
							target: green(target_branch),
							disabled: disabled
								? red(`[ ${t('Conflict or no need to merge')} ]`)
								: '',
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
	)
	// no records
	if (iids.length === 0) {
		echo(yellow(t('No merge request record selected, process has exited')))
		process.exit(0)
	}

	const [, accept] = await to(
		select({
			message: t('Please select the action below.'),
			choices: [
				{ name: t('View Details'), value: 1, description: 'Show diff' },
				{ name: t('Passed'), value: 2 },
				{ name: t('Not passed'), value: 3 },
				{ name: t('Failed and deleted'), value: 4 },
				{ name: t('Exit'), value: 5 }
			]
		})
	)

	// start
	for (const iid of iids) {
		const { merge_status, source_branch, target_branch } = mrList.find(
			(item: any) => item.iid === iid
		)
		const CAN_BE_MERGED = merge_status === 'can_be_merged'
		if (accept === 2) {
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
		} else if (accept === 1) {
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

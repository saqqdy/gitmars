#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { Separator, select } from '@inquirer/prompts'
import { getProperty } from 'js-cool'
import { getCurrentBranch } from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import * as commands from './go/index'
import goConfig from './conf/go'

const { t } = lang
const { green, red } = chalk
const { args, options } = goConfig

/**
 * gitm go
 */
program
	.name('gitm go')
	.usage('[command]')
	.description(t('Intelligent guessing of the action you want to perform'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
program.action(async (command: string): Promise<void> => {
	const current = getCurrentBranch()
	sh.echo(
		green(
			t('Current branch is {current}, I suspect you may want to do the following: ', {
				current
			})
		)
	)
	if (command) {
		// 执行对应指令
		const cmd = getProperty(commands, command)
		if (!cmd) {
			sh.echo(
				red(
					t('The command you entered was not found and may not be supported at this time')
				)
			)
			process.exit(1)
		}
		cmd()
	} else {
		// 选择指令
		const command = await select<string>({
			message: t('Please select the operation you want?'),
			default: 'combine',
			choices: [
				new Separator(' === 1. ' + t('Gitmars Workflow') + ' === '),
				{ name: 'combine', value: 'combine' },
				{ name: 'end', value: 'end' },
				{ name: 'update', value: 'update' },
				{ name: 'build', value: 'build' },
				{ name: 'start', value: 'start' },
				{ name: 'undo', value: 'undo' },
				{ name: 'redo', value: 'redo' },
				{ name: 'admin.publish', value: 'admin.publish' },
				{ name: 'admin.update', value: 'admin.update' },
				{ name: 'admin.create', value: 'admin.create' },
				{ name: 'admin.clean', value: 'admin.clean' },
				new Separator(' === 2. ' + t('Advanced Tools') + ' === '),
				{ name: 'branch', value: 'branch' },
				{ name: 'copy', value: 'copy' },
				{ name: 'get', value: 'get' },
				{ name: 'save', value: 'save' },
				{ name: 'cleanbranch', value: 'cleanbranch' },
				{ name: 'clean', value: 'clean' },
				{ name: 'revert', value: 'revert' },
				{ name: 'link', value: 'link' },
				{ name: 'unlink', value: 'unlink' },
				{ name: 'postmsg', value: 'postmsg' },
				new Separator(' === ' + t('Exit') + ' === '),
				{ name: 'exit', value: 'exit' },
				new Separator()
			]
		})
		if (command === 'exit') {
			sh.echo(green(t('exited')))
			process.exit(0)
		}
		sh.echo(
			green(
				t('You have selected the {something} command', {
					something: command
				})
			)
		)
		// 执行对应指令
		getProperty(commands, command)()
	}
})
program.parse(process.argv)
export {}

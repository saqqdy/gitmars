#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import inquirer from 'inquirer'
import getProperty from 'js-cool/es/getProperty'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import { createArgs } from '@gitmars/core/lib/utils/command'
import type { GitmarsOptionOptionsType } from '../typings'
import lang from '#lib/common/local'
import * as commands from '#lib/go/index'
import goConfig from '#lib/conf/go'

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
		inquirer
			.prompt({
				type: 'list',
				name: 'command',
				message: t('Please select the operation you want?'),
				default: 'combine',
				choices: [
					new inquirer.Separator(' === 1. ' + t('Gitmars Workflow') + ' === '),
					'combine',
					'end',
					'update',
					'build',
					'start',
					'undo',
					'redo',
					'admin.publish',
					'admin.update',
					'admin.create',
					'admin.clean',
					new inquirer.Separator(' === 2. ' + t('Advanced Tools') + ' === '),
					'branch',
					'copy',
					'get',
					'save',
					'cleanbranch',
					'clean',
					'revert',
					'link',
					'unlink',
					'postmsg',
					new inquirer.Separator(' === ' + t('Exit') + ' === '),
					'exit',
					new inquirer.Separator()
				],
				filter: (val: string): string => {
					return val
				}
			})
			.then((answers: any) => {
				if (answers.command === 'exit') {
					sh.echo(green(t('exited')))
					process.exit(0)
				}
				sh.echo(
					green(
						t('You have selected the {something} command', {
							something: answers.command
						})
					)
				)
				// 执行对应指令
				getProperty(commands, answers.command)()
			})
	}
})
program.parse(process.argv)
export {}

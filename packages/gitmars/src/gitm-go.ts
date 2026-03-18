import type { GitmarsOptionOptionsType } from './types'
import { getCurrentBranch } from '@gitmars/git'
import { createArgs } from '@gitmars/utils'
import { select, Separator } from '@inquirer/prompts'
import to from 'await-to-done'
import chalk from 'chalk'
import { program } from 'commander'
import { getProperty } from 'js-cool'
import sh from 'shelljs'
import lang from './common/local'
import goConfig from './conf/go'
import * as commands from './go/index'

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
				current,
			}),
		),
	)
	if (command) {
		// Execute the corresponding command
		const cmd = getProperty(commands, command)

		if (!cmd) {
			sh.echo(
				red(
					t('The command you entered was not found and may not be supported at this time'),
				),
			)
			process.exit(1)
		}
		cmd()
	} else {
		// Select command
		const [, command = ''] = await to(
			select<string>({
				message: t('Select the operation you want?'),
				default: 'combine',
				choices: [
					new Separator(` === 1. ${t('Gitmars Workflow')} === `),
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
					new Separator(` === 2. ${t('Advanced Tools')} === `),
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
					new Separator(` === ${t('Exit')} === `),
					{ name: 'exit', value: 'exit' },
					new Separator(),
				],
			}),
		)

		if (command === 'exit') {
			sh.echo(green(t('exited')))
			process.exit(0)
		}
		sh.echo(
			green(
				t('You have selected the {something} command', {
					something: command,
				}),
			),
		)
		// Execute the corresponding command
		getProperty(commands, command)()
	}
})
program.parse(process.argv)
export {}

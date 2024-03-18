#!/usr/bin/env ts-node
import { program } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import { spawnSync } from '@gitmars/core'
import { createArgs } from '@gitmars/utils'
import type { GitmarsOptionOptionsType, PackageVersionTag } from './types'
import lang from './common/local'
import upgradeConfig from './conf/upgrade'

const { t } = lang
const { green, red } = chalk
const { args, options } = upgradeConfig

interface GitmBuildOption {
	mirror?: boolean
	client?: 'npm' | 'yarn' | 'pnpm' | 'cnpm' | string
	registry?: string
}

/**
 * gitm upgrade
 */
program
	.name('gitm upgrade')
	.usage('[version] [-m --mirror] [-c --client [client]] [-r --registry <registry>]')
	.description(t('Upgrade gitmars'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-m, --mirror', t('Whether to use Taobao Mirror'), false)
// .option('-c, --client [client]', t('The name of the client used to load the package'), 'npm')
// .option('-r, --registry <registry]>', t('Use mirror address'), '')
program.action(async (version: PackageVersionTag | string, opt: GitmBuildOption) => {
	const spinner = ora()
	if (version) {
		const match = version.match(/[0-9.]+$/)
		if (match) version = match[0]
		else if (!['alpha', 'lite', 'beta', 'release', 'latest', 'next'].includes(version)) {
			console.error(
				t(
					'Incorrect version number entered, only supported: alpha, lite, beta, release, latest, next'
				)
			)
			process.exit(0)
		}
	} else {
		version = 'latest'
	}
	let cmdAdd: any[], cmdDel: any[]
	switch (opt.client) {
		case 'yarn':
			cmdAdd = [opt.client, ['global', 'add', `gitmars@${version}`]]
			cmdDel = [opt.client, ['global', 'remove', 'gitmars']]
			break
		case 'pnpm':
			cmdAdd = [opt.client, ['add', '-g', `gitmars@${version}`]]
			cmdDel = [opt.client, ['remove', '-g', 'gitmars']]
			break
		default:
			// default npm or cnpm
			cmdAdd = [opt.client, ['install', '-g', `gitmars@${version}`]]
			cmdDel = [opt.client, ['uninstall', '-g', 'gitmars']]
			break
	}
	// 这一行后面准备删掉
	if (!opt.registry && opt.mirror) {
		opt.registry = 'https://registry.npmmirror.com'
	}
	if (opt.registry) {
		cmdAdd[1] = cmdAdd[1].concat(['--registry', opt.registry])
	}
	spinner.start(green(t('Uninstalling')))
	const uninstall = spawnSync(cmdDel[0], cmdDel[1], {
		stdio: 'ignore',
		shell: process.platform === 'win32' /*, env: { detached: true } */
	})
	if (uninstall.status !== 0) {
		spinner.fail(
			red(
				t(
					'There was an error uninstalling, please try running after manually removing: npm install -g gitmars'
				)
			)
		)
		process.exit(0)
	}
	spinner.succeed(green(t('Uninstallation complete')))
	spinner.start(green(t('Installing')))
	const install = spawnSync(cmdAdd[0], cmdAdd[1], {
		stdio: 'ignore',
		shell: process.platform === 'win32' /*, env: { detached: true } */
	})
	if (install.status === 0) {
		spinner.succeed(green(t('Installation complete')))
		spawnSync('gitm', ['-v'], {
			stdio: 'inherit',
			shell: process.platform === 'win32' /*, env: { detached: true } */
		})
	} else {
		spinner.fail(
			red(t('There was an error installing, please try running: npm install -g gitmars'))
		)
	}
	spinner.stop()
	process.exit(0)
})
program.parse(process.argv)
export {}

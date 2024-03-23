#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import chalk from 'chalk'
import { getCurrentBranch } from '@gitmars/git'
import { spawnSync } from '@gitmars/utils'
import { getConfig } from '@gitmars/core'
import lang from './common/local'

const { t } = lang
const { red } = chalk
const config = getConfig()

interface GitmBuildOption {
	noVerify?: boolean
	dev?: boolean
	release?: boolean
}

/**
 * gitm permission
 */
program
	.name('gitm permission')
	.usage('[message] [--no-verify] [--dev] [--release]')
	.arguments('[message]')
	.description(t('Verify commit permissions'))
	.option('--no-verify', t('Do you want to skip the check permission'), false)
	.option('--dev', t('Whether to restrict dev commits'), false)
	.option('--release', t('Whether to restrict release commits'), false)
	.action((message: string, opt: GitmBuildOption) => {
		console.info('gitm permission is running')
		const current = getCurrentBranch()
		const allow = [config.master]
		const { stdout } = spawnSync('git', ['show'])
		if (opt.dev) allow.push(config.develop)
		if (opt.release) allow.push(config.release)
		const index = allow.indexOf(current)
		if (
			index > -1 &&
			!opt.noVerify &&
			stdout &&
			!stdout.includes('Merge:') &&
			!stdout.includes('Merge branch')
		) {
			sh.echo(
				red(
					t('The {target} branch does not allow direct commits', {
						target: allow[index]
					})
				)
			)
			process.exit(1)
		} else {
			process.exit(0)
		}
		// sh.echo(process.env.HUSKY_GIT_PARAMS)
		// sh.echo(process.env.FORCE_COMMIT)
	})
program.parse(process.argv)
export {}

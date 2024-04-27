#!/usr/bin/env ts-node
import fs from 'fs'
import { program } from 'commander'
import chalk from 'chalk'
import sh from 'shelljs'
import to from 'await-to-done'
import { editor, input } from '@inquirer/prompts'
import { getGitRevParse, getIsGitProject } from '@gitmars/git'
import lang from './common/local'
import { defaults } from './common/global'

const { t } = lang
const { green, red } = chalk

if (!getIsGitProject()) {
	sh.echo(red(t('The current directory is not a git project directory')))
	process.exit(1)
}
const { root } = getGitRevParse()

/**
 * gitm init
 * 初始化gitmars配置
 */
program
	.name('gitm init')
	.usage('')
	.description(t('Set configuration items for gitmars'))
	.action(async () => {
		let key: keyof typeof defaults
		for (key in defaults) {
			let data = defaults[key]
			if (['master', 'develop', 'release', 'bugfix', 'support'].includes(key)) {
				;[, data = defaults[key]] = await to(
					input({
						message: t('Enter {branch} branch name', {
							branch: key
						}),
						default: defaults[key],
						transformer: val => val.trim(),
						validate: val => (/^\w+$/.test(val) ? true : t('Enter the available names'))
					})
				)
			} else if (key === 'user') {
				;[, data = key] = await to(
					input({
						message: t('Enter the Git username'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\w+$/.test(val) ? true : t('Enter the available names')
					})
				)
			} else if (key === 'email') {
				;[, data = key] = await to(
					input({
						message: t('Enter the Git email address'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)
								? true
								: t('Enter the correct email')
					})
				)
			} else if (key === 'nameValidator') {
				;[, data = key] = await to(
					input({
						message: t('Enter the branch name naming convention'),
						transformer: val => val.trim()
					})
				)
			} else if (key === 'descriptionValidator') {
				;[, data = key] = await to(
					input({
						message: t('Enter commit message rules'),
						transformer: val => val.trim()
					})
				)
			} else if (key === 'msgTemplate') {
				;[, data = defaults[key]] = await to(
					input({
						message: t('Enter the message template'),
						default: defaults[key],
						transformer: val => val.trim()
					})
				)
			} else if (key === 'apolloConfig') {
				;[, data = defaults[key] as string] = await to(
					editor({
						message: t('Enter apollo configuration'),
						default: `{
    "configServerUrl": "",
    "appId": "",
    "clusterName": "",
    "namespaceName": [],
    "apolloEnv": "",
    "token": ""
}`,
						validate: val => {
							try {
								val = JSON.parse(val)
								return true
							} catch (e) {
								return t('Enter json')
							}
						}
					})
				)
			} else if (key === 'hooks') {
				;[, data = defaults[key] as string] = await to(
					editor({
						message: t('Enter hooks configuration'),
						default: `{
    "pre-commit": "",
    "pre-push": ""
}`,
						validate: val => {
							try {
								val = JSON.parse(val)
								return !!val
							} catch (e) {
								return t('Enter json')
							}
						}
					})
				)
			} else if (key === 'api') {
				;[, data = defaults[key]] = await to(
					input({
						message: t('Enter the query user permission interface'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : t('Enter the URL')
					})
				)
			} else if (key === 'gitHost') {
				;[, data = defaults[key]] = await to(
					input({
						message: t('Enter the git URL'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : t('Enter the URL')
					})
				)
			} else if (key === 'gitID') {
				;[, data = defaults[key]] = await to(
					input({
						message: t('Enter the git project ID, currently only gitlab is supported'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\d+$/.test(val) ? true : t('Enter the URL')
					})
				)
			}
			defaults[key] = data
		}
		try {
			defaults.apolloConfig = JSON.parse(defaults.apolloConfig as string) as Record<
				string,
				string
			>
			if (!defaults.apolloConfig.configServerUrl || !defaults.apolloConfig.token) {
				defaults.apolloConfig = ''
			}
		} catch (e) {
			defaults.apolloConfig = ''
		}
		try {
			let valid = false
			defaults.hooks = JSON.parse(defaults.hooks as string) as Record<string, string>
			hooks: for (const k in defaults.hooks as Record<string, string>) {
				if (defaults.hooks[k]) {
					valid = true
					break hooks
				}
			}
			if (!valid) defaults.hooks = ''
		} catch (e) {
			defaults.hooks = ''
		}
		sh.echo(green(t('gitmars configured successfully')))
		fs.writeFileSync(root + '/.gitmarsrc', JSON.stringify(defaults, null, 4), 'utf-8')
		fs.chmodSync(root + '/.gitmarsrc', 0o0755)
	})
program.parse(process.argv)
export {}

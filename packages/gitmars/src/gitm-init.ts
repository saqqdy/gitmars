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
			if (
				key === 'master' ||
				key === 'develop' ||
				key === 'release' ||
				key === 'bugfix' ||
				key === 'support'
			) {
				const [, data] = await to(
					input({
						message: t('Enter {branch} branch name', {
							branch: key
						}),
						default: defaults[key],
						transformer: val => val.trim(),
						validate: val => (/^\w+$/.test(val) ? true : t('Enter the available names'))
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'user') {
				const [, data] = await to(
					input({
						message: t('Enter the Git username'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\w+$/.test(val) ? true : t('Enter the available names')
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'email') {
				const [, data] = await to(
					input({
						message: t('Enter the Git email address'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(val)
								? true
								: t('Enter the correct email')
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'nameValidator') {
				const [, data] = await to(
					input({
						message: t('Enter the branch name naming convention'),
						transformer: val => val.trim()
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'descriptionValidator') {
				const [, data] = await to(
					input({
						message: t('Enter commit message rules'),
						transformer: val => val.trim()
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'msgTemplate') {
				const [, data] = await to(
					input({
						message: t('Enter the message template'),
						default: defaults[key],
						transformer: val => val.trim()
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'apolloConfig') {
				const [, data] = await to(
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
							} catch {
								return t('Enter json')
							}
						}
					})
				)
				defaults[key] = data ? JSON.parse(data) : defaults[key]
			} else if (key === 'hooks') {
				const [, data] = await to(
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
							} catch {
								return t('Enter json')
							}
						}
					})
				)
				defaults[key] = data ? JSON.parse(data) : defaults[key]
			} else if (key === 'apis') {
				const [, data] = await to(
					editor({
						message: t('Enter hooks configuration'),
						default: `{
	"buildConfig": {
		"url": "",
		"method": "get",
		"params": {
			"name": ""
		}
	},
	"userInfo": {
		"url": "",
		"method": "get"
	}
}`,
						validate: val => {
							try {
								val = JSON.parse(val)
								return !!val
							} catch {
								return t('Enter json')
							}
						}
					})
				)
				defaults[key] = data ? JSON.parse(data) : defaults[key]
			} else if (key === 'api') {
				const [, data] = await to(
					input({
						message: t('Enter the query user permission interface'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : t('Enter the URL')
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'gitHost') {
				const [, data] = await to(
					input({
						message: t('Enter the git URL'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^https?:\/\/[\S]*$/.test(val) ? true : t('Enter the URL')
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			} else if (key === 'gitID') {
				const [, data] = await to(
					input({
						message: t('Enter the git project ID, currently only gitlab is supported'),
						transformer: val => val.trim(),
						validate: val =>
							val === '' || /^\d+$/.test(val) ? true : t('Enter the URL')
					}).then(val => val.trim())
				)
				defaults[key] = data || defaults[key]
			}
		}
		if (
			defaults.apolloConfig &&
			(!defaults.apolloConfig.configServerUrl || !defaults.apolloConfig.token)
		) {
			defaults.apolloConfig = null
		}
		if (defaults.hooks && Object.keys(defaults.hooks).some(k => !defaults.hooks?.[k]))
			defaults.hooks = null
		sh.echo(green(t('gitmars configured successfully')))
		fs.writeFileSync(root + '/.gitmarsrc', JSON.stringify(defaults, null, 4), 'utf-8')
		fs.chmodSync(root + '/.gitmarsrc', 0o0755)
	})
program.parse(process.argv)
export {}

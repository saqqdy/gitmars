#!/usr/bin/env ts-node
import { program } from 'commander'
import sh from 'shelljs'
import { Separator, confirm, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import dayjs from 'dayjs'
import to from 'await-to-done'
import { base64ToArrayBuffer } from 'js-cool'
import { createArgs, printQrcode, readQrcode } from '@gitmars/utils'
import {
	bindTester,
	getAuditStatus,
	getAuthorizerListWithAllDetail,
	getClientsConfig,
	getPreAuthQrCode,
	getTrialQrCode,
	unbindTester,
	undoAudit
} from '@gitmars/api'
import type { GitmarsOptionOptionsType } from './types'
import lang from './common/local'
import miniprogramConfig from './conf/miniprogram'

const { t } = lang
const { args, options } = miniprogramConfig

interface GitmMiniprogramOption {
	keyword?: string
}
/**
 * gitm miniprogram
 */
program
	.name('gitm miniprogram')
	.usage('[miniprogram] [-k --keyword [keyword]]')
	.description(t('miniprogram command'))
if (args.length > 0) program.arguments(createArgs(args))
options.forEach((o: GitmarsOptionOptionsType) => {
	program.option(o.flags, o.description, o.defaultValue)
})
// .option('-k, --keyword [keyword]', t('Name of miniprogram, used for fuzzy searches'), '')
program.action(async (miniprogram: string, opt: GitmMiniprogramOption): Promise<void> => {
	if (miniprogram === 'auth') {
		// get auth qrcode
		const authUrl = await getPreAuthQrCode()
		await printQrcode(authUrl)
		process.exit(0)
	} else if (!miniprogram) {
		const [, list = []] = await to(
			getAuthorizerListWithAllDetail({ limit: 500 }).then(({ list }) => {
				if (!opt.keyword) return list
				return list.filter(item => item.authorizer_info.nick_name.includes(opt.keyword!))
			})
		)
		;[, miniprogram = ''] = await to(
			select<string>({
				message: t('Select the application to build'),
				choices: list.map(({ authorizer_info: info, authorizer_appid }) => ({
					name: info.nick_name,
					value: authorizer_appid
				}))
			})
		)
	}

	if (!miniprogram) process.exit(0)

	const [, action = ''] = await to(
		select<string>({
			message: t('Please select the operation you want?'),
			choices: [
				new Separator(' === 1. ' + t('Audit') + ' === '),
				{
					name: t('Audit Status'),
					value: 'audit_status'
				},
				{
					name: t('Undo Audit'),
					value: 'undo_audit'
				},
				{
					name: t('Submit Audit'),
					value: 'submit_audit',
					disabled: true
				},
				new Separator(' === 2. ' + t('Common') + ' === '),
				{
					name: t('Trial Qrcode'),
					value: 'trial_qrcode'
				},
				{
					name: t('Bind Tester'),
					value: 'bind_tester'
				},
				{
					name: t('Unbind Tester'),
					value: 'unbind_tester'
				},
				new Separator(' === ' + t('Exit') + ' === '),
				{ name: 'exit', value: 'exit' },
				new Separator()
			]
		})
	)

	if (action === 'audit_status') {
		const [, data] = await to(getAuditStatus(miniprogram))
		if (data) {
			const colorList = ['bgGreen', 'bgRed', 'bgBlack', 'bgBlack', 'bgYellow'] as const
			const tag = [
				t('Audit Successful'),
				t('Audit Rejected'),
				t('Audit in Progress'),
				t('Withdrawn'),
				t('Audit Delayed')
			][data.status]
			let txt = chalk[colorList[data.status]](tag)
			if ([1, 4].includes(data.status) && data.reason) txt += ': ' + data.reason
			if (data.time) txt += '\n' + dayjs(data.time).format('YYYY-MM-DD HH:mm')
			sh.echo(txt)
		}
	} else if (action === 'undo_audit') {
		const [, answer] = await to(
			confirm({
				message: t('Confirm undo audit'),
				default: false
			})
		)
		if (answer) {
			await undoAudit(miniprogram)
			sh.echo(chalk.green(t('Implementation success')))
		}
	} else if (action === 'submit_audit') {
		//
	} else if (action === 'trial_qrcode') {
		const [, path = ''] = await to(
			getClientsConfig(miniprogram).then(({ config }) => JSON.parse(config).path)
		)
		const [, codeImage = ''] = await to(getTrialQrCode({ path, authorizer_appid: miniprogram }))
		printQrcode(await readQrcode(base64ToArrayBuffer(codeImage)))
	} else if (action === 'bind_tester') {
		const [, wechatid = ''] = await to(
			input({
				message: t('Enter wechat account'),
				transformer: val => val.trim()
			}).then(val => val.trim())
		)
		if (wechatid) {
			await bindTester({ wechatid, authorizer_appid: miniprogram })
			sh.echo(chalk.green(t('Implementation success')))
		}
	} else if (action === 'unbind_tester') {
		const [, userstr = ''] = await to(
			input({
				message: t('Enter wechat userstr'),
				transformer: val => val.trim()
			}).then(val => val.trim())
		)
		if (userstr) {
			await unbindTester({ userstr, authorizer_appid: miniprogram })
			sh.echo(chalk.green(t('Implementation success')))
		}
	}
})
program.parse(process.argv)
export {}

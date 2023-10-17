import fs from 'fs'
import path from 'path'
import sh from 'shelljs'
import chalk from 'chalk'
import ciInfo from 'ci-info'
import { compareVersion } from 'js-cool'
import getConfig from '#lib/getConfig'
import getGitVersion from '#lib/git/getGitVersion'
import getGitRevParse from '#lib/git/getGitRevParse'
import getHookComment from '#lib/hook/getHookComment'
import getHookType from '#lib/hook/getHookType'
import getHookShell from '#lib/hook/getHookShell'
import getLocalShell from '#lib/hook/getLocalShell'
import lang from '#lib/lang'

const { t } = lang
const hookList = [
	'applypatch-msg',
	'pre-applypatch',
	'post-applypatch',
	'pre-commit',
	'pre-merge-commit',
	'prepare-commit-msg',
	'commit-msg',
	'post-commit',
	'pre-rebase',
	'post-checkout',
	'post-merge',
	'pre-push',
	'post-update',
	'push-to-checkout',
	'pre-auto-gc',
	'post-rewrite',
	'sendemail-validate'
]
const { gitHookDir, prefix } = getGitRevParse()
const gitVersion = getGitVersion()
const config = getConfig()

/**
 * 创建git钩子
 *
 * @param dir - 目标目录，默认gitHookDir
 */
export function createHooks(dir: string = gitHookDir): void {
	// 创建hook文件方法
	const writeHook = (filename: string, shell: string): void => {
		fs.writeFileSync(filename, shell, 'utf-8')
		fs.chmodSync(filename, 0o0755)
	}
	const hooks = hookList.map((hookName: string) => path.join(dir, hookName))
	hooks.forEach((filename: string) => {
		const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`
		const name = path.basename(filename)
		// 检查hook文件是否已存在
		if (fs.existsSync(filename)) {
			const hook = fs.readFileSync(filename, 'utf-8')
			// 合并
			if (getHookType.isGhooks(hook)) {
				console.info(t('Merge existing ghooks hooks: {{name}}', { name }))
				return writeHook(filename, hookShell)
			}
			// 合并
			if (getHookType.isPreCommit(hook)) {
				console.info(
					t('Merge existing pre-commit hooks: {{name}}', {
						name
					})
				)
				return writeHook(filename, hookShell)
			}
			// 更新
			if (
				getHookType.isGitmars(hook) ||
				getHookType.isHusky(hook) ||
				getHookType.isYorkie(hook)
			) {
				return writeHook(filename, hookShell)
			}
			// 跳过
			console.info(
				t('Skip existing git hooks: {{name}}', {
					name
				})
			)
			return
		}
		// 如果不存在钩子，创建
		writeHook(filename, hookShell)
	})
}

/**
 * 创建git钩子
 *
 * @param dir - 目标目录，默认gitHookDir
 * @returns result - boolean|void
 */
export function removeHooks(dir: string = gitHookDir): boolean | void {
	const hooks = hookList.map((hookName: string) => path.join(dir, hookName))
	hooks
		.filter((filename: string) => {
			if (fs.existsSync(filename)) {
				const hook = fs.readFileSync(filename, 'utf-8')
				return getHookType.isGitmars(hook)
			}
			return false
		})
		.forEach((filename: string) => {
			fs.unlinkSync(filename)
		})
}

/**
 * 创建主程序
 *
 * @param dir - 目标目录，默认gitHookDir
 */
export function createHookShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.sh')
	fs.writeFileSync(filename, getHookShell(), 'utf-8')
	fs.chmodSync(filename, 0o0755)
}

/**
 * 移除主程序
 *
 * @param dir - 目标目录，默认gitHookDir
 */
export function removeHookShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.sh')
	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * 创建本地脚本
 *
 * @param dir - 目标目录，默认gitHookDir
 * @param pmName - 包管理工具名称
 * @param relativeUserPkgDir - 用户包相对路径
 */
export function createLocalShell(
	dir: string = gitHookDir,
	pmName: string,
	relativeUserPkgDir: string
): void {
	const filename = path.join(dir, 'gitmars.local.sh')
	fs.writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), 'utf-8')
	fs.chmodSync(filename, 0o0755)
}

/**
 * 移除本地脚本
 *
 * @param dir - 目标目录，默认gitHookDir
 */
export function removeLocalShell(dir: string = gitHookDir): void {
	const filename = path.join(dir, 'gitmars.local.sh')
	if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * 初始化钩子
 */
export function init(): void {
	const gitVersionIsNew = gitVersion && compareVersion(gitVersion, '2.13.0') > -1
	// 集成环境不安装
	if (ciInfo.isCI && config.skipCI) {
		console.info(t('Continuous integration environment, skip hook installation'))
		return
	}
	// 如果没有hooks文件夹，创建
	if (!fs.existsSync(gitHookDir)) {
		fs.mkdirSync(gitHookDir)
	}
	if (['1', 'true'].includes(process.env.GITMARS_SKIP_HOOKS || '')) {
		sh.echo(
			chalk.yellow(
				t('Environment variable GITMARS_SKIP_HOOKS already exists, skip installation')
			)
		)
		process.exit(0)
	}
	// git版本过旧
	if (!gitVersionIsNew) {
		sh.echo(
			chalk.yellow(
				t('Gitmars requires Git version 2.13.0 or higher, current version') +
					': ' +
					gitVersion
			)
		)
		process.exit(0)
	}
	createHooks(gitHookDir)
	createHookShell(gitHookDir)
	createLocalShell(gitHookDir, 'yarn', prefix)
	console.info('gitmars hooks init down')
}

/**
 * 移除钩子
 */
export function remove(): void {
	removeHooks()
	removeHookShell()
	removeLocalShell()
	console.info('gitmars hooks removed')
}

export default {
	init,
	remove,
	createHooks,
	removeHooks,
	createHookShell,
	removeHookShell,
	createLocalShell,
	removeLocalShell
}

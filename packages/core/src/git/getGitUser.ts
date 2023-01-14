import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'

/**
 * 获取git用户名称
 *
 * @returns user - Return string
 */
export function getGitUser(): string {
	const { stdout } = spawnSync('git', ['config', 'user.name'])
	debug('git.user', stdout)
	return stdout!
}

/**
 * 获取git用户邮箱
 *
 * @returns email - Return string
 */
export function getGitEmail(): string {
	const { stdout } = spawnSync('git', ['config', 'user.email'])
	debug('git.email', stdout)
	return stdout!
}

export default {
	getGitUser,
	getGitEmail
}

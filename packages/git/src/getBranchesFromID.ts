import { debug, spawnSync } from '@gitmars/utils'

/**
 * 获取包含commitID的分支
 *
 * @param commitID - commitID
 * @param remote - 是否检测远程
 * @returns branches - 返回分支列表
 */
function getBranchesFromID(commitID: string, remote = false): string[] {
	const { stdout } = spawnSync('git', [
		'branch',
		remote ? '-r' : '',
		'--contains',
		commitID,
		'--format',
		'%(refname:short)'
	])
	debug('getBranchesFromID', stdout)
	return stdout ? stdout.split('\n') : []
}

export default getBranchesFromID

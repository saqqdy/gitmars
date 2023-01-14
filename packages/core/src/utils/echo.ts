import { format } from 'util'

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns {Object} arr Return the configuration object
 */
function echo(message: string): void {
	let output = format(message)
	output += '\n'
	process.stdout.write(output)
}

export default echo

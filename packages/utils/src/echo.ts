import { format } from 'node:util'

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns message - arr Return the configuration object
 */
function echo(message: string): void {
	let output = format(message)
	output += '\n'
	process.stdout.write(output)
}

export default echo

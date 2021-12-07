const { format } = require('util')

/**
 * 读取gitmars在线版本列表
 *
 * @param name - 需要查询的内容
 * @returns {Object} arr 返回配置对象
 */
function echo(message: string[]): void {
    let output = format(message)
    output += '\n'
    process.stdout.write(output)
}

module.exports = echo
export {}

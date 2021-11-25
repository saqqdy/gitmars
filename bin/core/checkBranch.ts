const { queue } = require('./queue')

/**
 * 获取是否有某个分支
 *
 * @param name - 分支名称
 * @returns branch - 返回分支
 */
async function checkBranch(name: string): Promise<string> {
    const data = await queue([`gitm branch -k ${name}`])
    return data[0].out.replace(/^\s+/, '')
}
// function checkBranch(name) {
// 	return queue([`gitm branch -k ${name}`]).then(data => {
// 		return resolve(data[0].out.replace(/^\s+/, ''))
// 	})
// }

module.exports = checkBranch
export {}

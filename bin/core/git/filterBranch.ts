const { spawnSync } = require('../spawn')

/**
 * 搜索分支
 *
 * @param key - 名称
 * @param types - 类型
 * @param remote - 是否远程
 * @returns branches - 返回分支列表
 */
function filterBranch(key: string, types: string, remote = false): string[] {
    let typesList: string[] = [types],
        list: string[]
    if (typeof types === 'string') typesList = types.split(',')
    const argv: string[] = ['branch']
    if (remote) argv.push('-a')
    const program = spawnSync('git', argv)
    program.stdout = program.stdout.replace(/\*\s+/, '') // 去除*
    list = program.stdout
        ? program.stdout.replace(/\n(\s+)/g, '\n').split('\n')
        : []
    list = list.filter(el => {
        let result = true
        // 匹配关键词
        if (key && !el.includes(key)) result = false
        // 匹配类型
        if (result && typesList.length > 0) {
            result = false
            type: for (const type of typesList) {
                if (el.includes(type)) {
                    result = true
                    break type
                }
            }
        }
        return result
    })
    return list
}

module.exports = filterBranch
export {}

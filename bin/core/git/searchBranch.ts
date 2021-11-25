const { queue } = require('../utils/queue')

import type { GitmarsBranchType } from '../../../typings'

/**
 * 获取当前分支
 *
 * @param key - 名称
 * @param type - 类型
 * @param remote - 是否远程
 * @returns branches 返回分支列表
 */
async function searchBranch(
    key: string,
    type: GitmarsBranchType,
    remote = false
): Promise<string[]> {
    const data = (
        await queue([
            `gitm branch${key ? ' -k ' + key : ''}${type ? ' -t ' + type : ''}${
                remote ? ' -r' : ''
            }`
        ])
    )[0].out.replace(/^\*\s+/, '')
    let arr = data ? data.split('\n') : []
    arr = arr.map((el: string) => el.trim())
    return arr
}

module.exports = searchBranch
export {}

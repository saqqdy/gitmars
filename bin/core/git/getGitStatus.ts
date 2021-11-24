import type { GitStatusInfoType } from '../../../typings'

/**
 * 获取分支状态
 *
 * @param config - shelljs配置
 * @returns gitStatus - git状态
 */
function getGitStatus(config: any = {}): GitStatusInfoType {
    const { silent = true } = config
    const out = sh
        .exec('git status -s --no-column', { silent })
        .stdout.replace(/(^\s+|\n*$)/g, '') // 去除首尾
    const list = out ? out.replace(/\n(\s+)/g, '\n').split('\n') : []
    const sum: GitStatusInfoType = {
        A: [],
        D: [],
        M: [],
        '??': []
    }
    if (list.length === 0) return sum
    list.forEach((str: string) => {
        const arr: string[] = str.trim().replace(/\s+/g, ' ').split(' ')
        const type = arr.splice(0, 1)[0] as keyof GitStatusInfoType
        if (!sum[type]) sum[type] = []
        sum[type].push(arr.join(' '))
    })
    return sum
}

module.exports = getGitStatus
export {}

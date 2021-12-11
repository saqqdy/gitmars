const { spawnSync } = require('../spawn')
const getGitConfig = require('./getGitConfig')
const getGitRevParse = require('./getGitRevParse')
const { debug } = require('../utils/debug')

export interface SearchBranchesMapType {
    heads: string[]
    tags: string[]
    others: string[]
}

/**
 * 搜索分支
 *
 * @param opt - 筛选参数
 * @returns branches - 返回列表数组
 */
function searchBranches(opt: any = {}): string[] {
    const { key, type, remote = false, exclude, include } = opt
    let { path } = opt
    if (!path) {
        if (remote) {
            const { gitUrl } = getGitConfig()
            path = gitUrl
        } else {
            const { root } = getGitRevParse()
            path = root
        }
    }
    const { stdout } = spawnSync('git', [
        'ls-remote',
        '--heads',
        '--quiet',
        // '--sort',
        // 'version:refname',
        path
    ])
    debug(
        'searchBranches',
        { key, type, remote, exclude, include, path },
        stdout
    )
    const arr = stdout ? stdout.split('\n') : []
    const map: SearchBranchesMapType = {
        heads: [],
        tags: [],
        others: []
    }
    for (const el of arr) {
        const match = el.match(
            /^\w+[\s]+refs\/(heads|remotes|tags)\/([\w-\/]+)$/
        )
        if (!match) continue
        switch (match[1]) {
            case 'heads':
                map.heads.push(match[2])
                break
            case 'remotes':
                map.heads.push(match[2])
                break
            case 'tags':
                map.tags.push(match[2])
                break
            default:
                map.others.push(match[2])
                break
        }
    }
    // 按类型筛选
    if (type) {
        const _types = type.split(',')
        const temp: string[] = []
        map.heads.forEach(item => {
            types: for (const t of _types) {
                if (
                    ['bugfix', 'feature', 'support'].includes(t) &&
                    item.indexOf(t + '/') > -1
                ) {
                    temp.push(item)
                    break types
                }
            }
        })
        map.heads = temp
    }
    // 正则排除
    if (exclude) {
        const reg = new RegExp(exclude)
        map.heads = map.heads.filter(el => !reg.test(el))
    }
    // 正则包含
    if (include) {
        const reg = new RegExp(include)
        map.heads = map.heads.filter(el => reg.test(el))
    }
    // 按关键词筛选
    if (key) {
        map.heads = map.heads.filter(el => el.indexOf(key) > -1)
    }
    debug('searchBranches', map.heads)
    return map.heads
}

module.exports = searchBranches
export {}

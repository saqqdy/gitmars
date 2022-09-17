import { spawnSync } from '#lib/spawn'
import { debug } from '#lib/utils/debug'
import getGitConfig from '#lib/git/getGitConfig'
import getGitRevParse from '#lib/git/getGitRevParse'

export interface SearchBranchesMapType {
    heads: string[]
    tags: string[]
    others: string[]
}

/**
 * 搜索分支
 *
 * @param opt - Filtering parameters
 * @returns branches - return array
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
    // Filter by type
    if (type) {
        const _types = type.split(',')
        const temp: string[] = []
        map.heads.forEach(item => {
            types: for (const t of _types) {
                if (
                    ['bugfix', 'feature', 'support'].includes(t) &&
                    item.includes(t + '/')
                ) {
                    temp.push(item)
                    break types
                }
            }
        })
        map.heads = temp
    }
    // Regular Exclusion
    if (exclude) {
        const reg = new RegExp(exclude)
        map.heads = map.heads.filter(el => !reg.test(el))
    }
    // The regular rule contains
    if (include) {
        const reg = new RegExp(include)
        map.heads = map.heads.filter(el => reg.test(el))
    }
    // Filter by keyword
    if (key) {
        map.heads = map.heads.filter(el => el.includes(key))
    }
    debug('searchBranches', map.heads)
    return map.heads
}

export default searchBranches

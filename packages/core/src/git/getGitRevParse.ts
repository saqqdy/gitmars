import slash from 'slash'
import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'

export interface GitProjectRevParseType {
    prefix: string
    gitCommonDir: string
    root: string
    gitDir: string
    gitHookDir: string
    cdup: string
}

/**
 * 获取git路径
 *
 * @param cwd - 当前工作目录
 * @returns gitRevParse - 返回对象GitProjectRevParseType
 */
export function getGitRevParse(
    cwd: string = process.cwd()
): GitProjectRevParseType {
    const { stdout } = spawnSync(
        'git',
        [
            'rev-parse',
            '--show-toplevel',
            '--show-prefix',
            '--git-common-dir',
            '--absolute-git-dir',
            '--show-cdup'
        ],
        { cwd }
    )
    const [root, prefix, gitCommonDir, gitDir, cdup = ''] = stdout
        .split('\n')
        .map((s: string) => s.trim())
        .map(slash)
    debug('getGitRevParse', {
        prefix: prefix || '.',
        gitCommonDir,
        root,
        gitDir,
        gitHookDir: gitDir + '/hooks',
        cdup
    })
    return {
        prefix: prefix || '.',
        gitCommonDir,
        root,
        gitDir,
        gitHookDir: gitDir + '/hooks',
        cdup
    }
}

export default getGitRevParse

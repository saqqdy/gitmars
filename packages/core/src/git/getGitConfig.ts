import slash from 'slash'
import { spawnSync } from '../spawn'
import { debug } from '../utils/debug'

export interface GitProjectConfigType {
    gitUrl: string
    appName: string
}

/**
 * 获取git配置
 *
 * @param cwd - 当前工作目录
 * @returns config - GitProjectConfigType
 */
function getGitConfig(cwd: string = process.cwd()): GitProjectConfigType {
    const { stdout } = spawnSync(
        'git',
        ['config', '--local', '--get', 'remote.origin.url'],
        { cwd }
    )
    const [gitUrl] = stdout!
        .split('\n')
        .map((s: string) => s.trim())
        .map(slash)
    debug('getGitConfig', {
        gitUrl,
        appName: gitUrl
            .replace(/\.git\/?$/, '')
            .split('/')
            .reverse()[0]
    })
    return {
        gitUrl,
        appName: gitUrl
            .replace(/\.git\/?$/, '')
            .split('/')
            .reverse()[0]
    }
}

export default getGitConfig

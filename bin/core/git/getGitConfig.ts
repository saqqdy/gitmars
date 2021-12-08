const { spawnSync } = require('../spawn')
const slash = require('slash')

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
    const [gitUrl] = stdout
        .split('\n')
        .map((s: string) => s.trim())
        .map(slash)
    return {
        gitUrl,
        appName: gitUrl
            .split('/')
            .reverse()[0]
            .replace(/\.git$/, '')
    }
}

module.exports = getGitConfig
export {}

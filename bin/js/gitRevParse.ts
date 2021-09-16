const sh = require('shelljs')
const slash = require('slash')

export interface GitProjectRevParseType {
    prefix: string
    gitCommonDir: string
    root: string
    gitDir: string
    gitHookDir: string
    cdup: string
}

/**
 * gitRevParse
 * @description 获取git路径
 * @returns {Object} arr 返回对象
 */
function gitRevParse(cwd: string = process.cwd()): GitProjectRevParseType {
    const result = sh.exec('git rev-parse --show-toplevel --show-prefix --git-common-dir --absolute-git-dir --show-cdup', { silent: true }).stdout.replace(/\s+$/g, '')
    const [root, prefix, gitCommonDir, gitDir, cdup = ''] = result
        .split('\n')
        .map((s: string) => s.trim())
        .map(slash)
    return { prefix: prefix || '.', gitCommonDir, root, gitDir, gitHookDir: gitDir + '/hooks', cdup }
}

module.exports = gitRevParse

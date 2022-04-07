import type { GitLogsType } from '../../../typings'
const { spawnSync } = require('../spawn')
const { debug } = require('../utils/debug')
const GitLogsFormatter = require('./gitLogsFormatter')

/**
 * 获取日志
 *
 * @param option - 参数
 * @param option.commitIDs - commitID
 * @param option.params - 附带参数
 * @param option.keys - 需要返回的字段
 * @returns logsList - 返回列表
 */
function getGitLogsByCommitIDs({
    commitIDs,
    params,
    keys
}: any): GitLogsType[] {
    if (typeof commitIDs === 'string') commitIDs = [commitIDs]
    const formatter = new GitLogsFormatter()
    const { stdout } = spawnSync('git', [
        'show',
        ...commitIDs,
        '--name-only',
        `--pretty=format:${formatter.getFormat(keys)}`,
        ...params.split(' ')
    ])
    debug('getGitLogsByCommitIDs', stdout)
    return formatter.getLogs(stdout)
}

module.exports = getGitLogsByCommitIDs
export {}

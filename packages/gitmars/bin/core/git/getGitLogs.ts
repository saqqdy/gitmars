import type { GitLogsType } from '../../../typings'
const { spawnSync } = require('../spawn')
const getSeconds = require('../utils/getSeconds')
const { debug } = require('../utils/debug')
const GitLogsFormatter = require('./gitLogsFormatter')

/**
 * 获取日志
 *
 * @param option - 参数
 * @param option.lastet - 限制显示最近多长时间的日志
 * @param option.limit - 限制数量
 * @param option.noMerges - 是否排除merge记录
 * @param option.params - 附带参数
 * @param option.keys - 需要返回的字段
 * @param option.grep - 筛选关键词
 * @param option.author - 筛选提交人
 * @param option.branch - 要查询的分支
 * @returns logsList - 返回列表
 */
function getGitLogs(option: any = {}): GitLogsType[] {
    const {
        lastet,
        limit,
        params = '',
        keys,
        noMerges = false,
        grep,
        author,
        branch
    } = option
    const formatter = new GitLogsFormatter()
    let argv = [
        'log',
        branch || '',
        '--date-order',
        `--pretty=format:${formatter.getFormat(keys)}`
    ]
    if (limit) argv.push('-' + limit)
    if (lastet) argv = argv.concat(['--since', getSeconds(lastet)])
    if (grep) argv = argv.concat(['--grep', grep])
    if (author) argv = argv.concat(['--author', author])
    if (noMerges) argv.push('--no-merges')
    if (params) argv = argv.concat(params.split(' '))
    const { stdout } = spawnSync('git', argv)
    debug('getGitLogs', stdout)
    return formatter.getLogs(stdout)
}

module.exports = getGitLogs
export {}

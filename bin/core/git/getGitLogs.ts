const { spawnSync } = require('../spawn')
const getSeconds = require('../utils/getSeconds')
const GitLogsFormatter = require('./gitLogsFormatter')

import type { GitLogsType } from '../../../typings'

/**
 * 获取日志
 *
 * @param config - GitLogsType
 * @returns {Array} true 返回列表
 */
function getGitLogs(config: any = {}): GitLogsType[] {
    const {
        lastet,
        limit,
        // branches,
        params = '',
        keys,
        noMerges = false
    } = config
    const formatter = new GitLogsFormatter()
    let argv = [
        'log',
        '--date-order',
        `--pretty=format:${formatter.getFormat(keys)}`
    ]
    if (limit) argv.push('-' + limit)
    if (lastet) argv = argv.concat(['--since', getSeconds(lastet)])
    if (noMerges) argv.push('--no-merges')
    // if (branches) argv = argv.concat(['--branches', branches])
    argv = argv.concat(params.split(' '))
    const { stdout } = spawnSync('git', argv)
    const logList: GitLogsType[] = formatter.getLogs(stdout)
    return logList
}

module.exports = getGitLogs
export {}

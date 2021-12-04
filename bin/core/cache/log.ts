const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')

import type { GitLogType } from '../../../typings'

/**
 * 存储错误日志
 *
 * @param log - 错误日志
 */
function setLog(log: GitLogType): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarslog')
    sh.sed(
        '-i',
        // eslint-disable-next-line no-control-regex
        /[\s\S\n\r\x0a\x0d]*/,
        encodeURIComponent(JSON.stringify(log)),
        gitDir + '/.gitmarslog'
    )
}

module.exports = {
    setLog
}
export {}

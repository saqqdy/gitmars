import type { GitmarsLogType } from '../../../typings'
const sh = require('shelljs')
const getGitRevParse = require('../git/getGitRevParse')

/**
 * 存储错误日志
 *
 * @param log - 错误日志
 */
function setLog(log: GitmarsLogType): void {
    const { gitDir } = getGitRevParse()
    sh.touch(gitDir + '/.gitmarslog')
    sh.sed(
        '-i',
        // eslint-disable-next-line no-control-regex
        /[\s\S\n\r\x0A\x0D]*/,
        encodeURIComponent(JSON.stringify(log)),
        gitDir + '/.gitmarslog'
    )
}

module.exports = {
    setLog
}
export {}

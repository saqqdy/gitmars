const { debug } = require('../utils/debug')

import type { GitLogKeysType, GitLogsType } from '../../../typings'

class GitLogsFormatter {
    keys: GitLogKeysType[] = [
        '%H',
        // '%h',
        '%T',
        // '%t',
        '%P',
        // '%p',
        '%an',
        // '%aN',
        '%ae',
        // '%aE',
        '%al',
        '%aL',
        '%ad',
        // '%aD',
        '%ar',
        '%at',
        // '%ai',
        '%aI',
        '%as',
        '%cn',
        // '%cN',
        '%ce',
        // '%cE',
        '%cl',
        '%cL',
        '%cd',
        // '%cD',
        '%cr',
        '%ct',
        // '%ci',
        '%cI',
        '%cs',
        '%d',
        '%D',
        // %(describe[:options]),
        '%S',
        '%e',
        '%s',
        '%f',
        '%b',
        '%B',
        '%N',
        '%GG',
        '%G?',
        '%GS',
        '%GK',
        '%GF',
        '%GP',
        '%GT',
        '%gD',
        '%gd',
        '%gn',
        '%gN',
        '%ge',
        '%gE',
        '%gs',
        '%(trailers:key=Signed-off-by)',
        '%(trailers:key=Reviewed-by)'
    ]
    format = ''
    constructor(keys: GitLogKeysType[]) {
        if (keys) {
            this.keys = keys
        }
    }
    /**
     * 获取format
     *
     * @param keys - 需要返回的数据key
     * @returns format - string
     */
    getFormat(keys: GitLogKeysType[]): string {
        if (keys && keys.length) this.keys = keys
        this.format = `-start-${this.keys.join(',=')}-end-`
        debug('GitLogsFormatter-format', this.format, keys)
        return this.format
    }
    /**
     * 获取日志
     *
     * @returns config - GitProjectConfigType
     */
    getLogs(stdout: string): GitLogsType[] {
        const list: GitLogsType[] = []
        if (stdout) {
            const match =
                stdout
                    .replace(/(?:^-start-)|(?:-end-$)/g, '')
                    .replace(/-end-([.\n]+)-start-/g, '-split-')
                    .split('-split-') || []
            for (const log of match) {
                const args = log.split(',=')
                const map: GitLogsType = {}
                this.keys.forEach((key, i) => {
                    map[key] = args[i]
                })
                list.push(map)
            }
        }
        debug('GitLogsFormatter-logs', stdout)
        return list
    }
}

module.exports = GitLogsFormatter
export {}

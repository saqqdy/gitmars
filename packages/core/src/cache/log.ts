import sh from 'shelljs'
import type { GitmarsLogType } from '../../typings'
import getGitRevParse from '#lib/git/getGitRevParse'
import { removeFile } from '#lib/utils/file'
import i18n from '#lib/locales/index'

const { gitDir } = getGitRevParse()

/**
 * 存储错误日志
 *
 * @param log - 错误日志
 */
export function setLog(log: GitmarsLogType): void {
    sh.touch(gitDir + '/.gitmarslog')
    sh.sed(
        '-i',
        // eslint-disable-next-line no-control-regex
        /[\s\S\n\r\x0A\x0D]*/,
        encodeURIComponent(JSON.stringify(log)),
        gitDir + '/.gitmarslog'
    )
}

/**
 * 清理log
 */
export function cleanLog() {
    removeFile({
        name: i18n.__('Gitmars package cache file'),
        url: gitDir + '/.gitmarslog'
    })
}

export default {
    setLog,
    cleanLog
}

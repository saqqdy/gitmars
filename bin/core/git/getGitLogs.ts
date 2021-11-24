const sh = require('shelljs')
const getSeconds = require('../utils/getSeconds')

import type { GitLogType } from '../../../typings'

/**
 * 获取日志
 *
 * @param config - GitLogType
 * @returns {Array} true 返回列表
 */
function getGitLogs(config: any = {}): GitLogType[] {
    const { lastet, limit, branches, params = '' } = config
    const keys = [
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
        // %(describe[:options]), // human-readable name, like git-describe[1]; empty string for undescribable commits. The describe string may be followed by a colon and zero or more comma-separated options. Descriptions can be inconsistent when tags are added or removed at the same time.
        '%S', // ref name given on the command line by which the commit was reached (like git log --source), only works with git log
        '%e', // encoding
        // ----------
        '%s', // subject
        '%f', // sanitized subject line, suitable for a filename
        '%b', // body
        '%B', // raw body (unwrapped subject and body)
        '%N', // commit notes
        '%GG', // raw verification message from GPG for a signed commit
        '%G?', // show "G" for a good (valid) signature, "B" for a bad signature, "U" for a good signature with unknown validity, "X" for a good signature that has expired, "Y" for a good signature made by an expired key, "R" for a good signature made by a revoked key, "E" if the signature cannot be checked (e.g. missing key) and "N" for no signature
        '%GS', // show the name of the signer for a signed commit
        '%GK', // show the key used to sign a signed commit
        '%GF', // show the fingerprint of the key used to sign a signed commit
        '%GP', // show the fingerprint of the primary key whose subkey was used to sign a signed commit
        '%GT', // show the trust level for the key used to sign a signed commit
        '%gD', // reflog selector, e.g., refs/stash@{1} or refs/stash@{2 minutes ago}; the format follows the rules described for the -g option. The portion before the @ is the refname as given on the command line (so git log -g refs/heads/master would yield refs/heads/master@{0}).
        '%gd', // shortened reflog selector; same as %gD, but the refname portion is shortened for human readability (so refs/heads/master becomes just master).
        '%gn', // reflog identity name
        '%gN', // reflog identity name (respecting .mailmap, see git-shortlog[1] or git-blame[1])
        '%ge', // reflog identity email
        '%gE', // reflog identity email (respecting .mailmap, see git-shortlog[1] or git-blame[1])
        '%gs' // reflog subject
        // '%(trailers:key=Reviewed-by)' // display the trailers of the body as interpreted by git-interpret-trailers[1]. The trailers string may be followed by a colon and zero or more comma-separated options. If any option is provided multiple times the last occurrence wins.
    ]
    const results = sh
        .exec(
            `git log${limit ? ' -"' + limit + '"' : ''}${
                lastet ? ' --since="' + getSeconds(lastet) + '"' : ''
            }${
                branches ? ' --branches="*' + branches + '"' : ''
            } --date-order --pretty=format:"${keys.join(',=')}-end-" ${params}`,
            { silent: true }
        )
        .stdout.replace(/[\r\n]+/g, '')
        .replace(/-end-$/, '')
    const logList: GitLogType[] = []
    results &&
        results.split('-end-').forEach((log: string) => {
            const args = log.split(',=')
            const map: {
                [props: string]: string
            } = {}
            keys.forEach((key, i) => {
                map[key] = args[i]
            })
            logList.push(map)
        })
    return logList
}

module.exports = getGitLogs
export {}

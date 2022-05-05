import getHookComment from './getHookComment'
const hookComment = getHookComment()

/**
 * 获取本地脚本
 *
 * @param pmName - pmName
 * @param relativeUserPkgDir - relativeUserPkgDir
 * @returns shell - 脚本
 */
function getLocalShell(pmName: string, relativeUserPkgDir: string): string {
    return `${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`
}

export default getLocalShell

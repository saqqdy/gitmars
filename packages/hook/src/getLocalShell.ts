import getHookComment from './getHookComment'

const hookComment = getHookComment()

/**
 * Get the local shell script
 *
 * @param pmName - pmName
 * @param relativeUserPkgDir - relativeUserPkgDir
 * @returns shell - The shell script
 */
function getLocalShell(pmName: string, relativeUserPkgDir: string): string {
	return `${hookComment}

packageManager=${pmName}
cd "${relativeUserPkgDir}"
`
}

export default getLocalShell

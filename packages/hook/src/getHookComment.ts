import { getGitConfig, getGitRevParse, readPkg } from '@gitmars/git'

const { gitUrl } = getGitConfig()
const { root } = getGitRevParse()

/**
 * Generate the hook header comment
 *
 * @returns comment - The generated comment
 */
function getHookComment(): string {
	// const pkgHomepage = process.env.npm_package_homepage
	const { author, homepage: gitmarsHomepage, version: gitmarsVersion } = readPkg()
	const createdAt = new Date().toLocaleString()

	return `# Created by gitmars v${gitmarsVersion} (${gitmarsHomepage})
# author: ${author}
# At: ${createdAt}
# From: ${root} (${gitUrl})`
}

export default getHookComment

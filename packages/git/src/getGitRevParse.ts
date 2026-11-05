import { debug, spawnSync } from '@gitmars/utils'
import slash from 'slash'

export interface GitProjectRevParseType {
	prefix: string
	gitCommonDir: string
	root: string
	gitDir: string
	gitHookDir: string
	cdup: string
}

/**
 * Get the git repository paths
 *
 * @param cwd - Current working directory
 * @returns gitRevParse - A GitProjectRevParseType object
 */
function getGitRevParse(cwd: string = process.cwd()): GitProjectRevParseType {
	const { stdout } = spawnSync(
		'git',
		[
			'rev-parse',
			'--show-toplevel',
			'--show-prefix',
			'--git-common-dir',
			'--absolute-git-dir',
			'--show-cdup',
		],
		{ cwd },
	)
	const [root, prefix, gitCommonDir, gitDir, cdup = ''] = stdout!
		.split('\n')
		.map((s: string) => s.trim())
		.map(slash)

	debug('getGitRevParse', {
		prefix: prefix || '.',
		gitCommonDir,
		root,
		gitDir,
		gitHookDir: `${gitDir}/hooks`,
		cdup,
	})

	return {
		prefix: prefix || '.',
		gitCommonDir,
		root,
		gitDir,
		gitHookDir: `${gitDir}/hooks`,
		cdup,
	}
}

export default getGitRevParse

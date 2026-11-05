import { debug, spawnSync } from '@gitmars/utils'
import slash from 'slash'

export interface GitProjectConfigType {
	gitUrl: string
	appName: string
}

/**
 * Get the git config
 *
 * @param cwd - Current working directory
 * @returns config - GitProjectConfigType
 */
function getGitConfig(cwd: string = process.cwd()): GitProjectConfigType {
	const { stdout } = spawnSync('git', ['config', '--local', '--get', 'remote.origin.url'], {
		cwd,
	})
	const [gitUrl] = stdout!
		.split('\n')
		.map((s: string) => s.trim())
		.map(slash)

	debug('getGitConfig', {
		gitUrl,
		appName: gitUrl
			.replace(/\.git\/?$/, '')
			.split('/')
			.reverse()[0],
	})

	return {
		gitUrl,
		appName: gitUrl
			.replace(/\.git\/?$/, '')
			.split('/')
			.reverse()[0],
	}
}

export default getGitConfig

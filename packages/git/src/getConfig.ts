import type { GitmarsConfigExtend, GitmarsConfigType } from './types'
import { statSync } from 'node:fs'
import { homedir } from 'node:os'
import { debug, echo } from '@gitmars/utils'
import { cosmiconfigSync } from 'cosmiconfig'
import getGitRevParse from './getGitRevParse'
import lang from './lang'

const { t } = lang
const defaults = {
	master: 'master',
	develop: 'dev',
	release: 'release',
	bugfix: 'bug',
	support: 'support',
	user: '',
	email: '',
	nameValidator: '',
	descriptionValidator: '',
	msgTemplate: t('${message}; project: ${project}; path: ${pwd}'),
	apolloConfig: '',
	hooks: '',
	api: '',
	gitHost: '',
	gitID: '',
}

/**
 * Load the global config as a base layer, searched from the home directory.
 *
 * Uses cosmiconfig search places so any supported config filename/formats works
 * (e.g. ~/.gitmarsrc, ~/.gitmarsrc.json, ~/.gitmarsrc.js), not a hardcoded path.
 *
 * @param explorer - a cosmiconfig explorer instance
 * @returns config - the parsed global config, or an empty object when missing/unparseable
 */
function loadGlobalConfig(
	explorer: ReturnType<typeof cosmiconfigSync>,
): Partial<GitmarsConfigType> {
	let result

	try {
		result = explorer.search(homedir())
	} catch (e) {
		debug('getConfig-global-error', e)

		return {}
	}

	debug('getConfig-global', result?.config)

	return (result?.config as Partial<GitmarsConfigType>) || {}
}

/**
 * Read the config
 *
 * @param pathName - Accepts a directory or a file; loads the file directly when one is passed
 * @param moduleName - Package name
 * @returns config - Return the configuration object
 */
function getConfig(pathName?: string, moduleName = 'gitmars'): GitmarsConfigExtend {
	let info

	if (!pathName) {
		const { root } = getGitRevParse()

		if (!root) {
			echo(t('The current directory is not a git project directory'))
			process.exit(1)
		}
		try {
			pathName = `${root}/gitmarsconfig.json`
			info = statSync(pathName)
		} catch {
			pathName = root
		}
	}
	debug('getConfig', pathName, info)
	const defaultSet = {
		skipCI: true,
	}
	const explorer = cosmiconfigSync(moduleName)

	if (!info) info = statSync(pathName)
	if (info.isDirectory()) {
		// Importing a directory: global ~/.gitmarsrc as the base, project-level overrides it
		const globalConfig = loadGlobalConfig(explorer)
		const { config = {}, filepath = '' } = explorer.search(pathName) || {}

		debug('getConfig-config', globalConfig, config, filepath)

		return Object.assign({}, defaults, defaultSet, globalConfig, config, { filepath })
	} else {
		// Importing a file
		const { config = {}, filepath = '' } = explorer.load(pathName) || {}

		debug('getConfig-config', config, filepath)

		return Object.assign({}, defaults, defaultSet, config, { filepath })
	}
}

export default getConfig

import { debug, spawnSync } from '@gitmars/utils'
import { getCurrentBranch } from '@gitmars/git'
import { cleanConfigSet, getCommand } from '@gitmars/go'

import combineConfig from '../conf/combine'
import endConfig from '../conf/end'
import updateConfig from '../conf/update'
import undoConfig from '../conf/undo'
import redoConfig from '../conf/redo'
import branchConfig from '../conf/branch'
import buildConfig from '../conf/build'
import buildMpConfig from '../conf/build-mp'
import miniprogramConfig from '../conf/miniprogram'
import startConfig from '../conf/start'
import copyConfig from '../conf/copy'
import getConfig from '../conf/get'
import saveConfig from '../conf/save'
import cleanbranchConfig from '../conf/cleanbranch'
import cleanConfig from '../conf/clean'
import revertConfig from '../conf/revert'
import linkConfig from '../conf/link'
import unlinkConfig from '../conf/unlink'
import postmsgConfig from '../conf/postmsg'
import adminConfig from '../conf/admin'

const {
	create: adminCreateConfig,
	publish: adminPublishConfig,
	update: adminUpdateConfig,
	clean: adminCleanConfig
} = adminConfig
const current = getCurrentBranch()
const branchPrefix = current.split('/')[0]
const functionBranches = ['feature', 'bugfix', 'support']

// New function branch
export const start = async () => {
	const config = cleanConfigSet(startConfig)
	const command = 'start ' + (await getCommand(config))
	debug('start', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// Merge Codes
export const combine = async () => {
	const requiredOptions: string[] = []
	let delOptions: string[] = [],
		delArgs: string[] = [],
		requiredArgs: string[] = []
	if (!functionBranches.includes(branchPrefix)) {
		// Non-functional branches do not need to perform these actions
		delOptions = ['--as-feature', '--no-bugfix']
		requiredArgs = ['type', 'name']
	} else {
		delArgs = ['type', 'name']
		// Functional branches
		switch (branchPrefix) {
			case 'feature':
				delOptions = ['--as-feature']
				break
			case 'support':
				delOptions = ['--as-feature']
				break
			default:
				break
		}
	}
	const config = cleanConfigSet(combineConfig, {
		delOptions,
		requiredOptions,
		delArgs,
		requiredArgs
	})
	const command = 'combine ' + (await getCommand(config))
	debug('combine', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// Merge codes and delete
export const end = async () => {
	let delArgs: string[] = [],
		requiredArgs: string[] = []
	if (!functionBranches.includes(branchPrefix)) {
		// Non-functional branches do not need to perform these actions
		requiredArgs = ['type', 'name']
	} else {
		delArgs = ['type', 'name']
	}
	const config = cleanConfigSet(endConfig, { delArgs, requiredArgs })
	const command = 'end ' + (await getCommand(config))
	debug('end', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// Merge upstream branch code
export const update = async () => {
	let delArgs: string[] = [],
		requiredArgs: string[] = []
	if (!functionBranches.includes(branchPrefix)) {
		// Non-functional branches do not need to perform these actions
		requiredArgs = ['type', 'name']
	} else {
		delArgs = ['type', 'name']
	}
	const config = cleanConfigSet(updateConfig, { delArgs, requiredArgs })
	const command = 'update ' + (await getCommand(config))
	debug('update', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// revert codes
export const undo = async () => {
	const config = cleanConfigSet(undoConfig)
	const command = 'undo ' + (await getCommand(config))
	debug('undo', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// Undo the revert records
export const redo = async () => {
	const config = cleanConfigSet(redoConfig)
	const command = 'redo ' + (await getCommand(config))
	debug('redo', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// branch command
export const branch = async () => {
	const config = cleanConfigSet(branchConfig)
	const command = 'branch ' + (await getCommand(config))
	debug('branch', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// build command
export const build = async () => {
	const config = cleanConfigSet(buildConfig)
	const command = 'build ' + (await getCommand(config))
	debug('build', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// build-mp command
export const buildMp = async () => {
	const config = cleanConfigSet(buildMpConfig)
	const command = 'build-mp ' + (await getCommand(config))
	debug('build-mp', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// miniprogram command
export const miniprogram = async () => {
	const config = cleanConfigSet(miniprogramConfig)
	const command = 'miniprogram ' + (await getCommand(config))
	debug('miniprogram', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// cherry-pick command
export const copy = async () => {
	const config = cleanConfigSet(copyConfig)
	const command = 'copy ' + (await getCommand(config))
	debug('copy', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// stash pop
export const get = async () => {
	const config = cleanConfigSet(getConfig)
	const command = 'get ' + (await getCommand(config))
	debug('get', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// stash
export const save = async () => {
	const config = cleanConfigSet(saveConfig)
	const command = 'save ' + (await getCommand(config))
	debug('save', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// Clean up merged function branches
export const cleanbranch = async () => {
	const config = cleanConfigSet(cleanbranchConfig)
	const command = 'cleanbranch ' + (await getCommand(config))
	debug('cleanbranch', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// clean cache
export const clean = async () => {
	const config = cleanConfigSet(cleanConfig)
	const command = 'clean ' + (await getCommand(config))
	debug('clean', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// revert codes
export const revert = async () => {
	const config = cleanConfigSet(revertConfig)
	const command = 'revert ' + (await getCommand(config))
	debug('revert', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// link
export const link = async () => {
	const config = cleanConfigSet(linkConfig)
	const command = 'link ' + (await getCommand(config))
	debug('link', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// unlink
export const unlink = async () => {
	const config = cleanConfigSet(unlinkConfig)
	const command = 'unlink ' + (await getCommand(config))
	debug('unlink', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// postmsg
export const postmsg = async () => {
	const config = cleanConfigSet(postmsgConfig)
	const command = 'postmsg ' + (await getCommand(config))
	debug('postmsg', command)
	spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// admin
export const admin = {
	create: async () => {
		const config = cleanConfigSet(adminCreateConfig)
		const command = 'admin create ' + (await getCommand(config))
		debug('admin create', command)
		spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
	},
	publish: async () => {
		const config = cleanConfigSet(adminPublishConfig)
		const command = 'admin publish ' + (await getCommand(config))
		debug('admin publish', command)
		spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
	},
	update: async () => {
		const config = cleanConfigSet(adminUpdateConfig)
		const command = 'admin update ' + (await getCommand(config))
		debug('admin update', command)
		spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
	},
	clean: async () => {
		const config = cleanConfigSet(adminCleanConfig)
		const command = 'admin clean ' + (await getCommand(config))
		debug('admin clean', command)
		spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
	}
}

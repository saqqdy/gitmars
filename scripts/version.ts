import { resolve } from 'path'
import {
	type ExecSyncOptions,
	type SpawnSyncOptions,
	execSync,
	spawnSync
} from 'child_process'
import { Separator, prompt } from 'inquirer'
import pkg from '../package.json'
import { writeJSON } from '../build/utils/fs'
import { PACKAGE_PATH, ROOT_PATH } from '../build/utils/paths'

export interface VersionObject {
	patch: string
	minor: string
	major: string
	preid: string
	subVer: string
	version: string
}

export interface VersionObjectList extends VersionObject {
	id: string
	command: string
}

const increaseTypes = ['prerelease'] as const
const preTypes = ['prepatch', 'preminor', 'premajor'] as const
const productionTypes = ['patch', 'minor', 'major'] as const
const preidList = ['alpha', 'beta', 'rc'] as const
let COUNT = 0

const spawnOption: SpawnSyncOptions = {
	stdio: 'inherit',
	shell: process.platform === 'win32'
}
const execOption: ExecSyncOptions = {
	stdio: 'inherit'
}

const newVers = {} as Record<
	typeof preidList[number] | 'production' | 'increase' | 'pre',
	VersionObjectList[]
>

for (const increaseType of increaseTypes) {
	if (!('increase' in newVers)) newVers.increase = []
	const ver = genNextVersion(increaseType)
	newVers.increase.push({
		...ver,
		command: `npm version ${increaseType} --preid=${ver.preid}`,
		id: String(COUNT++)
	})
}

for (const verType of productionTypes) {
	if (!('production' in newVers)) newVers.production = []
	const ver = genNextVersion(verType)
	newVers.production.push({
		...ver,
		command: `npm version ${verType}`,
		id: String(COUNT++)
	})
}

for (const preType of preTypes) {
	if (!('pre' in newVers)) newVers.pre = []
	for (const preidType of preidList) {
		const ver = genNextVersion(preType, preidType)
		newVers.pre.push({
			...ver,
			command: `npm version ${preType} --preid=${ver.preid}`,
			id: String(COUNT++)
		})
	}
}

prompt([
	{
		type: 'list',
		name: 'recommend',
		message: 'Choose which version do you want?',
		default: newVers.production[0].version,
		choices: [
			// new Separator(' === Increase (recommend) === '),
			...newVers.increase.map(el => `${el.id}) ${el.version}`),
			// new Separator(' === Production (recommend) === '),
			...newVers.production.map(el => `${el.id}) ${el.version}`),
			'create pre version',
			new Separator(' --- Exit --- '),
			'exit',
			new Separator()
		]
	},
	{
		type: 'list',
		name: 'pre',
		message: 'Choose which version do you want?',
		default: newVers.pre[0].version,
		choices: [
			...newVers.pre.map(el => `${el.id}) ${el.version}`),
			new Separator(' --- Exit --- '),
			'exit',
			new Separator()
		],
		when(data) {
			return data.recommend === 'create pre version'
		}
	},
	{
		type: 'confirm',
		name: 'confirm',
		message: '[Be Cautious]: Do you need to create a git tag?',
		default: true,
		when(data) {
			return data.recommend !== 'exit' && data.pre !== 'exit'
		}
	}
]).then((data: { recommend: string; pre?: string; confirm: boolean }) => {
	if (data.recommend === 'exit' || data.pre === 'exit') {
		process.exit(0)
	}

	const PACKAGE_JSON_URL = resolve(ROOT_PATH, 'package.json')
	const VERSION_URL = resolve(PACKAGE_PATH, 'version.json')
	const [id] = (data.pre || data.recommend).split(')')
	const { command, version } = searchVerTarget(id)

	if (data.confirm) {
		execSync(command, execOption)
	} else {
		writeJSON(PACKAGE_JSON_URL, {
			...pkg,
			version
		})
	}
	writeJSON(VERSION_URL, { version })
	spawnSync('npx', ['prettier', '--write', './package.json'], spawnOption)
})

function searchVerTarget(id) {
	return (
		newVers.increase.find(el => el.id === id) ||
		newVers.production.find(el => el.id === id) ||
		newVers.pre.find(el => el.id === id) ||
		null
	)
}

function parseVersion(ver: string): VersionObject {
	const [verNum, extVer = ''] = ver.split('-')
	const [major, minor, patch] = verNum.split('.')
	let [preid = '', subVer = ''] = extVer.split('.')
	if (preid && !subVer) {
		subVer = preid
		preid = ''
	}
	return {
		major,
		minor,
		patch,
		preid,
		subVer,
		version: ver
	}
}

function genNextVersion(
	type:
		| typeof productionTypes[number]
		| typeof increaseTypes[number]
		| typeof preTypes[number] = 'patch',
	preid?: typeof preidList[number]
): VersionObject {
	const ver = parseVersion(pkg.version)
	if (type.includes('patch')) {
		ver.patch = String(+ver.patch + 1)
	} else if (type.includes('minor')) {
		ver.minor = String(+ver.minor + 1)
		ver.patch = '0'
	} else if (type.includes('major')) {
		ver.major = String(+ver.major + 1)
		ver.minor = '0'
		ver.patch = '0'
	} else if (type.includes('release') && !ver.preid) {
		ver.patch = String(+ver.patch + 1)
	}

	if (type.includes('release')) {
		ver.subVer = ver.subVer ? String(+ver.subVer + 1) : '0'
		ver.preid = ver.preid || 'alpha'
	} else if (preid) {
		ver.subVer = '0'
		ver.preid = preid
	} else {
		ver.preid = ''
		ver.subVer = ''
	}
	ver.version = ver.subVer
		? `${ver.major}.${ver.minor}.${ver.patch}-${ver.preid}.${ver.subVer}`
		: `${ver.major}.${ver.minor}.${ver.patch}`
	return ver
}

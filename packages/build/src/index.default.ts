import runJenkins from './runJenkins'
import { cleanBuildConfig, getBuildConfig, getProjectOption } from './buildConfig'

export type { RunJenkinsOptionType } from './runJenkins'
export type * from './types'
export default {
	version: '__VERSION__',
	getBuildConfig,
	getProjectOption,
	cleanBuildConfig,
	runJenkins
}

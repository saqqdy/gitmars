import { cleanBuildConfig, getBuildConfig, getProjectOption } from './buildConfig'
import runJenkins from './runJenkins'

export type { RunJenkinsOptionType } from './runJenkins'
export type * from './types'
export default {
	version: '__VERSION__',
	getBuildConfig,
	getProjectOption,
	cleanBuildConfig,
	runJenkins,
}

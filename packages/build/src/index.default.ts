import runJenkins from './runJenkins'
import { cleanBuildConfig, getBuildConfig } from './buildConfig'

export type { RunJenkinsOptionType } from './runJenkins'
export type * from './types'
export default {
	version: '__VERSION__',
	getBuildConfig,
	cleanBuildConfig,
	runJenkins
}

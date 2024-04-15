import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { runSpawnSync } from '../utils/exec'
import { wrapDisplayName } from '../utils/gulp'
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

const pkgs = packages.filter(({ buildTask }) => buildTask && buildTask.includes('type'))

export async function buildType() {
	const builds = pkgs.map(async ({ name, build }) => {
		if (build === false) return
		await runSpawnSync(`npx tsc -p tsconfig.json`, resolve(PACKAGE, name))
	})
	await Promise.all(builds)
}

export async function cleanDirs() {
	for (const { name, output = 'dist' } of pkgs) {
		await runSpawnSync(`rimraf ${output}`, resolve(PACKAGE, name))
	}
}

export default series(
	// wrapDisplayName('clean:dirs', cleanDirs),
	parallel(wrapDisplayName('build:type', buildType))
)

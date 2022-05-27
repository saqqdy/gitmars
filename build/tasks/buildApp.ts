import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { runSpawnSync } from '../utils/exec'
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

export async function buildApp() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'app')
        .map(async ({ name }) => {
            await runSpawnSync(`pnpm build`, resolve(PACKAGE, name))
        })
    await Promise.all(builds)
}

// export async function genVersion() {
//     await runSpawnSync(`pnpm gen:version`)
// }

export default series(
    // wrapDisplayName('gen:version', genVersion),
    parallel(wrapDisplayName('build:app', buildApp))
)

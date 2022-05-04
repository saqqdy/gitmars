import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { run } from '../utils/exec'
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

export async function buildDocs() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'docs')
        .map(async ({ name }) => {
            await run(`pnpm docs:build`, resolve(PACKAGE, name))
        })
    await Promise.all(builds)
}

// export async function genDocs() {
//     await run(`pnpm gen:version`)
// }

export default series(
    // wrapDisplayName('gen:docs', genDocs),
    parallel(wrapDisplayName('build:docs', buildDocs))
)

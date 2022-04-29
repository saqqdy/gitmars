import { join } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { run, runExec } from '../utils/exec'
import { ROOT_PATH } from '../utils/paths'

export async function buildFile() {
    await runExec(`sh ${join(ROOT_PATH, 'scripts', 'build-entry.sh')}`)
    await runExec(`sh ${join(ROOT_PATH, 'scripts', 'gen-types.sh')}`)
}

export async function cleanFile() {
    const dirs: string[] = [join(ROOT_PATH, 'global.d.ts')]
    await run(`rimraf ${dirs.join(' ')}`)
}

export default series(
    wrapDisplayName('clean:esm', cleanFile),
    parallel(wrapDisplayName('build:esm:bundle', buildFile))
)

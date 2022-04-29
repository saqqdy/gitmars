import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { run } from '../utils/exec'
import { OUTPUT_CJS_PATH } from '../utils/paths'

export async function buildEsm() {
    await run('pnpm build:esm-types')
}

export async function cleanEsm() {
    const dirs: string[] = [OUTPUT_CJS_PATH]
    await run(`rimraf ${dirs.join(' ')}`)
    await run(`mkdir -p ${dirs.join(' ')}`)
}

export default series(
    wrapDisplayName('clean:esm', cleanEsm),
    parallel(wrapDisplayName('build:esm:bundle', buildEsm))
)

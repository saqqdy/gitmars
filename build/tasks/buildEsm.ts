import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { run } from '../utils/exec'
import { OUTPUT_CJS_PATH } from '../utils/paths'

export async function buildEsm() {
    await run(`npx tsc -b --force ${join(ROOT_PATH, 'tsconfig.esm.json')}`)
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

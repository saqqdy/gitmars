import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { runSpawnSync } from '../utils/exec'
import { OUTPUT_CJS_PATH } from '../utils/paths'

export async function buildEsm() {
    await runSpawnSync(`npx tsc -b --force ${join(ROOT_PATH, 'tsconfig.esm.json')}`)
}

export async function cleanEsm() {
    const dirs: string[] = [OUTPUT_CJS_PATH]
    await runSpawnSync(`rimraf ${dirs.join(' ')}`)
    await runSpawnSync(`mkdir -p ${dirs.join(' ')}`)
}

export default series(
    wrapDisplayName('clean:esm', cleanEsm),
    parallel(wrapDisplayName('build:esm:bundle', buildEsm))
)

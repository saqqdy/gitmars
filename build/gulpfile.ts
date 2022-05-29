import { parallel, series } from 'gulp'
import { wrapDisplayName } from './utils/gulp'
import { runSpawnSync } from './utils/exec'
// import {
//     OUTPUT_BUNDLE_PATH,
//     OUTPUT_CJS_PATH,
//     OUTPUT_ESM_PATH
// } from './utils/paths'

// import { buildEsm } from './tasks/buildEsm'
import { buildCjs } from './tasks/buildCjs'
import { buildApp } from './tasks/buildApp'
import { buildDocs, deployDocs } from './tasks/buildDocs'

// export async function clean() {
//     const dirs: string[] = [
//         OUTPUT_BUNDLE_PATH,
//         OUTPUT_CJS_PATH,
//         OUTPUT_ESM_PATH
//     ]
//     await runSpawnSync(`rimraf ${dirs.join(' ')}`)
//     await runSpawnSync(`mkdir -p ${dirs.join(' ')}`)
// }
// export async function cjs() {
//     console.log(80, process.cwd())
//     await runSpawnSync(`pwd`)
// }
// export { default as esm } from './tasks/buildEsm'
export { default as cjs } from './tasks/buildCjs'
export { default as app } from './tasks/buildApp'
export { default as docs } from './tasks/buildDocs'
export default series(
    // wrapDisplayName('clean:dist,es,lib', clean),
    // parallel(buildEsm, buildCjs),
    parallel(buildCjs),
    parallel(buildApp, buildDocs),
    parallel(deployDocs)
)

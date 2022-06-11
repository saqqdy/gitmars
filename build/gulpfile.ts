import { parallel, series } from 'gulp'
// import { wrapDisplayName } from './utils/gulp'
// import { runSpawnSync } from './utils/exec'
import { buildLib } from './tasks/buildLib'
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
export { default as lib } from './tasks/buildLib'
export { default as app } from './tasks/buildApp'
export { default as docs } from './tasks/buildDocs'
export default series(
    // wrapDisplayName('clean:dist,es,lib', clean),
    parallel(buildLib),
    parallel(buildApp, buildDocs),
    parallel(deployDocs)
)

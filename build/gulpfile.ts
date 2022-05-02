import { parallel, series } from 'gulp'
import { wrapDisplayName } from './utils/gulp'

// const [, , , , ...argv] = process.argv
// const [type = '', path = ''] = argv

// if (!type || !path) {
//     console.info('参数不正确')
//     process.exit(0)
// }

import { run } from './utils/exec'
// import {
//     OUTPUT_BUNDLE_PATH,
//     OUTPUT_CJS_PATH,
//     OUTPUT_ESM_PATH
// } from './utils/paths'

// import { genVersion } from './tasks/genVersion'
// import { buildFile } from './tasks/buildFile'
// import { buildFull } from './tasks/buildFull'
// import { buildLocale } from './tasks/buildLocale'
// import { buildEsm } from './tasks/buildEsm'
import { buildCjs } from './tasks/buildCjs'
// import buildStyle from './tasks/buildStyle'

// export async function clean() {
//     const dirs: string[] = [
//         OUTPUT_BUNDLE_PATH,
//         OUTPUT_CJS_PATH,
//         OUTPUT_ESM_PATH
//     ]
//     await run(`rimraf ${dirs.join(' ')}`)
//     await run(`mkdir -p ${dirs.join(' ')}`)
// }
// export async function cjs() {
//     console.log(80, process.cwd())
//     await run(`pwd`)
// }
// export { default as version } from './tasks/genVersion'
// export { default as file } from './tasks/buildFile'
// export { default as full } from './tasks/buildFull'
// export { default as locale } from './tasks/buildLocale'
// export { default as esm } from './tasks/buildEsm'
export { default as cjs } from './tasks/buildCjs'
// export { default as style } from './tasks/buildStyle'
export default series(
    // wrapDisplayName('clean:dist,es,lib', clean),
    // parallel(buildFile),
    // parallel(buildEsm, buildCjs),
    // parallel(buildFull, buildLocale, buildStyle)
    parallel(buildCjs)
)

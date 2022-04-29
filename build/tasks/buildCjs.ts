import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
// import { run } from '../utils/exec'
// import { OUTPUT_CJS_PATH } from '../utils/paths'

export async function buildCjs() {
    console.log(100)
    // await run(`npx tsc -b --force ${join(ROOT_PATH, 'tsconfig.cjs.json')}`)
}

export async function cleanCjs() {
    console.log(101)
    // const dirs: string[] = [OUTPUT_CJS_PATH]
    // await run(`rimraf ${dirs.join(' ')}`)
    // await run(`mkdir -p ${dirs.join(' ')}`)
}

export default series(
    wrapDisplayName('clean:cjs', cleanCjs),
    parallel(wrapDisplayName('build:cjs:bundle', buildCjs))
)

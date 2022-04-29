import { join, resolve } from 'path'
import { existsSync } from 'fs'
import { dest, parallel, series, src, task } from 'gulp'
// import { rollup } from 'rollup'
import less from 'gulp-less'
import autoprefixer from 'gulp-autoprefixer'
// import replace from 'gulp-replace'
// import concat from 'gulp-concat'
import { wrapDisplayName } from '../utils/gulp'
import { run, runExec } from '../utils/exec'
import components from '../../components.json'
import { COMPONENTS_PATH, PACKAGE_PATH, ROOT_PATH } from '../utils/paths'

/**
 * build less
 *
 * @returns task - TaskFunction
 */
export const compileLess = task('compileLess', () =>
    src(resolve(COMPONENTS_PATH, 'style', '*.less'))
        .pipe(less())
        .pipe(
            autoprefixer({
                cascade: false
            })
        )
        .pipe(dest(resolve(ROOT_PATH, 'lib', 'components', 'style')))
        .pipe(dest(resolve(ROOT_PATH, 'es', 'components', 'style')))
)

/**
 * build components less
 *
 * @returns task - TaskFunction
 */
export const compileComponentLess = task('compileComponentLess', cb => {
    Object.keys(components).map(component =>
        src(resolve(COMPONENTS_PATH, component, 'style', '*.less'))
            // .pipe(replace(`./${component}`, `../${component}`))
            .pipe(less({ paths: [resolve(PACKAGE_PATH, 'style')] }))
            .pipe(
                autoprefixer({
                    cascade: false
                })
            )
            .pipe(
                dest(
                    resolve(ROOT_PATH, 'lib', 'components', component, 'style')
                )
            )
            .pipe(
                dest(resolve(ROOT_PATH, 'es', 'components', component, 'style'))
            )
    )
    cb()
})

/**
 * build style entry
 *
 * @returns task - TaskFunction
 */
export async function buildStyleEntry() {
    Object.keys(components).map(async componentName => {
        const styleDir = resolve(COMPONENTS_PATH, componentName, 'style')
        const esDir = resolve(
            ROOT_PATH,
            'es',
            'components',
            componentName,
            'style'
        )
        const libDir = resolve(
            ROOT_PATH,
            'lib',
            'components',
            componentName,
            'style'
        )
        const index = resolve(styleDir, 'index.ts')
        const css = resolve(styleDir, 'css.ts')
        const input: string[] = []
        if (existsSync(index)) input.push(index)
        if (existsSync(css)) input.push(css)
        if (!input.length) return

        await runExec(
            `npx tsc ${input.join(
                ' '
            )} --declaration --sourceMap --moduleResolution node --target esnext --module esnext --outDir ${esDir}`
        )
        await runExec(
            `npx tsc ${input.join(
                ' '
            )} --declaration --sourceMap --moduleResolution node --target esnext --module commonjs --outDir ${libDir}`
        )
    })
}

/**
 * copy style
 *
 * @returns task - TaskFunction
 */
export async function copyStyle() {
    const buildTasks = Object.keys(components).map(async component => {
        const baseStyle = resolve(COMPONENTS_PATH, 'style')
        const componentStyle = resolve(COMPONENTS_PATH, component, 'style')
        const baseEsOutput = resolve(ROOT_PATH, 'es', 'components', 'style')
        const baseLibOutput = resolve(ROOT_PATH, 'lib', 'components', 'style')
        const esOutput = resolve(
            ROOT_PATH,
            'es',
            'components',
            component,
            'style'
        )
        const libOutput = resolve(
            ROOT_PATH,
            'lib',
            'components',
            component,
            'style'
        )
        if (existsSync(`${componentStyle}/index.less`)) {
            await run(`mkdir -p ${esOutput}`)
            await run(`mkdir -p ${libOutput}`)
            await run(`mkdir -p ${baseEsOutput}`)
            await run(`mkdir -p ${baseLibOutput}`)
            await run(
                `rsync -a --include *.less --exclude * ${componentStyle}/ ${esOutput}/`
            )
            await run(
                `rsync -a --include *.less --exclude * ${componentStyle}/ ${libOutput}/`
            )
        }
        await run(
            `rsync -a --include *.less --exclude * ${baseStyle}/ ${baseEsOutput}/`
        )
        await run(
            `rsync -a --include *.less --exclude * ${baseStyle}/ ${baseLibOutput}/`
        )
    })
    await Promise.all(buildTasks)
}

/**
 * 合并css
 *
 * @returns task - TaskFunction
 */
// export const concatCSS = task('concatCSS', cb => {
// 	src([resolve(ROOT_PATH, 'lib/style/*.css')])
// 		.pipe(sourcemaps.init())
// 		.pipe(concat('index.css'))
// 		.pipe(sourcemaps.write('.', {}))
// 		.pipe(dest(resolve(ROOT_PATH, 'lib', 'components', 'style')))
// 		.pipe(dest(resolve(ROOT_PATH, 'es', 'components', 'style')))
// 	cb()
// })

/**
 * clean style dirs
 *
 * @returns task - TaskFunction
 */
export async function cleanStyle() {
    const dirs: string[] = [
        resolve(ROOT_PATH, 'dist/style'),
        resolve(ROOT_PATH, 'lib/components/style'),
        resolve(ROOT_PATH, 'es/components/style')
    ]
    Object.keys(components).forEach(component => {
        dirs.push(join(ROOT_PATH, 'es', 'components', component, 'style'))
        dirs.push(join(ROOT_PATH, 'lib', 'components', component, 'style'))
    })
    await run(`rimraf ${dirs.join(' ')}`)
}

export async function copyOutputStyle() {
    const esStyle = resolve(ROOT_PATH, 'es', 'components', 'style')
    const baseOutput = resolve(ROOT_PATH, 'dist')
    await run(`mkdir -p ${baseOutput}`)
    await runExec(
        `rsync -a --include "*.css" --exclude "*" ${esStyle}/index.css ${baseOutput}/`
    )
}

export default series(
    wrapDisplayName('clean:style', cleanStyle),
    parallel(
        wrapDisplayName('copy:style', copyStyle),
        // wrapDisplayName('build:style:entry', buildStyleEntry),
        'compileLess',
        'compileComponentLess'
    ),
    wrapDisplayName('copy:output:style', copyOutputStyle)
    // parallel('concatCSS')
)

import path from 'path'
import assert from 'assert'
import { execSync } from 'child_process'
import { promises, readFileSync, writeFileSync } from 'fs'
import fg from 'fast-glob'
import consola from 'consola'
import { packages } from '../build/packages'
import { version } from '../package.json'
// import { updateImport } from "./utils";

const rootDir = path.resolve(__dirname, '..')
const watch = process.argv.includes('--watch')

const FILES_COPY_ROOT = ['LICENSE']
const FILES_COPY_LOCAL = ['README.md', '*.cjs', '*.mjs', '*.d.ts']

assert(process.cwd() !== __dirname)

async function buildMetaFiles() {
    for (const { name } of packages) {
        const packageRoot = path.resolve(__dirname, '..', 'packages', name)
        const packageDist = path.resolve(packageRoot, 'dist')

        if (name === 'core')
            await promises.copyFile(
                path.join(rootDir, 'README.md'),
                path.join(packageDist, 'README.md')
            )

        for (const file of FILES_COPY_ROOT)
            await promises.copyFile(
                path.join(rootDir, file),
                path.join(packageDist, file)
            )

        const files = await fg(FILES_COPY_LOCAL, { cwd: packageRoot })
        for (const file of files)
            await promises.copyFile(
                path.join(packageRoot, file),
                path.join(packageDist, file)
            )

        const packageJSON = JSON.parse(
            readFileSync(path.join(packageRoot, 'package.json'), 'utf8')
        )
        for (const key of Object.keys(packageJSON.dependencies || {})) {
            if (key.startsWith('@gitmars/'))
                packageJSON.dependencies[key] = version
        }
        for (const key of Object.keys(packageJSON.devDependencies || {})) {
            if (key.startsWith('@gitmars/'))
                packageJSON.devDependencies[key] = version
        }
        writeFileSync(
            path.join(packageDist, 'package.json'),
            JSON.stringify(packageJSON, null, 4)
        )
    }
}

async function build() {
    consola.info('Clean up')
    execSync('pnpm run clean', { stdio: 'inherit' })

    consola.info('Rollup')
    execSync(`pnpm run build:rollup${watch ? ' -- --watch' : ''}`, {
        stdio: 'inherit'
    })

    // consola.info("Fix types");
    // execSync("pnpm run types:fix", { stdio: "inherit" });

    await buildMetaFiles()
}

async function cli() {
    try {
        await build()
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

export { build }

if (require.main === module) cli()

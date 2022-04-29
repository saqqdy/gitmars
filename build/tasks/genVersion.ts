import { resolve } from 'path'
import { spawnSync } from 'child_process'
import pkg from '../../package.json'
import { writeJSON } from '../utils/fs'
import { PACKAGE_PATH, ROOT_PATH } from '../utils/paths'

let [, , type] = process.argv

if (!type) {
    console.info('请输入版本类型')
    process.exit(1)
}
type = type.replace(/\"/g, '')

const PACKAGE_JSON_URL = resolve(ROOT_PATH, 'package.json')
const VERSION_URL = resolve(PACKAGE_PATH, 'version.json')

if (['patch', 'minor', 'major'].includes(type)) {
    const arr: number[] = pkg.version.split('.').map(item => +item)
    switch (type) {
        case 'patch':
            arr[2]++
            break
        case 'minor':
            arr[2] = 0
            arr[1]++
            break
        case 'major':
            arr[2] = 0
            arr[1] = 0
            arr[0]++
            break
        default:
            break
    }
    pkg.version = arr.join('.')

    writeJSON(PACKAGE_JSON_URL, pkg)
    writeJSON(VERSION_URL, { version: pkg.version })
    spawnSync('npx', ['prettier', '--write', './package.json'], {
        stdio: 'inherit',
        shell: process.platform === 'win32'
    })
} else if (['dev', 'master'].includes(type)) {
    writeJSON(VERSION_URL, { version: type })
} else {
    console.info('请输入有效的版本类型')
    process.exit(1)
}

export default series(
    wrapDisplayName('clean:esm', cleanFile),
    parallel(wrapDisplayName('build:esm:bundle', buildFile))
)

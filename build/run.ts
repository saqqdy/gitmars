import { join } from 'path'
import {
    type ExecSyncOptions,
    type SpawnSyncOptions,
    execSync,
    spawnSync
} from 'child_process'
import * as tasks from './gulpfile'
import { ROOT } from './utils/paths'

let [, , type, ...argv] = process.argv

const spawnOption: SpawnSyncOptions = {
    stdio: 'inherit',
    shell: process.platform === 'win32'
}
const execOption: ExecSyncOptions = {
    stdio: 'inherit'
}

type && (type = type.replace(/\"/g, ''))

if (!type) {
    console.info('请输入构建类型')
    process.exit(1)
} else if (Object.keys(tasks).includes(type)) {
    spawnSync('pnpm', ['build', type], spawnOption)
} else if (type === 'create') {
    execSync(
        `sh ${join(ROOT, 'scripts', 'create-component.sh')} ${argv}`,
        execOption
    )
} else if (type === 'remove') {
    execSync(
        `npx zx ${join(ROOT, 'scripts', 'remove-component.mjs')} ${argv}`,
        execOption
    )
} else {
    console.info('请输入有效的构建类型')
    process.exit(1)
}

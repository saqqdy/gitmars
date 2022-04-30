import { exec, spawnSync } from 'child_process'
import { ROOT } from '../utils/paths'
import { wrapDisplayName } from './gulp'
import echo from './echo'

export function run(command: string, cwd: string = ROOT) {
    const [cmd, ...args] = command.split(' ')
    return new Promise((resolve, reject) => {
        const child = spawnSync(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32'
        })
        if (child.status !== 0) {
            reject(child.error)
        } else {
            resolve(true)
        }
    })
}

export function runExec(command: string, cwd: string = ROOT) {
    return new Promise((resolve, reject) => {
        const child = exec(
            command,
            {
                cwd
            },
            (error, stdout, stderr) => {
                if (error) {
                    echo(`exec "${command}" error`, 'error')
                    reject(stderr)
                } else {
                    resolve(stdout)
                }
            }
        )
        const onProcessExit = () => child.kill('SIGHUP')
        child.on('close', () => {
            process.removeListener('exit', onProcessExit)
        })
        process.on('exit', onProcessExit)
    })
}

export function runTask(command: string, cwd: string = ROOT) {
    return wrapDisplayName(`running: ${command}`, () => run(command, cwd))
}

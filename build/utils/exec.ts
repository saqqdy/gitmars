import { exec, execSync, spawn, spawnSync } from 'child_process'
import { ROOT } from '../utils/paths'
import { wrapDisplayName } from './gulp'
import echo from './echo'

export function runSpawn(command: string, cwd: string = ROOT) {
    const [cmd, ...args] = command.split(' ')
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32'
        })
        const onProcessExit = () => child.kill('SIGHUP')
        child.on('close', code => {
            process.removeListener('exit', onProcessExit)
            if (code === 0) resolve(true)
            else
                reject(
                    new Error(
                        `Command failed. \n Command: ${command} \n Code: ${code}`
                    )
                )
        })
        process.on('exit', onProcessExit)
    })
}

export function runSpawnSync(
    command: string,
    cwd: string = ROOT,
    option: Parameters<typeof spawnSync>[2] = {}
) {
    const [cmd, ...args] = command.split(' ')
    return new Promise((resolve, reject) => {
        const child = spawnSync(cmd, args, {
            cwd,
            stdio: 'inherit',
            shell: process.platform === 'win32',
            ...option
        })
        if (child.status !== 0) {
            reject(child.error)
        } else {
            try {
                resolve(child.stdout.toString())
            } catch {
                resolve(child.stdout)
            }
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
                    try {
                        resolve(stdout.toString())
                    } catch {
                        resolve(stdout)
                    }
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

export function runExecSync(
    command: string,
    cwd: string = ROOT,
    option: Parameters<typeof execSync>[1] = {}
) {
    return new Promise((resolve, reject) => {
        try {
            const stdout = execSync(command, {
                cwd,
                stdio: 'inherit',
                ...option
            })
            try {
                resolve(stdout.toString())
            } catch {
                resolve(stdout)
            }
        } catch (error) {
            reject(error)
        }
    })
}

export function runTask(command: string, cwd: string = ROOT) {
    return wrapDisplayName(`running: ${command}`, () =>
        runSpawnSync(command, cwd)
    )
}

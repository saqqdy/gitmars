const { spawnSync } = require('child_process')
const checkGitDirEnv = require('./checkGitDirEnv')
const getConfig = require('../getConfig')
const config = getConfig()

import type { ShellCode } from '../../../typings'

function getCommand(cwd: string, hookName: string) {
    return config && config.hooks && config.hooks[hookName]
}
/**
 * 执行脚本
 *
 * @param cwd - 当前工作目录
 * @param hookName - hookName
 * @param cmd - command
 * @param env - environment
 * @returns status - 0|1 返回状态
 */
function runCommand(cwd: string, hookName: string, cmd: string, env: any) {
    console.info(`gitmars > ${hookName} (node ${process.version})`)
    const { status } = spawnSync('sh', ['-c', cmd], {
        cwd,
        env: Object.assign(Object.assign({}, process.env), env),
        stdio: 'inherit'
    })
    if (status !== 0) {
        const noVerifyMessage = [
            'commit-msg',
            'pre-commit',
            'pre-rebase',
            'pre-push'
        ].includes(hookName)
            ? '(add --no-verify to bypass)'
            : '(cannot be bypassed with --no-verify due to Git specs)'
        console.info(`gitmars > ${hookName} hook failed ${noVerifyMessage}`)
    }
    // If shell exits with 127 it means that some command was not found.
    // However, if gitmars has been deleted from node_modules, it'll be a 127 too.
    // To be able to distinguish between both cases, 127 is changed to 1.
    if (status === 127) {
        return 1
    }
    return status || 0
}
/**
 * 运行主程序
 *
 * @returns status - 0|1 返回状态
 */
// @ts-ignore
function start(
    [, , hookName = '', ...GITMARS_GIT_PARAMS],
    { cwd = process.cwd() } = {}
): ShellCode {
    const command = getCommand(cwd, hookName)
    // Add GITMARS_GIT_PARAMS to env
    const env = {} as any
    if (
        GITMARS_GIT_PARAMS === null || GITMARS_GIT_PARAMS === void 0
            ? void 0
            : GITMARS_GIT_PARAMS.length
    ) {
        env.GITMARS_GIT_PARAMS = GITMARS_GIT_PARAMS.join(' ')
    }
    if (command) {
        return runCommand(cwd, hookName, command, env)
    }
    return 0
}

async function run() {
    checkGitDirEnv()
    try {
        const status = await start(process.argv as string[])
        process.exit(status)
    } catch (err) {
        console.info('Gitmars > 未知错误！请联系吴峰', err)
        process.exit(1)
    }
}

module.exports = run
export {}

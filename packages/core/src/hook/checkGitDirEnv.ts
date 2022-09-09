import { debug } from '#lib/utils/debug'

/**
 * 检查git环境变量
 */
function checkGitDirEnv(): void {
    if (process.env.GIT_DIR) {
        debug(`GIT_DIR 环境变量值为：${process.env.GIT_DIR}`)
        debug('如果提示"fatal: not a git repository"，请检查 GIT_DIR 的值')
    }
}

export default checkGitDirEnv

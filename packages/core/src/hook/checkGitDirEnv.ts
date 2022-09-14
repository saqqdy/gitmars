import { debug } from '#lib/utils/debug'
import i18n from '#lib/locales/index'

/**
 * 检查git环境变量
 */
function checkGitDirEnv(): void {
    if (process.env.GIT_DIR) {
        debug(`GIT_DIR env is: ${process.env.GIT_DIR}`)
        debug(
            i18n.__(
                'If prompted "fatal: not a git repository", please check the value of GIT_DIR'
            )
        )
    }
}

export default checkGitDirEnv

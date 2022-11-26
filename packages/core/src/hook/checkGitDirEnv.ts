import { debug } from '#lib/utils/debug'
import lang from '#lib/lang'

const { t } = lang

/**
 * 检查git环境变量
 */
function checkGitDirEnv(): void {
    if (process.env.GIT_DIR) {
        debug(`GIT_DIR env`, process.env.GIT_DIR)
        debug(
            t(
                'If prompted "fatal: not a git repository", please check the value of GIT_DIR'
            )
        )
    }
}

export default checkGitDirEnv

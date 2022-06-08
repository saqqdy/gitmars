import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { runExecSync, runSpawnSync } from '../utils/exec'
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

export async function buildDocs() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'docs')
        .map(async ({ name }) => {
            const RUN_PATH = resolve(PACKAGE, name)
            // 替换图片资源
            await runExecSync(
                `find ./ -type f -path "*.md" | xargs sed -i "" "s/https:\u005C\u005Craw.githubusercontent.com\u005Csaqqdy\u005Cgitmars/https:\u005C\u005Cgitee.com\u005Csaqqdy\u005Cgitmars\u005Craw/g"`,
                RUN_PATH
            )
            // 生成静态文件
            await runExecSync(`pnpm run -C ${RUN_PATH} docs:build`, RUN_PATH)
            // 重置图片资源
            await runExecSync(
                `find ./ -type f -path "*.md" | xargs sed -i '' "s/https:\u005C\u005Cgitee.com\u005Csaqqdy\u005Cgitmars\u005Craw/https:\u005C\u005Craw.githubusercontent.com\u005Csaqqdy\u005Cgitmars/g"`,
                RUN_PATH
            )
        })
    await Promise.all(builds)
}

export async function deployDocs() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'docs')
        .map(async ({ name }) => {
            const RUN_PATH = resolve(PACKAGE, name, 'dist')
            await runSpawnSync(`git init`, RUN_PATH, { stdio: 'ignore' })
            await runSpawnSync(`git add .`, RUN_PATH)
            const status = await runSpawnSync(
                `git status -s --no-column`,
                RUN_PATH,
                { stdio: 'pipe' }
            )
            if (!status) {
                console.info('文档已经是最新版本，无需提交')
                return
            }
            await runSpawnSync(`git commit -m "deploy"`, RUN_PATH)
            await runSpawnSync(
                `git push -f git@github.com:saqqdy/gitmars.git master:gh-pages`,
                RUN_PATH
            )
            await runSpawnSync(
                `git push -f git@gitee.com:saqqdy/gitmars.git master:gh-pages`,
                RUN_PATH
            )
        })
    await Promise.all(builds)
}

export default series(
    parallel(wrapDisplayName('build:docs', buildDocs)),
    parallel(wrapDisplayName('deploy:docs', deployDocs))
)

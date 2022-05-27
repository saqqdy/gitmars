import { resolve } from 'path'
import { parallel, series } from 'gulp'
import { wrapDisplayName } from '../utils/gulp'
import { runSpawnSync, runExecSync } from '../utils/exec'
import { PACKAGE } from '../utils/paths'
import { packages } from '../packages'

export async function buildDocs() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'docs')
        .map(async ({ name }) => {
            // 替换图片资源
            await runExecSync(
                `find ./ -type f -path "*.md" | xargs sed -i '' "s/https:\/\/raw.githubusercontent.com\/saqqdy\/gitmars/https:\/\/gitee.com\/saqqdy\/gitmars\/raw/g"`,
                resolve(PACKAGE, name)
            )
            // 生成静态文件
            await runExecSync(`pnpm docs:build`, resolve(PACKAGE, name))
            // 重置图片资源
            await runExecSync(
                `find ./ -type f -path "*.md" | xargs sed -i '' "s/https:\/\/gitee.com\/saqqdy\/gitmars\/raw/https:\/\/raw.githubusercontent.com\/saqqdy\/gitmars/g"`,
                resolve(PACKAGE, name)
            )
        })
    await Promise.all(builds)
}

export async function deployDocs() {
    const builds = packages
        .filter(({ buildTask }) => buildTask === 'docs')
        .map(async ({ name }) => {
            // 替换图片资源
            await runSpawnSync(`git init`, resolve(PACKAGE, name, 'dist'))
            await runSpawnSync(`git add .`, resolve(PACKAGE, name, 'dist'))
            await runSpawnSync(
                `git commit -m "deploy"`,
                resolve(PACKAGE, name, 'dist')
            )
            await runSpawnSync(
                `git push -f git@github.com:saqqdy/gitmars.git master:gh-pages`,
                resolve(PACKAGE, name, 'dist')
            )
            await runSpawnSync(
                `git push -f git@gitee.com:saqqdy/gitmars.git master:gh-pages`,
                resolve(PACKAGE, name, 'dist')
            )
        })
    await Promise.all(builds)
}

export default series(
    parallel(wrapDisplayName('build:docs', buildDocs)),
    parallel(wrapDisplayName('deploy:docs', deployDocs))
)

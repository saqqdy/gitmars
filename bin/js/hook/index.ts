const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
sh.config.execPath = sh.which('node').toString()
const { warning, compareVersion } = require('../index')
const { hookList } = require('../global')
const gitRevParse = require('../gitRevParse')
const getGitVersion = require('../getGitVersion')
const getHookComment = require('./getHookComment')
const getHookType = require('./getHookType')
const getHookShell = require('./getHookShell')
const getLocalShell = require('./getLocalShell')
const ciInfo = require('ci-info')
const getConfig = require('../getConfig')
const { gitHookDir, prefix } = gitRevParse()
const gitVersion = getGitVersion()
const config = getConfig()

/**
 * 创建git钩子
 *
 * @param dir - 目标目录，默认gitHookDir
 */
function createHooks(dir: string = gitHookDir): void {
    // 创建hook文件方法
    const writeHook = (filename: string, shell: string): void => {
        fs.writeFileSync(filename, shell, 'utf-8')
        fs.chmodSync(filename, 0o0755)
    }
    const hooks = hookList.map((hookName: string) => path.join(dir, hookName))
    hooks.forEach((filename: string) => {
        const hookShell = `#!/bin/sh
# gitmars

${getHookComment()}

. "$(dirname "$0")/gitmars.sh"`
        const name = path.basename(filename)
        // 检查hook文件是否已存在
        if (fs.existsSync(filename)) {
            const hook = fs.readFileSync(filename, 'utf-8')
            // 合并
            if (getHookType.isGhooks(hook)) {
                console.info(`合并已存在的ghooks钩子: ${name}`)
                return writeHook(filename, hookShell)
            }
            // 合并
            if (getHookType.isPreCommit(hook)) {
                console.info(`合并已存在的pre-commit钩子: ${name}`)
                return writeHook(filename, hookShell)
            }
            // 更新
            if (
                getHookType.isGitmars(hook) ||
                getHookType.isHusky(hook) ||
                getHookType.isYorkie(hook)
            ) {
                return writeHook(filename, hookShell)
            }
            // 跳过
            console.info(`跳过已存在的用户git钩子: ${name}`)
            return
        }
        // 如果不存在钩子，创建
        writeHook(filename, hookShell)
    })
}

/**
 * 创建git钩子
 *
 * @param dir - 目标目录，默认gitHookDir
 * @returns result - boolean|void
 */
function removeHooks(dir: string = gitHookDir): boolean | void {
    const hooks = hookList.map((hookName: string) => path.join(dir, hookName))
    hooks
        .filter((filename: string) => {
            if (fs.existsSync(filename)) {
                const hook = fs.readFileSync(filename, 'utf-8')
                return getHookType.isGitmars(hook)
            }
            return false
        })
        .forEach((filename: string) => {
            fs.unlinkSync(filename)
        })
}

/**
 * 创建主程序
 *
 * @param dir - 目标目录，默认gitHookDir
 */
function createHookShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.sh')
    fs.writeFileSync(filename, getHookShell(), 'utf-8')
    fs.chmodSync(filename, 0o0755)
}

/**
 * 移除主程序
 *
 * @param dir - 目标目录，默认gitHookDir
 */
function removeHookShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * 创建本地脚本
 *
 * @param dir - 目标目录，默认gitHookDir
 * @param pmName - 包管理工具名称
 * @param relativeUserPkgDir - 用户包相对路径
 */
function createLocalShell(
    dir: string = gitHookDir,
    pmName: string,
    relativeUserPkgDir: string
): void {
    const filename = path.join(dir, 'gitmars.local.sh')
    fs.writeFileSync(
        filename,
        getLocalShell(pmName, relativeUserPkgDir),
        'utf-8'
    )
    fs.chmodSync(filename, 0o0755)
}

/**
 * 移除本地脚本
 *
 * @param dir - 目标目录，默认gitHookDir
 */
function removeLocalShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.local.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * 初始化钩子
 */
function init(): void {
    const gitVersionIsNew = gitVersion && compareVersion(gitVersion, '2.13.0')
    // 集成环境不安装
    if (ciInfo.isCI && config.skipCI) {
        console.info('持续集成环境，跳过钩子安装')
        return
    }
    // 如果没有hooks文件夹，创建
    if (!fs.existsSync(gitHookDir)) {
        fs.mkdirSync(gitHookDir)
    }
    if (['1', 'true'].includes(process.env.GITMARS_SKIP_HOOKS || '')) {
        sh.echo(warning('已存在环境变量GITMARS_SKIP_HOOKS，跳过安装'))
        process.exit(0)
    }
    // git版本过旧
    if (!gitVersionIsNew) {
        sh.echo(
            warning(
                'Gitmars需要使用2.13.0以上版本的Git，当前版本：' + gitVersion
            )
        )
        process.exit(0)
    }
    createHooks(gitHookDir)
    createHookShell(gitHookDir)
    createLocalShell(gitHookDir, 'yarn', prefix)
    console.info('gitmars hooks init down')
}

/**
 * 移除钩子
 */
function remove(): void {
    removeHooks()
    removeHookShell()
    removeLocalShell()
    console.info('gitmars hooks removed')
}

module.exports = {
    init,
    remove,
    createHooks,
    removeHooks,
    createHookShell,
    removeHookShell,
    createLocalShell,
    removeLocalShell
}
export {}

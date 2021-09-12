const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
const { warning, getCurrent, getLogs, compareVersion } = require('../index')
const { hookList } = require('../global')
const gitRevParse = require('../gitRevParse')
const getGitVersion = require('../getGitVersion')
const getHookComment = require('./getHookComment')
const getHookType = require('./getHookType')
const getHookShell = require('./getHookShell')
const getLocalShell = require('./getLocalShell')
const ciInfo = require('ci-info')
const getConfig = require('../getConfig')
const current = getCurrent()
const { gitHookDir, prefix } = gitRevParse()
const gitVersion = getGitVersion()
const config = getConfig()

import { GitLogType } from '../../../typings'

export interface IsUpdatedInTimeConfigType {
    latest: string
    limit: string | number
    branch: string
}

/**
 * createHooks
 * @description 创建git钩子
 * @param {String} dir default=gitHookDir
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
            if (getHookType.isGitmars(hook) || getHookType.isHusky(hook) || getHookType.isYorkie(hook)) {
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
 * removeHooks
 * @description 创建git钩子
 * @param {String} dir default=gitHookDir
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
 * createHookShell
 * @description 创建主程序
 */
function createHookShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.sh')
    fs.writeFileSync(filename, getHookShell(), 'utf-8')
    fs.chmodSync(filename, 0o0755)
}

/**
 * removeHookShell
 * @description 移除主程序
 */
function removeHookShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * createLocalShell
 * @description 创建本地脚本
 */
function createLocalShell(dir: string = gitHookDir, pmName: string, relativeUserPkgDir: string): void {
    const filename = path.join(dir, 'gitmars.local.sh')
    fs.writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), 'utf-8')
    fs.chmodSync(filename, 0o0755)
}

/**
 * removeLocalShell
 * @description 移除本地脚本
 */
function removeLocalShell(dir: string = gitHookDir): void {
    const filename = path.join(dir, 'gitmars.local.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * getIsMergedBranch
 * @description 1. 获取是否合并过dev
 */
function getIsMergedBranch(branch: string = current, targetBranch = 'dev'): boolean {
    const result = sh.exec(`git branch --contains ${branch}`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result.split('\n').includes(targetBranch)
}

/**
 * getIsUpdatedInTime
 * @description 2. 获取一周内是否同步过上游分支代码
 */
function getIsUpdatedInTime({ latest, limit, branch: branches }: IsUpdatedInTimeConfigType): boolean {
    let isUpdated = false
    const mainVers: string[] = []
    const currentVers: string[] = []
    const mainLogs = getLogs({ latest, limit, branches })
    const currentLogs = getLogs({ latest, limit, branches: current })
    mainLogs.forEach((log: GitLogType) => {
        mainVers.push(log['%H'])
    })
    currentLogs.forEach((log: GitLogType) => {
        const arr = log['%P'] ? log['%P'].split(' ') : []
        arr.forEach((item: string) => {
            currentVers.push(item)
        })
    })
    mainVer: for (const ver of mainVers) {
        if (currentVers.includes(ver)) {
            isUpdated = true
            break mainVer
        }
    }
    return isUpdated
}

/**
 * getIsMergeAction
 * @description 3. 获取主干分支推送的内容是否是merge内容，暂时只检测最后一条记录
 */
function getIsMergeAction(): boolean {
    const currentLogs = getLogs({
        limit: 1,
        branches: current
    })
    const p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []
    return p.length > 1
}

/**
 * getBehandLogs
 * @description 获取当前本地分支落后远程的日志
 */
function getBehandLogs(): string[] {
    sh.exec('git fetch', { silent: true })
    const result = sh.exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result ? result.split('\n') : []
}

/**
 * getAheadLogs
 * @description 获取当前本地分支领先远程的日志
 */
function getAheadLogs(): string[] {
    sh.exec('git fetch', { silent: true })
    const result = sh.exec(`git log origin/${current}..${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result ? result.split('\n') : []
}

/**
 * init
 * @description 初始化钩子
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
        sh.echo(warning('Gitmars需要使用2.13.0以上版本的Git，当前版本：' + gitVersion))
        process.exit(0)
    }
    createHooks(gitHookDir)
    createHookShell(gitHookDir)
    createLocalShell(gitHookDir, 'yarn', prefix)
    console.info('gitmars hooks init down')
}

/**
 * remove
 * @description 移除钩子
 */
function remove(): void {
    removeHooks()
    removeHookShell()
    removeLocalShell()
    console.info('gitmars hooks removed')
}

module.exports = {
    // createHooks,
    // removeHooks,
    // createHookShell,
    // removeHookShell,
    // createLocalShell,
    // removeLocalShell,
    init,
    remove,

    getIsMergedBranch,
    getIsUpdatedInTime,
    getIsMergeAction,
    getBehandLogs,
    getAheadLogs
}

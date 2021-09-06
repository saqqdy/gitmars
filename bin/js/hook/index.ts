import fs from 'fs'
import path from 'path'
import sh from 'shelljs'
import { warning, getCurrent, getLogs, compareVersion } from '../index'
import { hookList } from '../global'
import gitRevParse from '../gitRevParse'
import getGitVersion from '../getGitVersion'
import getHookComment from './getHookComment'
import getHookType from './getHookType'
import getHookShell from './getHookShell'
import getLocalShell from './getLocalShell'
import ciInfo from 'ci-info'
const current = getCurrent()
const { gitHookDir, prefix } = gitRevParse()
const gitVersion = getGitVersion()

/**
 * createHooks
 * @description 创建git钩子
 * @param {String} dir default=gitHookDir
 */
function createHooks(dir = gitHookDir) {
    // 创建hook文件方法
    const writeHook = (filename, shell) => {
        fs.writeFileSync(filename, shell, 'utf-8')
        fs.chmodSync(filename, 0o0755)
    }
    const hooks = hookList.map(hookName => path.join(dir, hookName))
    hooks.forEach(filename => {
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
function removeHooks(dir = gitHookDir) {
    const hooks = hookList.map(hookName => path.join(dir, hookName))
    hooks
        .filter(filename => {
            if (fs.existsSync(filename)) {
                const hook = fs.readFileSync(filename, 'utf-8')
                return getHookType.isGitmars(hook)
            }
            return false
        })
        .forEach(filename => {
            fs.unlinkSync(filename)
        })
}

/**
 * createHookShell
 * @description 创建主程序
 */
function createHookShell(dir = gitHookDir) {
    let filename = path.join(dir, 'gitmars.sh')
    fs.writeFileSync(filename, getHookShell(), 'utf-8')
    fs.chmodSync(filename, 0o0755)
}

/**
 * removeHookShell
 * @description 移除主程序
 */
function removeHookShell(dir = gitHookDir) {
    const filename = path.join(dir, 'gitmars.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * createLocalShell
 * @description 创建本地脚本
 */
function createLocalShell(dir = gitHookDir, pmName, relativeUserPkgDir) {
    let filename = path.join(dir, 'gitmars.local.sh')
    fs.writeFileSync(filename, getLocalShell(pmName, relativeUserPkgDir), 'utf-8')
    fs.chmodSync(filename, 0o0755)
}

/**
 * removeLocalShell
 * @description 移除本地脚本
 */
function removeLocalShell(dir = gitHookDir) {
    const filename = path.join(dir, 'gitmars.local.sh')
    if (fs.existsSync(filename)) fs.unlinkSync(filename)
}

/**
 * getIsMergedBranch
 * @description 1. 获取是否合并过dev
 */
function getIsMergedBranch(branch = current, targetBranch = 'dev') {
    const result = sh.exec(`git branch --contains ${branch}`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result.split('\n').includes(targetBranch)
}

/**
 * getIsUpdatedInTime
 * @description 2. 获取一周内是否同步过上游分支代码
 */
function getIsUpdatedInTime({ latest, limit, branch: branches }) {
    let isUpdated = false,
        mainVers = [],
        currentVers = []
    const mainLogs = getLogs({ latest, limit, branches })
    const currentLogs = getLogs({ latest, limit, branches: current })
    mainLogs.forEach(log => {
        mainVers.push(log['%H'])
    })
    currentLogs.forEach(log => {
        let arr = log['%P'] ? log['%P'].split(' ') : []
        arr.forEach(item => {
            currentVers.push(item)
        })
    })
    mainVer: for (let ver of mainVers) {
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
function getIsMergeAction() {
    const currentLogs = getLogs({
        limit: 1,
        branches: current
    })
    let p = currentLogs[0]['%P'] ? currentLogs[0]['%P'].split(' ') : []
    return p.length > 1
}

/**
 * getBehandLogs
 * @description 获取当前本地分支落后远程的日志
 */
function getBehandLogs() {
    sh.exec(`git fetch`, { silent: true })
    const result = sh.exec(`git log ${current}..origin/${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result ? result.split('\n') : []
}

/**
 * getAheadLogs
 * @description 获取当前本地分支领先远程的日志
 */
function getAheadLogs() {
    sh.exec(`git fetch`, { silent: true })
    const result = sh.exec(`git log origin/${current}..${current} --pretty=format:"%p"`, { silent: true }).stdout.replace(/[\s]*$/g, '')
    return result ? result.split('\n') : []
}

/**
 * init
 * @description 初始化钩子
 */
function init() {
    const gitVersionIsNew = compareVersion(gitVersion, '2.13.0')
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
function remove() {
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

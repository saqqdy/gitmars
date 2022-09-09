import { spawnSync } from '@gitmars/core/lib/spawn'
import { debug } from '@gitmars/core/lib/utils/debug'
import getCurrentBranch from '@gitmars/core/lib/git/getCurrentBranch'
import cleanConfigSet from '@gitmars/core/lib/go/cleanConfigSet'
import getCommand from '@gitmars/core/lib/go/getCommand'

import combineConfig from '#lib/conf/combine'
import endConfig from '#lib/conf/end'
import updateConfig from '#lib/conf/update'
import undoConfig from '#lib/conf/undo'
import redoConfig from '#lib/conf/redo'
import branchConfig from '#lib/conf/branch'
import buildConfig from '#lib/conf/build'
import startConfig from '#lib/conf/start'
import copyConfig from '#lib/conf/copy'
import getConfig from '#lib/conf/get'
import saveConfig from '#lib/conf/save'
import cleanbranchConfig from '#lib/conf/cleanbranch'
import cleanConfig from '#lib/conf/clean'
import revertConfig from '#lib/conf/revert'
import linkConfig from '#lib/conf/link'
import unlinkConfig from '#lib/conf/unlink'
import postmsgConfig from '#lib/conf/postmsg'
import adminConfig from '#lib/conf/admin'

const {
    create: adminCreateConfig,
    publish: adminPublishConfig,
    update: adminUpdateConfig,
    clean: adminCleanConfig
} = adminConfig
const current = getCurrentBranch()
const branchPrefix = current.split('/')[0]
const functionBranches = ['feature', 'bugfix', 'support']

// 新建功能分支
export const start = async () => {
    const config = cleanConfigSet(startConfig)
    const command = 'start ' + (await getCommand(config))
    debug('start', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 合并代码
export const combine = async () => {
    const requiredOptions: string[] = []
    let delOptions: string[] = [],
        delArgs: string[] = [],
        requiredArgs: string[] = []
    if (!functionBranches.includes(branchPrefix)) {
        // 非功能分支不需要执行这些动作
        delOptions = ['--as-feature', '--no-bugfix']
        requiredArgs = ['type', 'name']
    } else {
        delArgs = ['type', 'name']
        // 功能分支
        switch (branchPrefix) {
            case 'feature':
                delOptions = ['--as-feature']
                break
            case 'support':
                delOptions = ['--as-feature']
                break
            default:
                break
        }
    }
    const config = cleanConfigSet(combineConfig, {
        delOptions,
        requiredOptions,
        delArgs,
        requiredArgs
    })
    const command = 'combine ' + (await getCommand(config))
    debug('combine', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 合并代码并删除
export const end = async () => {
    let delArgs: string[] = [],
        requiredArgs: string[] = []
    if (!functionBranches.includes(branchPrefix)) {
        // 非功能分支不需要执行这些动作
        requiredArgs = ['type', 'name']
    } else {
        delArgs = ['type', 'name']
    }
    const config = cleanConfigSet(endConfig, { delArgs, requiredArgs })
    const command = 'end ' + (await getCommand(config))
    debug('end', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 同步上游分支代码
export const update = async () => {
    let delArgs: string[] = [],
        requiredArgs: string[] = []
    if (!functionBranches.includes(branchPrefix)) {
        // 非功能分支不需要执行这些动作
        requiredArgs = ['type', 'name']
    } else {
        delArgs = ['type', 'name']
    }
    const config = cleanConfigSet(updateConfig, { delArgs, requiredArgs })
    const command = 'update ' + (await getCommand(config))
    debug('update', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 撤回代码
export const undo = async () => {
    const config = cleanConfigSet(undoConfig)
    const command = 'undo ' + (await getCommand(config))
    debug('undo', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 撤销撤回记录
export const redo = async () => {
    const config = cleanConfigSet(redoConfig)
    const command = 'redo ' + (await getCommand(config))
    debug('redo', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// branch分支操作指令
export const branch = async () => {
    const config = cleanConfigSet(branchConfig)
    const command = 'branch ' + (await getCommand(config))
    debug('branch', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 构建指令
export const build = async () => {
    const config = cleanConfigSet(buildConfig)
    const command = 'build ' + (await getCommand(config))
    debug('build', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 复制、cherry-pick
export const copy = async () => {
    const config = cleanConfigSet(copyConfig)
    const command = 'copy ' + (await getCommand(config))
    debug('copy', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 从暂存区取出
export const get = async () => {
    const config = cleanConfigSet(getConfig)
    const command = 'get ' + (await getCommand(config))
    debug('get', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 存入暂存区
export const save = async () => {
    const config = cleanConfigSet(saveConfig)
    const command = 'save ' + (await getCommand(config))
    debug('save', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 清理合并过的功能分支
export const cleanbranch = async () => {
    const config = cleanConfigSet(cleanbranchConfig)
    const command = 'cleanbranch ' + (await getCommand(config))
    debug('cleanbranch', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 清理缓存
export const clean = async () => {
    const config = cleanConfigSet(cleanConfig)
    const command = 'clean ' + (await getCommand(config))
    debug('clean', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// revert撤回
export const revert = async () => {
    const config = cleanConfigSet(revertConfig)
    const command = 'revert ' + (await getCommand(config))
    debug('revert', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// link创建软链
export const link = async () => {
    const config = cleanConfigSet(linkConfig)
    const command = 'link ' + (await getCommand(config))
    debug('link', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// unlink取消软链
export const unlink = async () => {
    const config = cleanConfigSet(unlinkConfig)
    const command = 'unlink ' + (await getCommand(config))
    debug('unlink', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// postmsg发送消息
export const postmsg = async () => {
    const config = cleanConfigSet(postmsgConfig)
    const command = 'postmsg ' + (await getCommand(config))
    debug('postmsg', command)
    spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
}

// 管理员操作
export const admin = {
    create: async () => {
        const config = cleanConfigSet(adminCreateConfig)
        const command = 'admin create ' + (await getCommand(config))
        debug('admin create', command)
        spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
    },
    publish: async () => {
        const config = cleanConfigSet(adminPublishConfig)
        const command = 'admin publish ' + (await getCommand(config))
        debug('admin publish', command)
        spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
    },
    update: async () => {
        const config = cleanConfigSet(adminUpdateConfig)
        const command = 'admin update ' + (await getCommand(config))
        debug('admin update', command)
        spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
    },
    clean: async () => {
        const config = cleanConfigSet(adminCleanConfig)
        const command = 'admin clean ' + (await getCommand(config))
        debug('admin clean', command)
        spawnSync('gitm', command.split(' '), { stdio: 'inherit' })
    }
}

const sh = require('shelljs')
const { getCurrent } = require('../index')
const getCommand = require('./getCommand')
const cleanConfig = require('./cleanConfig')

const combineConfig = require('../../conf/combine')
const endConfig = require('../../conf/end')
const updateConfig = require('../../conf/update')
const branchConfig = require('../../conf/branch')
const buildConfig = require('../../conf/build')
const startConfig = require('../../conf/start')
const copyConfig = require('../../conf/copy')
const getConfig = require('../../conf/get')
const saveConfig = require('../../conf/save')
const revertConfig = require('../../conf/revert')
const linkConfig = require('../../conf/link')
const unlinkConfig = require('../../conf/unlink')
const postmsgConfig = require('../../conf/postmsg')
const { create: adminCreateConfig, publish: adminPublishConfig, update: adminUpdateConfig, clean: adminCleanConfig } = require('../../conf/admin')

const current = getCurrent()
const branchPrefix = current.split('/')[0]
const functionBuanchs = ['feature', 'bugfix', 'support']

// 新建功能分支
export const start = async () => {
    const config = cleanConfig(startConfig)
    const command = 'gitm start ' + (await getCommand(config))
    sh.exec(command)
}

// 合并代码
export const combine = async () => {
    let delOptions: string[] = [],
        delArgs: string[] = [],
        requiredOptions: string[] = [],
        requiredArgs: string[] = []
    if (!functionBuanchs.includes(branchPrefix)) {
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
    const config = cleanConfig(combineConfig, { delOptions, requiredOptions, delArgs, requiredArgs })
    const command = 'gitm combine ' + (await getCommand(config))
    sh.exec(command)
}

// 合并代码并删除
export const end = async () => {
    let delArgs: string[] = [],
        requiredArgs: string[] = []
    if (!functionBuanchs.includes(branchPrefix)) {
        // 非功能分支不需要执行这些动作
        requiredArgs = ['type', 'name']
    } else {
        delArgs = ['type', 'name']
    }
    const config = cleanConfig(endConfig, { delArgs, requiredArgs })
    const command = 'gitm end ' + (await getCommand(config))
    sh.exec(command)
}

// 同步上游分支代码
export const update = async () => {
    let delArgs: string[] = [],
        requiredArgs: string[] = []
    if (!functionBuanchs.includes(branchPrefix)) {
        // 非功能分支不需要执行这些动作
        requiredArgs = ['type', 'name']
    } else {
        delArgs = ['type', 'name']
    }
    const config = cleanConfig(updateConfig, { delArgs, requiredArgs })
    const command = 'gitm update ' + (await getCommand(config))
    sh.exec(command)
}

// branch分支操作指令
export const branch = async () => {
    const config = cleanConfig(branchConfig)
    const command = 'gitm branch ' + (await getCommand(config))
    sh.exec(command)
}

// 构建指令
export const build = async () => {
    const config = cleanConfig(buildConfig)
    const command = 'gitm build ' + (await getCommand(config))
    sh.exec(command)
}

// 复制、cherry-pick
export const copy = async () => {
    const config = cleanConfig(copyConfig)
    const command = 'gitm copy ' + (await getCommand(config))
    sh.exec(command)
}

// 从暂存区取出
export const get = async () => {
    const config = cleanConfig(getConfig)
    const command = 'gitm get ' + (await getCommand(config))
    sh.exec(command)
}

// 存入暂存区
export const save = async () => {
    const config = cleanConfig(saveConfig)
    const command = 'gitm save ' + (await getCommand(config))
    sh.exec(command)
}

// revert撤回
export const revert = async () => {
    const config = cleanConfig(revertConfig)
    const command = 'gitm revert ' + (await getCommand(config))
    sh.exec(command)
}

// link创建软链
export const link = async () => {
    const config = cleanConfig(linkConfig)
    const command = 'gitm link ' + (await getCommand(config))
    sh.exec(command)
}

// unlink取消软链
export const unlink = async () => {
    const config = cleanConfig(unlinkConfig)
    const command = 'gitm unlink ' + (await getCommand(config))
    sh.exec(command)
}

// postmsg发送消息
export const postmsg = async () => {
    const config = cleanConfig(postmsgConfig)
    const command = 'gitm postmsg ' + (await getCommand(config))
    sh.exec(command)
}

// 管理员操作
export const admin = {
    create: async () => {
        const config = cleanConfig(adminCreateConfig)
        const command = 'gitm admin create ' + (await getCommand(config))
        sh.exec(command)
    },
    publish: async () => {
        const config = cleanConfig(adminPublishConfig)
        const command = 'gitm admin publish ' + (await getCommand(config))
        sh.exec(command)
    },
    update: async () => {
        const config = cleanConfig(adminUpdateConfig)
        const command = 'gitm admin update ' + (await getCommand(config))
        sh.exec(command)
    },
    clean: async () => {
        const config = cleanConfig(adminCleanConfig)
        const command = 'gitm admin clean ' + (await getCommand(config))
        sh.exec(command)
    }
}

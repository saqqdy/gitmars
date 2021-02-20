const sh = require('shelljs')
const { getCurrent } = require('./index')
const getCommand = require('./go/getCommand')
const cleanConfig = require('./go/cleanConfig')

const combineConfig = require('../conf/combine')
const endConfig = require('../conf/end')
const updateConfig = require('../conf/update')
const buildConfig = require('../conf/build')
const startConfig = require('../conf/start')
const { create: adminCreateConfig, publish: adminPublishConfig, update: adminUpdateConfig, clean: adminCleanConfig } = require('../conf/admin')

const current = getCurrent()
const branchPrefix = current.split('/')[0]
const functionBuanchs = ['feature', 'bugfix', 'support']

// 新建功能分支
exports.start = async () => {
    const config = cleanConfig(startConfig)
    const command = 'gitm start ' + (await getCommand(config))
    sh.exec(command)
}

// 合并代码
exports.combine = async () => {
    let delOptions = [],
        delArgs = [],
        requiredOptions = [],
        requiredArgs = []
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
exports.end = async () => {
    let delArgs = [],
        requiredArgs = []
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
exports.update = async () => {
    let delArgs = [],
        requiredArgs = []
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
exports.branch = async () => {
    console.log('即将支持，敬请期待！')
    sh.exec('gitm -v')
}

// 构建指令
exports.build = async () => {
    const config = cleanConfig(buildConfig)
    const command = 'gitm build ' + (await getCommand(config))
    sh.exec(command)
}

// 复制、cherry-pick
exports.copy = async () => {
    console.log('即将支持，敬请期待！')
    sh.exec('gitm -v')
}

// 从暂存区取出
exports.get = async () => {
    console.log('即将支持，敬请期待！')
    sh.exec('gitm -v')
}

// 存入暂存区
exports.save = async () => {
    console.log('即将支持，敬请期待！')
    sh.exec('gitm -v')
}

// revert撤回
exports.revert = async () => {
    console.log('即将支持，敬请期待！')
    sh.exec('gitm -v')
}

// 管理员操作
exports.admin = {
    create: async () => {},
    publish: async () => {
        const config = cleanConfig(adminPublishConfig)
        const command = 'gitm admin publish ' + (await getCommand(config))
        sh.exec(command)
    },
    update: async () => {},
    clean: async () => {}
}

const sh = require('shelljs')
const { defaults } = require('./global')
const gitRevParse = require('./gitRevParse')
const configFrom = require('./configFrom')
const { root } = gitRevParse()

import type { GitmarsConfigType } from 'typings'

/**
 * getConfig
 * @description 读取配置
 * @returns {Object} arr 返回配置对象
 */
const getConfig = (): GitmarsConfigType => {
    let config: any = {}
    if (configFrom === 1) {
        const str = sh
            .cat(root + '/.gitmarsrc')
            .stdout.replace(/(^\n*)|(\n*$)/g, '')
            .replace(/\n{2,}/g, '\n')
            .replace(/\r/g, '')
            // eslint-disable-next-line no-control-regex
            .replace(/[^\S\x0a\x0d]/g, '')
        let arr: string[] = []
        if (str) arr = str.split('\n')
        arr.forEach((el: string) => {
            el.replace(/^([a-zA-Z0-9]+)\=([\s\S]+)$/, (a: string, b: string, c: string) => {
                config[b] = c || null
                return ''
            })
        })
    } else if (configFrom === 2) {
        config = require(root + '/gitmarsconfig.json')
    }
    return { ...defaults, ...config }
}
module.exports = getConfig()
